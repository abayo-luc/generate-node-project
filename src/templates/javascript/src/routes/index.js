import {
    Router
} from 'express'
import MainController from '../controllers/main'
const routers = Router()

routers.get('/', MainController.home)

export default routers