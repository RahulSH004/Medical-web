import express from "express";
import cors from "cors";
import authrouter from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ message: 'OK' });
});
app.use("/api/auth", authrouter);

export default app;
