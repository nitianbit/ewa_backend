import authRouter from "../modules/auth/routes.js";
import defaultRouter from "../modules/default/routes/index.js";

 
export const routes=[
    {
        path: '/api',
        router: authRouter,
        middlewares: []
    },
    {
        path: '/api',
        router: defaultRouter,
        middlewares: []
    },
   
]

 