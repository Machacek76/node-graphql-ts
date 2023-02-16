import { Request, Response } from "express";
import { User } from "../schema/user.schema";

interface IContext {
	req: Request;
	res: Response;
	user: User
}

export default IContext;
