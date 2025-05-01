import axios from 'axios';

export const api = async ({ method = 'GET', url, data = {}, params = {}, headers = {} }) => {
    try {
        const response = await axios({
            method,
            url,
            data: ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) ? data : undefined,
            params: ['GET', 'DELETE'].includes(method.toUpperCase()) ? data : params,
            headers,
        });

        return response.data;
    } catch (error) {
        let status = null;
        let message = 'Something went wrong';
        let details = null;

        if (error.response) {
            status = error.response.status;
            message = error.response.data?.message || `Request failed with status ${status}`;
            details = error.response.data;
        } else if (error.request) {
            message = 'No response received from server';
        } else {
            message = error.message;
        }

        console.error('API Error:', { status, message, details });
        throw {
            success: false,
            status,
            message,
            details,
        };
    }
};
