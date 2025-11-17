import { z } from 'zod';

const educationSchema = z.object({
  institution: z.string().min(2, 'La institución debe tener al menos 2 caracteres'),
  degree: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  fieldOfStudy: z.string().min(2, 'El campo de estudio debe tener al menos 2 caracteres'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)').optional().nullable(),
}).refine((data) => {
  if (data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start < end;
  }
  return true;
}, {
  message: 'La fecha de inicio debe ser anterior a la fecha de fin',
  path: ['endDate'],
});

const workExperienceSchema = z.object({
  company: z.string().min(2, 'La empresa debe tener al menos 2 caracteres'),
  position: z.string().min(2, 'El puesto debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)').optional().nullable(),
}).refine((data) => {
  if (data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start < end;
  }
  return true;
}, {
  message: 'La fecha de inicio debe ser anterior a la fecha de fin',
  path: ['endDate'],
});

export const createCandidateSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Formato de email inválido'),
  phone: z.string().optional(),
  address: z.string().optional(),
  education: z.array(educationSchema).min(1, 'Debe proporcionar al menos una educación o experiencia laboral'),
  workExperience: z.array(workExperienceSchema),
}).refine((data) => {
  return data.education.length > 0 || data.workExperience.length > 0;
}, {
  message: 'Debe proporcionar al menos una educación o experiencia laboral',
  path: ['education'],
});

export type CreateCandidateSchema = z.infer<typeof createCandidateSchema>;
