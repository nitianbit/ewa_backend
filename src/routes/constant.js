import adminRouter from "../modules/admin/routes.js";
import authRouter from "../modules/auth/routes.js";
import bulkUploadRouter from "../modules/bulk-upload/routes/index.js";
import dashboardRouter from "../modules/dashboard/routes.js";
import defaultRouter from "../modules/default/routes/index.js";

 
export const routes=[
    {
        path: '/api/auth',
        router: authRouter,
        middlewares: []
    },
    {
        path: '/api/bulk-upload/:module',
        router: bulkUploadRouter,
        middlewares: []
    },


    {
        path: '/api/dashboard',
        router: dashboardRouter,
        middlewares: []
    },

    {
        path: '/api/admin',
        router: adminRouter,
        middlewares: []
    },

    {
        path: '/api',
        router: defaultRouter,
        middlewares: []
    },
   
]

 