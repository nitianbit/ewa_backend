import adminRouter from "../modules/admin/routes.js";
import authRouter from "../modules/auth/routes.js";
import bulkUploadRouter from "../modules/bulk-upload/routes/index.js";
import dashboardRouter from "../modules/dashboard/routes.js";
import defaultRouter from "../modules/default/routes/index.js";
import { MODULES } from "../modules/default/utils/helper.js";
import fileRouter from "../modules/file/routes.js";
import { verifyToken } from "../modules/middlewares/index.js";
import patientRouter from "../modules/patients/routes.js";
import formRouter from "../modules/form/routes.js";

 
export const routes=[
    {
        path: '/api/auth',
        router: authRouter,
        middlewares: []
    },
    {
        path: '/api/bulk-upload/:module',
        router: bulkUploadRouter,
        middlewares: [verifyToken]
    },


    {
        path: '/api/dashboard',
        router: dashboardRouter,
        middlewares: [verifyToken]
    },

    {
        path: '/api/admin',
        router: adminRouter,
        middlewares: [verifyToken]
    },
    {
        path: '/api/file',
        router: fileRouter,
        middlewares: []
    },
    {
        path: `/api/${MODULES.PATIENTS}`,
        router: patientRouter,
        middlewares: []
    },

    {
        path: '/api',
        router: defaultRouter,
        middlewares: []
    },
    {
        path: '/api/form',
        router : formRouter,
        middlewares: []
    },
   
]

 