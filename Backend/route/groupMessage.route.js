import express from 'express';
import {sendGroupMessage , getGroupMessage} from '../controller/groupMessage.controller.js'
import secureRoute from '../middleware/secureRoute.js';

const router = express.Router();

router.post("/sendGroupMessage", secureRoute, sendGroupMessage);

router.post("/getGroupMessage", secureRoute, getGroupMessage);

export default router;

































