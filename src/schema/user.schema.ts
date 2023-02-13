import { getModelForClass, prop, pre } from '@typegoose/typegoose'
import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType, ObjectType } from "type-graphql";
import bcrypt from 'bcrypt'

@pre<User>('save', async function () {
	// Check that the password is beign modified
	if (!this.isModified('password')) {
		return
	}

	const salt = await bcrypt.genSalt(10)
	const hash = await bcrypt.hashSync(this.password, salt)

	this.password = hash;
})
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


export const UserModel = getModelForClass(User);
