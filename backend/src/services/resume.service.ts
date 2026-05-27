import User from "../models/user";


// UPLOAD RESUME
export const uploadResumeService =
  async (
    userId: string,
    resumeUrl: string
  ) => {

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          resume: resumeUrl,
        },
        {
          new: true,
        }
      ).select("-password");

    if (!updatedUser) {

      throw new Error(
        "User not found"
      );

    }

    return updatedUser;
  };



// GET RESUME
export const getResumeService =
  async (userId: string) => {

    const user = await User.findById(
      userId
    ).select("resume");

    if (!user) {

      throw new Error(
        "User not found"
      );

    }

    return user;
  };