export interface EducationData {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string | null;
}

export interface WorkExperienceData {
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string | null;
}

export interface CreateCandidateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education: EducationData[];
  workExperience: WorkExperienceData[];
}

export interface CandidateResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  cvFileName?: string | null;
  education: EducationData[];
  workExperience: WorkExperienceData[];
  createdAt: Date;
}
