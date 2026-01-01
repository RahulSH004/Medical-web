import { Router } from "express";
import { getTestController } from "../controllers/tests.controller";

const testsRouter = Router();

testsRouter.get("/tests", getTestController);

export default testsRouter;