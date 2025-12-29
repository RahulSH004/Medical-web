import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes";
import reportrouter from "./routes/report.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ message: 'OK' });
});
app.use("/api/auth", authRouter);
app.use("/api", reportrouter)

export default app;
