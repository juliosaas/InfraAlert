import express from "express";
import userController from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  userController.listAll(req, res);
});

userRouter.post("/auth/register", (req, res) => {
  userController.createuser(req, res);
});

userRouter.post("/auth/login", (req, res) => {
  userController.auth(req, res);
});

userRouter.delete("/:id", (req, res) => {
  userController.deleteUser(req, res);
})

userRouter.put("/:id", (req, res) => {
  userController.update(req, res);
});

export default userRouter;
