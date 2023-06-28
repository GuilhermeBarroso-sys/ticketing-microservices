import { BadRequestError } from "@gbotickets/common";
import { Password } from "../../../common/password-hash";

import { User } from "../../models/User";
import jwt from "jsonwebtoken";

interface IsigninUseCaseProps {
  email: string;
  password: string;
}

class SigninUseCase {
	async execute({email,password} : IsigninUseCaseProps) {
		const existingUser = await User.findOne({ email });
		if(!existingUser) {
			throw new BadRequestError("User doesn't exists!");
		}
  
		const correctPassword = Password.verifyPassword({password, hashedPassword: existingUser.password});
		if(!correctPassword) {
			throw new BadRequestError("Invalid credentials!");
		}
    
		const userToken = jwt.sign({
			id: existingUser.id,
			email: existingUser.email
		}, process.env.JWT_KEY as string);
		return {
			jwt: userToken,
			user: existingUser
		};
	}
}


export { SigninUseCase };