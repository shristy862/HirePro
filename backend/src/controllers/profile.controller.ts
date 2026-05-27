import { Request, Response } from "express";

import {
  getAccountProfileService,
  getMyProfileService,
  updateProfileService,
} from "../services/profile.service";
import { uploadAvatarService } from "../services/avatar.service";

import { updateProfileSchema } from "../validators/profile.validation";

export const getAccountProfile = async (req: Request, res: Response) => {
  try {
    const user = await getAccountProfileService(
      (req as Request & { user: { _id: string } }).user._id
    );

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load account";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export const uploadProfileAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile picture file is required",
      });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    const user = await uploadAvatarService(
      (req as Request & { user: { _id: string } }).user._id,
      avatarUrl
    );

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      avatar: user.avatar,
      user,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to upload profile picture";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const { user, completion } = await getMyProfileService(
      (req as Request & { user: { _id: string } }).user._id
    );

    return res.status(200).json({
      success: true,
      user,
      profileCompletion: completion,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load profile";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const parsedData = updateProfileSchema.parse(req.body);

    const { user, completion } = await updateProfileService({
      userId: (req as Request & { user: { _id: string } }).user._id,
      bio: parsedData.bio,
      skills: parsedData.skills,
      experience: parsedData.experience,
      education: parsedData.education,
      linkedin: parsedData.linkedin,
      github: parsedData.github,
      portfolio: parsedData.portfolio,
      resume: parsedData.resume,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
      profileCompletion: completion,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};
