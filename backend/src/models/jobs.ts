import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IJob extends Document {
  title: string;
  companyName: string;
  description: string;
  skills: string[];
  salary: number;
  experience: string;
  location: string;
  employmentType: string;
  createdBy: mongoose.Types.ObjectId;
  status: "open" | "closed";
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    salary: {
      type: Number,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", jobSchema);

export default Job;
