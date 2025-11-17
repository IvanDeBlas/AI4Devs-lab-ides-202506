import { Request, Response } from 'express';
import { candidateService } from '../services/candidate.service';
import { createCandidateSchema } from '../validators/candidate.validator';
import { ZodError } from 'zod';

export class CandidateController {
  async getAllCandidates(req: Request, res: Response): Promise<void> {
    try {
      const candidates = await candidateService.getAllCandidates();

      res.status(200).json({
        success: true,
        message: 'Candidatos obtenidos exitosamente',
        data: candidates,
      });
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
      res.status(500).json({
        success: false,
        message: 'Error del servidor al obtener candidatos',
      });
    }
  }

  async createCandidate(req: Request, res: Response): Promise<void> {
    try {
      let candidateData;

      try {
        candidateData = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          education: JSON.parse(req.body.education || '[]'),
          workExperience: JSON.parse(req.body.workExperience || '[]'),
        };
      } catch (error) {
        res.status(400).json({
          success: false,
          message: 'Datos inválidos en el formato JSON',
          errors: ['Los campos education y workExperience deben ser JSON válido'],
        });
        return;
      }

      const validatedData = createCandidateSchema.parse(candidateData);

      const cvFile = req.file;

      const candidate = await candidateService.createCandidate(validatedData, cvFile);

      res.status(201).json({
        success: true,
        message: 'Candidato añadido exitosamente',
        data: candidate,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }

      if (error instanceof Error) {
        if (error.message === 'EMAIL_EXISTS') {
          res.status(409).json({
            success: false,
            message: 'El email ya existe',
            errors: ['Ya existe un candidato con este email'],
          });
          return;
        }
      }

      console.error('Error al crear candidato:', error);
      res.status(500).json({
        success: false,
        message: 'Error del servidor al crear el candidato',
      });
    }
  }
}

export const candidateController = new CandidateController();
