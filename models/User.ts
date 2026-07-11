import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

// Used only during development for type checking and autocompletion. In TS we gotta use this interface for model making! 
export interface IUser {
  email: string;
  password: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Defines the actual structure and validation rules
// for documents stored in the database.
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

// This is a pre Save MIDDLEWARE which runs automatically before saving a document.
// If the password has changed, hash it before storing it in MongoDB.
userSchema.pre("save", async function () {

  // Prevent hashing the password again if it wasn't modified
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// models.User is used if the model already exists.
// Otherwise, create a new model.
// This prevents "Cannot overwrite model once compiled" errors
// (especially useful in Next.js because files can be reloaded multiple times).
const User = models?.User || model<IUser>("User", userSchema);

export default User;