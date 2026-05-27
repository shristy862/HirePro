import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";


// USER INTERFACE
export interface IUser extends Document {

  name: string;
  email: string;
  password: string;
  role: "recruiter" | "candidate";
  avatar?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  resume?: string;
  profileCompletion?: {
    bio: boolean;
    skills: boolean;
    experience: boolean;
    education: boolean;
    linkedin: boolean;
    github: boolean;
    portfolio: boolean;
    resume: boolean;
  };
  profileCompletePercentage?: number;
  isProfileComplete?: boolean;
}


// USER SCHEMA
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "recruiter",
        "candidate",
      ],
      default: "candidate",
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    experience: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    profileCompletion: {
      bio: { type: Boolean, default: false },
      skills: { type: Boolean, default: false },
      experience: { type: Boolean, default: false },
      education: { type: Boolean, default: false },
      linkedin: { type: Boolean, default: false },
      github: { type: Boolean, default: false },
      portfolio: { type: Boolean, default: false },
      resume: { type: Boolean, default: false },
    },

    profileCompletePercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// MODEL TYPE
const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>(
    "User",
    userSchema
  );

export default User;