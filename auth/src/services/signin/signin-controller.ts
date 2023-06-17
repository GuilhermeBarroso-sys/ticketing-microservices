import { Request, Response } from "express";
import { Validator } from "../../../common/validator";
import { SigninUseCase } from "./signin-use-case";
import { z } from "zod";

class SigninController {
	async handle(request : Request, response: Response) {
		const schema = z.object({
			email: z.string().email("Invalid E-mail!"),
			password: z.string().trim().nonempty("You must type a password")
		});
		Validator.verifyBody({bodyParams: request.body, schema});
		const {email, password} = request.body;
		const signinUseCase = new SigninUseCase();
		const {jwt, user} = await signinUseCase.execute({email,password});
		request.session = {
			jwt
		};
		return response.status(200).json({
			user,
			userToken: jwt
		});
	}
}

export { SigninController};