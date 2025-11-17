import axios from 'axios';
import { CandidateFormData, ApiResponse } from '../types/candidate.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

export const candidateService = {
  async getAllCandidates(): Promise<ApiResponse<any[]>> {
    const response = await axios.get<ApiResponse<any[]>>(
      `${API_BASE_URL}/api/candidates`
    );
    return response.data;
  },

  async createCandidate(data: CandidateFormData): Promise<ApiResponse<any>> {
    const formData = new FormData();

    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);

    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', data.address);

    const educationData = data.education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.isCurrentlyStudying ? null : edu.endDate,
    }));

    const workExperienceData = data.workExperience.map(exp => ({
      company: exp.company,
      position: exp.position,
      description: exp.description || '',
      startDate: exp.startDate,
      endDate: exp.isCurrentJob ? null : exp.endDate,
    }));

    formData.append('education', JSON.stringify(educationData));
    formData.append('workExperience', JSON.stringify(workExperienceData));

    if (data.cv) {
      formData.append('cv', data.cv);
    }

    const response = await axios.post<ApiResponse<any>>(
      `${API_BASE_URL}/api/candidates`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },
};
