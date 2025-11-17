import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { uploadCV } from './middlewares/upload.middleware';
import { candidateController } from './controllers/candidate.controller';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.get('/api/candidates', (req, res) => {
  candidateController.getAllCandidates(req, res);
});

app.post('/api/candidates', uploadCV.single('cv'), (req, res) => {
  candidateController.createCandidate(req, res);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'Archivo muy grande',
        errors: ['El archivo debe ser menor a 5MB'],
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Error al procesar el archivo',
      errors: [err.message],
    });
  }

  if (err.message && err.message.includes('Tipo de archivo no soportado')) {
    return res.status(415).json({
      success: false,
      message: 'Tipo de archivo no soportado',
      errors: ['Solo se permiten archivos PDF o DOCX'],
    });
  }

  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error del servidor',
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
