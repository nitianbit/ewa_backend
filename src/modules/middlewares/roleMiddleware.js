import { sendResponse } from '../../utils/helper.js';
import { decodeToken } from '../auth/middlewares';
import { getModule } from '../default/utils/helper.js';

const middleware = async (req, res, next, requiredRole, module) => {
    try {

        const token = req.headers['authorization'];
        if (!token) return sendResponse(res, 401, "UnAuthorized.");


        const decoded = decodeToken(token);
        if (!decodedData.success) return sendResponse(res, 401, "UnAuthorized.");
        const Model = getModule(module);

        const user = await Model.findOne({ _id: decoded?.id });

        if (!user || (user.role !== requiredRole)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const doctorsMiddleware = (req, res, next) => middleware(req, res, next, "1013-e", "doctors");
const laboratoriesMiddleware = (req, res, next) => middleware(req, res, next, "1013-e", "laboratories");

module.exports = { middleware, doctorsMiddleware, laboratoriesMiddleware };