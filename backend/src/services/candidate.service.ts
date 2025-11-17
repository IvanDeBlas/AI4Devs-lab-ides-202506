import prisma from '../index';
import { CreateCandidateInput, CandidateResponse } from '../types/candidate.types';

export class CandidateService {
  async getAllCandidates(): Promise<CandidateResponse[]> {
    const candidates = await prisma.candidate.findMany({
      include: {
        education: true,
        workExperience: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return candidates.map(candidate => ({
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address,
      cvFileName: candidate.cvFileName,
      education: candidate.education.map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate.toISOString().split('T')[0],
        endDate: edu.endDate ? edu.endDate.toISOString().split('T')[0] : null,
      })),
      workExperience: candidate.workExperience.map(exp => ({
        company: exp.company,
        position: exp.position,
        description: exp.description,
        startDate: exp.startDate.toISOString().split('T')[0],
        endDate: exp.endDate ? exp.endDate.toISOString().split('T')[0] : null,
      })),
      createdAt: candidate.createdAt,
    }));
  }

  async createCandidate(
    data: CreateCandidateInput,
    cvFile?: Express.Multer.File
  ): Promise<CandidateResponse> {
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email: data.email }
    });

    if (existingCandidate) {
      throw new Error('EMAIL_EXISTS');
    }

    const candidate = await prisma.candidate.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        cvFilePath: cvFile ? cvFile.path : null,
        cvFileName: cvFile ? cvFile.originalname : null,
        cvMimeType: cvFile ? cvFile.mimetype : null,
        education: {
          create: data.education.map(edu => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
          }))
        },
        workExperience: {
          create: data.workExperience.map(exp => ({
            company: exp.company,
            position: exp.position,
            description: exp.description,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
          }))
        }
      },
      include: {
        education: true,
        workExperience: true,
      }
    });

    return {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address,
      cvFileName: candidate.cvFileName,
      education: candidate.education.map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate.toISOString().split('T')[0],
        endDate: edu.endDate ? edu.endDate.toISOString().split('T')[0] : null,
      })),
      workExperience: candidate.workExperience.map(exp => ({
        company: exp.company,
        position: exp.position,
        description: exp.description,
        startDate: exp.startDate.toISOString().split('T')[0],
        endDate: exp.endDate ? exp.endDate.toISOString().split('T')[0] : null,
      })),
      createdAt: candidate.createdAt,
    };
  }
}

export const candidateService = new CandidateService();
