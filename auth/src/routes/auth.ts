import {Router} from "express";
import { z } from "zod";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../../common/password-hash";
import { Validator } from "../../common/validator";
import { ensureCurrentUser } from "../../middleware/ensure-current-user";
const authRoutes = Router();


authRoutes.post("/signup", async (request, response) => {
	const schema = z.object({
		email: z.string().email("Invalid E-mail!"),
		password: z.string().trim().min(4, "Password must to have 3 or more characters").max(20)
	});
	Validator.verifyBody({bodyParams: request.body, schema});

	const {email,password} = request.body;

	const userExists = await User.findOne({email});
	if(userExists) {
		throw new BadRequestError("Email Already Exists");
	}
	const user = User.build({
		email,
		password
	});

	await user.save();

	const userToken = jwt .sign({
		id: user.id,
		email: user.email
	}, process.env.JWT_KEY as string);

	request.session = {
		jwt: userToken
	};

	return response.status(201).json({user});
});

authRoutes.post("/signin",async  (request, response) => {
	const schema = z.object({
		email: z.string().email("Invalid E-mail!"),
		password: z.string().trim().nonempty("You must type a password")
	});
	Validator.verifyBody({bodyParams: request.body, schema});
	const {email, password} = request.body;
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
  
	request.session = {
		jwt: userToken
	};
  
	return response.status(200).json({
		user: existingUser,
		userToken
	});


});

authRoutes.post("/signout", (request, response) => {
	request.session = null;
	response.status(204).send();
});

authRoutes.get("/currentuser", ensureCurrentUser ,(request, response) => {
	return response.json({currentUser: request.currentUser || null});
});

export { authRoutes };