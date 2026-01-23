import swaggerUi from 'swagger-ui-express'
import { Express } from "express-serve-static-core"
import swaggerDocument from './swagger-output.json'

const docs = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} 

export default docs;