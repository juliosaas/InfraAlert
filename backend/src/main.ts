import alertRouter from "./routes/alertRouter";
import userRouter from "./routes/user";
import app from "./server";

app.use("/user", userRouter);

app.use("/alert", alertRouter);
