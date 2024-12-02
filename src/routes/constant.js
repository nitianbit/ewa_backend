import authRouter from "../modules/auth/routes.js";
import dashboardRouter from "../modules/dashboard/routes.js";
import defaultRouter from "../modules/default/routes/index.js";

 
export const routes=[
    {
        path: '/api/auth',
        router: authRouter,
        middlewares: []
    },
    {
        path: '/api',
        router: defaultRouter,
        middlewares: []
    },

    {
        path: '/api/dashboard',
        router: dashboardRouter,
        middlewares: []
    },
   
]

 