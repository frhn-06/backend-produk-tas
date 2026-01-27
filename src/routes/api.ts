import express from 'express'

import dummyController from '../controllers/dummy.controller';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';


const router = express.Router();

router.get('/dummy', dummyController.dummy)


// ------------------------------------------------------------------------------------------

router.post("/auth/register", authController.register
    /**
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegisterRequest"
            }
          }
        }
      } 
    */
);

router.post("/auth/activation", authController.activation
    /**
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Activation"
            }
          }
        }
      } 
    */
);

router.post("/auth/login", authController.login
    /**
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginRequest"
            }
          }
        }
      } 
    */
);

router.get("/auth/me", authMiddleware, authController.me
    /**
      #swagger.tags = ['Auth']
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);


// ------------------------------------------------------------------------------------------


export default router;