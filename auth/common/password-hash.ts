import {randomBytes,createHmac} from "node:crypto";


interface IHashPasswordParams {
  password: string
  salt?: number
}

interface IVerifyPasswordParams {
  password: string
  hashedPassword: string
}

class Password {
	static hashPassword({password, salt = 10} : IHashPasswordParams) {
		const SaltHandler = randomBytes(salt).toString("hex");
		const hash = createHmac("sha256", SaltHandler)
			.update(password)
			.digest("hex");
    
		const hashedPassword = `${SaltHandler}:${hash}`;
		return hashedPassword;
	}

	static verifyPassword({password, hashedPassword}: IVerifyPasswordParams) {
		const [salt, hash] = hashedPassword.split(":");
		const calculatedHash = createHmac("sha256", salt)
			.update(password)
			.digest("hex");
		return hash === calculatedHash;
	}
}




export { Password };

