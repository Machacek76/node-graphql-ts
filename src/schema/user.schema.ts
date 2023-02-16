import { getModelForClass, prop, pre, ReturnModelType, queryMethod, index } from '@typegoose/typegoose'
import { AsQueryMethod } from '@typegoose/typegoose/lib/types';
import { IsEmail, MinLength, MaxLength } from 'class-validator';
import { Field, InputType, ObjectType } from "type-graphql";
import bcrypt from 'bcrypt'


function findByEmail(
	this: ReturnType<typeof User, QueryHelpers>,
	email: User['email']) {
	return this.findOne({email})
}

function QueryHelpers(
	findByEmail: AsQueryMethod<typeof findByEmail>
)


@pre<User>('save', async function () {
	// Check that the password is beign modified
	if (!this.isModified('password')) {
		return
	}

	const salt = await bcrypt.genSalt(10)
	const hash = await bcrypt.hashSync(this.password, salt)

	this.password = hash;
})

@index({email: 1})
@queryMethod(findByEmail)
@ObjectType()
export class User {
	@Field(() => String)
	_id: string

	@Field(() => String)
	@prop({ requred: true })
	name: string

	@Field(() => String)
	@prop({ requred: true })
	email: string

	@prop({ requred: true })
	password: string
}

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6, {
    message: "password must be at least 6 characters long",
  })
  @MaxLength(50, {
    message: "password must not be longer than 50 characters",
  })
  @Field(() => String)
  password: string;
}

@InputType()
export class LoginInput {
	@Field(() => String)
	email: string

	@Field(() => String)
	password: string

}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User);
