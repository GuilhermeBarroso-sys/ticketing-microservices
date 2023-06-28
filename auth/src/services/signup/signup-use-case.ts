import { Request } from "express";
import { User } from "../../models/User";
import jwt from "jsonwebtoken";
import { BadRequestError } from "@gbotickets/common";
interface ISignupUseCaseProps {
  email: string;
  password: string;
}

class SignupUseCase {
  
	async execute({email, password} : ISignupUseCaseProps) {
		const userExists = await User.findOne({email});
		if(userExists) {
			throw new BadRequestError("Email Already Exists");
		}
		const user = User.build({
			email,
			password
		});
		await user.save();
		const userToken = jwt.sign({
			id: user.id,
			email: user.email
		}, process.env.JWT_KEY as string);

		return {
			user,
			jwt: userToken
		};

	}
}

export {SignupUseCase };