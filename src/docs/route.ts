import swaggerUi from 'swagger-ui-express'
import { Express } from "express-serve-static-core"
import swaggerDocument from './swagger-output.json'

import fs from 'fs';
import path from 'path';


const docs = (app: Express) => {
    const styleCss = fs.readFileSync(path.resolve(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css"), 'utf-8');

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        customCss: styleCss
    }));
} 

export default docs;