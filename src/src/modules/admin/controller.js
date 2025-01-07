
import { USER_TYPE } from "../../db/models/Admins.js";
import { isValidEmail } from "../default/utils/helper.js";
import { getModule } from "../default/utils/helper.js";



export const getAllUserPagination = async (req, res, module) => {
    try {
        const page = parseInt(req.query.page, 10);
        const rowsPerPage = parseInt(req.query.rowsPerPage, 10);
        const searchQuery = req.query.name || req.query.email;
        const role = req.query.role;
        const module = req.params.module;
        const Model = getModule(module)

        if (isNaN(page) || page <= 0 || isNaN(rowsPerPage) || rowsPerPage <= 0) {
            return res.status(400).json({ error: 'Invalid pagination parameters' });
        }

        let query = {};
        const filters = [];

        if (searchQuery) {
            filters.push({
                $or: [
                    { name: new RegExp(searchQuery, 'i') },
                    { email: new RegExp(searchQuery, 'i') },
                ],
            });
        }

        if (!role) {
            query.role = "";
        } else if (role !== "All Users") {
            query.role = new RegExp(role, 'i');
        }

        if (filters.length > 0) {
            query.$and = filters;
        }

        const totalUsers = await Model.countDocuments(query);

        const users = await Model.aggregate([
            { $match: query },
            {
                $lookup: {
                    localField: '_id',
                    foreignField: 'user',
                },
            },
            { $unwind: { path: '$balance', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'models',
                    localField: 'additionalModels',
                    foreignField: '_id',
                    as: 'additionalModels',
                    pipeline: [
                        { $match: { isDefault: false, disable: false } } // Filtering here
                    ]
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    role: 1
                },
            },
            { $skip: (page - 1) * rowsPerPage },
            { $limit: rowsPerPage },
        ]);

        res.status(200).json({
            users,
            page,
            totalPages: Math.ceil(totalUsers / rowsPerPage),
            totalUsers,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

export const addBulkUsers = async (req, res) => {
    try {
        const module = req.params.module;
        const Model = getModule(module)

        const { email, ...data } = req.body;
        const emails = email.split(/[,\n\s]+/);

        if (!emails || emails.length === 0) {
            return res.status(400).json({ error: 'Emails are required' });
        }

        const bulkWriteOps = [];
        const validEmails = emails.map(email => isValidEmail(email.trim()) ? email.trim() : null).filter(Boolean);

        const users = await Model.find({ email: { $in: validEmails } }).select("email")

        let usersEmails = users.map(user => user?.email);

        for (const email of validEmails) {
            const existingUser = usersEmails.find(userEmail => userEmail == email);
            if (existingUser) {
                bulkWriteOps.push({
                    updateOne: {
                        filter: { email, role: { $in: [null, '', undefined] } },
                        update: { $set: { role: USER_TYPE } },
                        upsert: false,
                    },
                });
            } else {
                bulkWriteOps.push({
                    insertOne: {
                        document: { email, role: "1013-e", ...data },
                    },
                });
            }
        }
        const result = await Model.bulkWrite(bulkWriteOps);

        const updatedUsers = await Model.find({ email: { $in: validEmails } }).lean()
        for (const user of updatedUsers) {
            await updateBalance(user);
        }
        res.status(201).json({ message: "Bulk Operateion Successful", result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create users' });
    }
}
export const bulkUpdate = async (req, res) => {
    try {
        const module = req.params.module;
        const Model = getModule(module)
        if (!Array.isArray(req.body.ids)) {
            return res.status(400).json({ error: 'Invalid input format' });
        }

        const result = await Model.updateMany(
            { _id: { $in: req.body.ids } },
            { $set: req.body.updateData },
            { new: true }
        );
        res.status(200).json({ message: 'Users updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update users' });
    }
}
export const bulkDelete = async (req, res) => {
    try {
        const module = req.params.module;
        const Model = getModule(module)

        if (!Array.isArray(req.body.ids)) {
            return res.status(400).json({ error: 'Invalid input format' });
        }

        const result = await Model.deleteMany({ _id: { $in: req.body.ids } });
        res.status(200).json({ message: 'Users deleted successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete users' });
    }
}

