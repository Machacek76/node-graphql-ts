import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql"
import { CreateUserInput, LoginInput, User } from '../schema/user.schema'
import UserService from "../service/user.service"
import IContext from "../types/context";

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

	@Mutation(() => User)
  createUser(@Arg("input") input: CreateUserInput) {
    return this.userService.createUser(input);
  }

	@Mutation(() => String)
  loginUser(@Arg("input") input: LoginInput, @Ctx() context: IContext) {
    return this.userService.Login(input);
  }

	@Query(() => User)
	me() {
		return {
			_id: '123',
			name: 'Jane Doe',
			email: 'jane@doe.com'
		}
	}
}
