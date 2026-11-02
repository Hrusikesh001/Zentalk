import express from "express";
import { signup, login, logout, getUserProfile, editUserProfile, deleteUser, findUsersByUsername, sendUsers, generateAgoraToken, confirmDeleteAccount, deleteFriend, clearChat } from "../controller/user.controller.js";
import { Router } from "express";
import secureRoute from "../middleware/secureRoute.js";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/getUserProfile",secureRoute, getUserProfile);

router.post("/edit", secureRoute, editUserProfile);

router.post("/delete", secureRoute, deleteUser);

router.post("/findUsers", secureRoute, findUsersByUsername);

router.post("/getUsers", secureRoute, sendUsers);

router.post("/generate-token", secureRoute, generateAgoraToken);

router.post("/confirmDeleteAccount", secureRoute, confirmDeleteAccount);

router.post("/deleteFriend", secureRoute, deleteFriend);

router.post("/clearChat", secureRoute, clearChat);

export default router;














