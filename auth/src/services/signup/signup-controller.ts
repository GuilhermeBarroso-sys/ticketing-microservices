import { Request, Response } from "express";
import { z } from "zod";
import { Validator } from "../../../common/validator";
import { SignupUseCase } from "./signup-use-case";

class SignupController {
	async handle(request : Request, response : Response) {
		const schema = z.object({
			email: z.string().email("Invalid E-mail!"),
			password: z.string().trim()
				.min(4, "Password size must have between 4 and 20 characters")
				.max(20, "Password size must have between 4 and 20 characters")
		});
		Validator.verifyBody({bodyParams: request.body, schema});
  
		const {email,password} = request.body;
  
		const signupUseCase = new SignupUseCase();
		const {user, jwt} = await signupUseCase.execute({email, password});
		request.session = {
			jwt
		};
		return response.status(201).json({user});
	}
}

export {  SignupController };