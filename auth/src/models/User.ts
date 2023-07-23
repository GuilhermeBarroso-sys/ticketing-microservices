import mongoose from "mongoose";
import { Password } from "../../common/password-hash";
interface IUserSchema {
  email: string
  password: string;
}




interface UserModel extends mongoose.Model<UserDoc> {
  build(schema : IUserSchema) : UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;

} 

const userSchema = new mongoose.Schema<IUserSchema>({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	toJSON: {
		transform(doc, ret) {
			ret.id = ret._id;
			delete ret.password;
			delete ret._id;
      
		}
	}
});


userSchema.pre("save", function(done) {
	if (this.isModified("password")) {
		const hashed = Password.hashPassword({password: this.get("password")});
		this.set("password", hashed);
	}
	done();
});

userSchema.statics.build = (schema : IUserSchema) => {
	return new User(schema);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };