import  express  from "express";
import { Request, Response, NextFunction  } from "express";
import { register, requestOtp, verifyOtp } from "../controllers/AuthControllers";

const authRouters = express.Router();

authRouters.post('request-otp', requestOtp);
authRouters.post('verify-otp', verifyOtp);
authRouters.post('register', register);

export default authRouters;