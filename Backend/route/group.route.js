import express, { Router } from "express";
import {createNewGroup, allGroupDetails, removeGroupMember, addGroupMembers, handleLeaveGroup} from '../controller/group.controller.js'

import secureRoute from "../middleware/secureRoute.js";

const router = Router();

router.post("/createGroup", secureRoute, createNewGroup);

router.get("/getGroups", secureRoute, allGroupDetails);

router.post("/removeGroupMember", secureRoute, removeGroupMember);

router.post("/addGroupMembers", secureRoute, addGroupMembers);

router.post("/leaveGroup", secureRoute, handleLeaveGroup);

export default router;























