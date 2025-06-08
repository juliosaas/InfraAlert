import express from "express";
import userController from "../controllers/user.controller";
import alertController from "../controllers/alert.controller";
const alertRouter = express.Router();

alertRouter.get("/", (req, res) => {
    alertController.listAll(req, res);
});

export default alertRouter;