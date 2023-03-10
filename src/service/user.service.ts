import { ApolloError } from "apollo-server";
import { CreateUserInput, LoginInput, UserModel } from "../schema/user.schema";
import IContext from "../types/context";
import bcrypt from 'bcrypt';
import { signJwt } from "../utils/jwt";

class UserService {

	async createUser(input: CreateUserInput) {
		// call user model to create a user
		return UserModel.create(input);
	}

	async login(input: LoginInput, context: IContext) {
		const error = 'Invalid email or password!';
		// get our user by email
		const user = await UserModel.find().findByEmail(input.email).lean();

		if (!user) {
			throw new ApolloError(error);
		}

		// Validate the password
		const passwordIsValid = await bcrypt.compare(input.password, user.password);
		if (!passwordIsValid) {
			throw new ApolloError(error);
		}

		// Sign a jwt
		const token = signJwt(user);

		// Set a cookie for the jwt
		context.res.cookie("accessToken", token, {
			maxAge: 3.154e10,
			httpOnly: true,
			domain: "localhost",
			path: "/",
			sameSite: "strict",
			secure: process.env.NODE_ENV === 'production',
		});

		// return the jwt

		return token;
	}
}

export default UserService;
