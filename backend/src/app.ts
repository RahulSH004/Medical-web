import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes";
import reportrouter from "./routes/report.route";
import testsRouter from "./routes/tests.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ message: 'OK' });
});
app.use("/api/auth", authRouter);
// app.use("/api", reportrouter)
app.use("/api", testsRouter);

export default app;
