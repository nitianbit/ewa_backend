import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import Patient from '../../../db/models/Patient.js';
import Doctor from '../../../db/models/Doctors.js';

class BulkUploadService {
  
      /**
   * Parse CSV file
   * @param {string} filePath - Path to CSV file
   * @returns {Promise<Array>} Parsed records
   */
  static parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(this.normalizeRecord(data)))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  /**
   * Bulk upload data from CSV to corresponding model
   * @param {Object} options -  options for bulk upload
   * @returns {Promise<Object>} Upload statistics
   */
  static async bulkUpload(options) {
    const {
      model,
      filePath,
      uniqueFields = [],
      transformations = {},
      validationRules = {},
      skipExisting = true,
      batchSize = 100
    } = options;

    // Validation checks
    if (!model || !filePath) {
      throw new Error('Model and file path are required');
    }

    // Prepare tracking variables
    const results = {
      total: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };

    // Parse CSV file
    const records = await this.parseCSV(filePath);
    results.total = records.length;

    // Process records in batches
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await this.processBatch(batch, {
        model,
        uniqueFields,
        transformations,
        validationRules,
        skipExisting,
        results
      });
    }

    return results;
  }



  /**
   * Process a batch of records
   * @param {Array} batch - Batch of records to process
   * @param {Object} options - Processing options
   */
  static async processBatch(batch, options) {
    const {
      model,
      uniqueFields,
      transformations,
      validationRules,
      skipExisting,
      results
    } = options;

    const bulkOperations = [];

    for (const record of batch) {
      try {
        // Apply transformations
        const transformedRecord = this.applyTransformations(record, transformations);

        // Validate record
        const validationErrors = this.validateRecord(transformedRecord, validationRules);
        if (validationErrors.length > 0) {
          results.errors.push({
            record,
            errors: validationErrors
          });
          results.skipped++;
          continue;
        }

        // Prepare unique filter
        const uniqueFilter = this.createUniqueFilter(transformedRecord, uniqueFields);

        // Prepare bulk operation
        if (skipExisting) {
          bulkOperations.push({
            updateOne: {
              filter: uniqueFilter,
              update: { $set: transformedRecord },
              upsert: true
            }
          });
          results.updated++;
        } else {
          bulkOperations.push({
            insertOne: { document: transformedRecord }
          });
          results.inserted++;
        }
      } catch (error) {
        results.errors.push({
          record,
          error: error.message
        });
        results.skipped++;
      }
    }

    // Execute bulk write if there are operations
    if (bulkOperations.length > 0) {
      try {
        await model.bulkWrite(bulkOperations);
      } catch (error) {
        results.errors.push({
          error: 'Bulk write failed',
          details: error.message
        });
      }
    }
  }

  /**
   * Normalize record by trimming and converting data types
   * @param {Object} record - Raw record from CSV
   * @returns {Object} Normalized record
   */
  static normalizeRecord(record) {
    return Object.fromEntries(
      Object.entries(record).map(([key, value]) => [
        key.trim(),
        value.trim() === '' ? null : value.trim()
      ])
    );
  }

  /**
   * Apply transformations to record
   * @param {Object} record - Record to transform
   * @param {Object} transformations - Transformation rules
   * @returns {Object} Transformed record
   */
  static applyTransformations(record, transformations) {
    const transformedRecord = { ...record };

    for (const [field, transformer] of Object.entries(transformations)) {
      if (transformer && record[field]) {
        try {
          transformedRecord[field] = transformer(record[field]);
        } catch (error) {
          throw new Error(`Transformation failed for ${field}: ${error.message}`);
        }
      }
    }

    return transformedRecord;
  }

  /**
   * Validate record against rules
   * @param {Object} record - Record to validate
   * @param {Object} validationRules - Validation rules
   * @returns {Array} Validation errors
   */
  static validateRecord(record, validationRules) {
    const errors = [];

    for (const [field, rules] of Object.entries(validationRules)) {
      const value = record[field];

      if (rules.required && (value === null || value === undefined)) {
        errors.push(`${field} is required`);
      }

      if (rules.type) {
        const typeCheck = {
          string: (v) => typeof v === 'string',
          number: (v) => !isNaN(Number(v)),
          boolean: (v) => ['true', 'false', true, false].includes(v),
          date: (v) => !isNaN(Date.parse(v))
        }[rules.type];

        if (typeCheck && !typeCheck(value)) {
          errors.push(`${field} must be of type ${rules.type}`);
        }
      }

      if (rules.min !== undefined && Number(value) < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
      }

      if (rules.max !== undefined && Number(value) > rules.max) {
        errors.push(`${field} must be at most ${rules.max}`);
      }
    }

    return errors;
  }

  /**
   * Create unique filter for upserting
   * @param {Object} record - Record to create filter for
   * @param {Array} uniqueFields - Fields to use for unique identification
   * @returns {Object} Unique filter
   */
  static createUniqueFilter(record, uniqueFields) {
    if (uniqueFields.length === 0) {
      return {};
    }

    return uniqueFields.reduce((filter, field) => {
      if (record[field] !== null && record[field] !== undefined) {
        filter[field] = record[field];
      }
      return filter;
    }, {});
  }
}


export const bulkUploadPatients = async (filePath) => {
  try {
    const result = await BulkUploadService.bulkUpload({
      model: Patient,
      filePath,
      uniqueFields: ['email', 'phone'],
      transformations: {
        phone: (value) => Number(value),
        countryCode: (value) => Number(value),
        balance: (value) => Number(value) || 0,
        role: (value) => value || USER_TYPE.USER,
        isVerified: (value) => true,
        height:(value) =>Number(value),
        weight:(value) =>Number(value),
        email: (value) => value.toLowerCase(),
        age: (value) => Number(value)
      },
      validationRules: {
        name: { required: true, type: 'string' },
        email: { required: true, type: 'string' },
        phone: { required: true, type: 'number', min: 1, max: 9999999999 },
        balance: { type: 'number', min: 0 }
      },
      skipExisting: true,
      batchSize: 200
    });

    console.log('Bulk Upload Results:', result);
    return result;
  } catch (error) {
    console.error('Bulk Upload Error:', error);
    throw error;
  }
};

export const bulkUploadDoctors = async (filePath) => {
  try {
    const result = await BulkUploadService.bulkUpload({
      model: Doctor,
      filePath,
      uniqueFields: ['email','phone'],
      transformations: {
        fee: (value) => Number(value),
        isIndividual: (value) => value === 'true'
      },
      validationRules: {
        name: { required: true, type: 'string' },
        email: { required: true, type: 'string' },
        specialization: { required: true, type: 'string' },
        fee: { required: true, type: 'number', min: 0 }
      }
    });

    console.log('Bulk Upload Results:', result);
    return result;
  } catch (error) {
    console.error('Bulk Upload Error:', error);
    throw error;
  }
};