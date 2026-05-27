export type JobStatus = "open" | "closed";

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "internship"
  | "contract";

export interface JobCreator {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  description: string;
  skills: string[];
  salary: number;
  experience: string;
  location: string;
  employmentType: EmploymentType;
  status: JobStatus;
  createdBy?: JobCreator;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateJobPayload {
  title: string;
  companyName: string;
  description: string;
  skills: string[];
  salary: number;
  experience: string;
  location: string;
  employmentType: EmploymentType;
}

export interface UpdateJobPayload extends Partial<CreateJobPayload> {
  status?: JobStatus;
}
