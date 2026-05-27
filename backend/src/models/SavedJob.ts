import mongoose, {
    Document,
    Model,
    Schema,
  } from "mongoose";
  
  export interface ISavedJob
    extends Document {
  
    user: mongoose.Types.ObjectId;
  
    job: mongoose.Types.ObjectId;
  }
  
  const savedJobSchema =
    new Schema<ISavedJob>(
      {
        user: {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
  
        job: {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "Job",
          required: true,
        },
      },
      {
        timestamps: true,
      }
    );
  
  
  // Prevent duplicate saves
  savedJobSchema.index(
    {
      user: 1,
      job: 1,
    },
    {
      unique: true,
    }
  );
  
  const SavedJob: Model<ISavedJob> =
    mongoose.models.SavedJob ||
    mongoose.model<ISavedJob>(
      "SavedJob",
      savedJobSchema
    );
  
  export default SavedJob;