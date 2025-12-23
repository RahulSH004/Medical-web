import app from "./app";
import dotenv from "dotenv";
dotenv.config();
import "./config/env";
import { env } from "./config/env";


app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
}); 