import User, { type IUser } from "../models/user";

export class UserService {
  static async findByEmail(
    email: string
  ): Promise<IUser | null> {
    return User.findOne({ email });
  }
}
