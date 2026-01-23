import express from 'express'

import dummyController from '../controllers/dummy.controller';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();


router.get('/dummy', dummyController.dummy)


// ------------------------------------------------------------------------------------------

router.post("/auth/register", authController.register);

router.post("/auth/activation", authController.activation);

router.post("/auth/login", authController.login);

router.get("/auth/me", authMiddleware, authController.me);


// ------------------------------------------------------------------------------------------


export default router;