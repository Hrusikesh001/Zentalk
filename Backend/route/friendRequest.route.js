import express from 'express'
import secureRoute from '../middleware/secureRoute.js'
import { sendFriendRequest, getRequests, handleRequestSubmits } from '../controller/friendRequest.controller.js';

import { Router } from 'express'

const router = Router();

router.post("/sendFriendRequest", secureRoute, sendFriendRequest);

router.post("/getRequests", secureRoute, getRequests);

router.post("/handleRequestSubmits", secureRoute, handleRequestSubmits);

export default router;


















