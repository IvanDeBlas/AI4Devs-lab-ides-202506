export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying?: boolean;
}

export interface WorkExperience {
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrentJob?: boolean;
}

export interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education: Education[];
  workExperience: WorkExperience[];
  cv?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[] | Array<{ field: string; message: string }>;
}
