import { Router } from "express";
import { getTests } from "./tests.controller";
import { validateQuery } from "../../middleware/validate.middleware";
import { getTestsQuerySchema } from "./tests.validation";

const testsRouter = Router();

testsRouter.get("/tests", validateQuery(getTestsQuerySchema), getTests);

export default testsRouter;

