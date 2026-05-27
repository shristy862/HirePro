import type { UserDocument } from "@backend/models/user.model";
import { UserModel } from "@backend/models/user.model";

export class UserService {
  static async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).lean<UserDocument>();
  }
}
