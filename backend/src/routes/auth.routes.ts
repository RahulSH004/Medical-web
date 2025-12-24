import { Router } from "express";
import {login, register} from "../controllers/auth"

const authrouter = Router();

authrouter.post("/signup", register);
authrouter.post("/login", login);

export default authrouter;
