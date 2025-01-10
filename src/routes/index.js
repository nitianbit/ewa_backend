import { routes } from "./constant.js"

const configureRoutes = (app) => {
    routes.forEach(route => {
        app.use(route.path, ...(route.middlewares ?? []), route.router)
    })
}
export default configureRoutes
