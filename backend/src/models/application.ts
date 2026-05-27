import mongoose, {
    Document,
    Model,
    Schema,
  } from "mongoose";
  
  export interface IApplication
    extends Document {
  
    applicant: mongoose.Types.ObjectId;
  
    job: mongoose.Types.ObjectId;
  
    resume?: string;
  
    coverLetter?: string;
  
    status:
      | "pending"
      | "reviewed"
      | "shortlisted"
      | "rejected";

    createdAt: Date;
    updatedAt: Date;
  }
  
  const applicationSchema =
    new Schema<IApplication>(
      {
        applicant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
  
        job: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
          required: true,
        },
  
        resume: {
          type: String,
        },
  
        coverLetter: {
          type: String,
        },
  
        status: {
          type: String,
          enum: [
            "pending",
            "reviewed",
            "shortlisted",
            "rejected",
          ],
          default: "pending",
        },
      },
      {
        timestamps: true,
      }
    );
  
  
  // Prevent duplicate applications
  applicationSchema.index(
    {
      applicant: 1,
      job: 1,
    },
    {
      unique: true,
    }
  );
  
  const Application: Model<IApplication> =
    mongoose.models.Application ||
    mongoose.model<IApplication>(
      "Application",
      applicationSchema
    );
  
  export default Application;