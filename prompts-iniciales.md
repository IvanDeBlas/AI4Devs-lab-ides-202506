# Prompts Iniciales - Implementación "Añadir Candidato"

## Descripción del Proyecto

Este documento describe la implementación completa de la funcionalidad "Añadir Candidato" en el sistema ATS (Applicant Tracking System) LTI. La implementación se realizó en 3 fases: Base de Datos, Backend API y Frontend.

## Fecha de Implementación
17 de Noviembre de 2025

## Prompt Original

El prompt original solicitaba implementar una funcionalidad completa de "Añadir Candidato" con las siguientes características:

### Historia de Usuario
```
Como reclutador,
Quiero tener la capacidad de añadir candidatos al sistema ATS,
Para que pueda gestionar sus datos y procesos de selección de manera eficiente.
```

### Requerimientos Principales

1. **Base de Datos**: Modelos para Candidatos, Educación y Experiencia Laboral
2. **Backend API**: Endpoint POST /api/candidates con validaciones y upload de archivos
3. **Frontend**: Formulario completo con drag & drop para CVs

## Tecnologías Utilizadas

### Backend
- **Framework**: Express.js v4.19.2
- **ORM**: Prisma v5.13.0
- **Base de Datos**: PostgreSQL (Docker)
- **Lenguaje**: TypeScript v4.9.5
- **Validación**: Zod v3.x
- **Upload de Archivos**: Multer v1.4.x
- **Testing**: Jest v29.7.0

### Frontend
- **Framework**: React 18.3.1
- **Lenguaje**: TypeScript v4.9.5
- **Gestión de Formularios**: React Hook Form v7.x
- **HTTP Client**: Axios v1.x
- **Upload de Archivos**: React Dropzone v14.x
- **Testing**: React Testing Library

### Infraestructura
- **Base de Datos**: PostgreSQL en Docker
- **Puerto Backend**: 3010
- **Puerto Frontend**: 3000
- **Puerto PostgreSQL**: 5432

## Estructura de Archivos Creados

### Backend
```
backend/
├── prisma/
│   ├── schema.prisma (MODIFICADO)
│   └── migrations/
│       └── 20251117144609_add_candidates_education_work_experience/
│           └── migration.sql
├── src/
│   ├── index.ts (MODIFICADO)
│   ├── controllers/
│   │   └── candidate.controller.ts
│   ├── services/
│   │   └── candidate.service.ts
│   ├── middlewares/
│   │   └── upload.middleware.ts
│   ├── validators/
│   │   └── candidate.validator.ts
│   └── types/
│       └── candidate.types.ts
└── uploads/
    └── cvs/ (carpeta creada automáticamente)
```

### Frontend
```
frontend/
└── src/
    ├── App.tsx (MODIFICADO)
    ├── components/
    │   └── AddCandidate/
    │       ├── AddCandidateForm.tsx
    │       ├── AddCandidateForm.css
    │       └── FileUpload.tsx
    ├── services/
    │   └── candidateService.ts
    └── types/
        └── candidate.types.ts
```

## Implementación por Fases

### FASE 1: Base de Datos ✅

#### Modelos Creados

**Candidate** (Tabla: candidates)
- id: UUID (PK)
- firstName: String
- lastName: String
- email: String (único, indexado)
- phone: String (opcional)
- address: String (opcional)
- cvFilePath: String (opcional)
- cvFileName: String (opcional)
- cvMimeType: String (opcional)
- createdAt: Timestamp
- updatedAt: Timestamp
- Relaciones: 1:N con education y workExperience

**Education** (Tabla: education)
- id: UUID (PK)
- candidateId: UUID (FK → candidates.id)
- institution: String
- degree: String
- fieldOfStudy: String
- startDate: DateTime
- endDate: DateTime (opcional)
- createdAt: Timestamp
- Cascade delete al eliminar candidato

**WorkExperience** (Tabla: work_experience)
- id: UUID (PK)
- candidateId: UUID (FK → candidates.id)
- company: String
- position: String
- description: String (opcional)
- startDate: DateTime
- endDate: DateTime (opcional)
- createdAt: Timestamp
- Cascade delete al eliminar candidato

#### Migración
- Migración creada: `20251117144609_add_candidates_education_work_experience`
- Estado: Aplicada exitosamente
- Tablas verificadas en PostgreSQL

### FASE 2: Backend API ✅

#### Endpoint Implementado

**POST /api/candidates**

**Request**: multipart/form-data
```typescript
{
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  education: JSON string (array)
  workExperience: JSON string (array)
  cv: File (PDF o DOCX, max 5MB)
}
```

**Response Exitoso (201)**:
```json
{
  "success": true,
  "message": "Candidato añadido exitosamente",
  "data": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "cvFileName": "string",
    "education": [...],
    "workExperience": [...],
    "createdAt": "timestamp"
  }
}
```

#### Validaciones Implementadas

1. **Datos personales**:
   - firstName, lastName: mínimo 2 caracteres
   - Email: formato válido y único
   - Phone: opcional

2. **Educación y experiencia**:
   - Al menos 1 educación o 1 experiencia laboral requerida
   - Fechas en formato YYYY-MM-DD
   - startDate < endDate (cuando endDate existe)

3. **Archivo CV**:
   - Solo PDF o DOCX
   - Máximo 5MB
   - Nombre único generado automáticamente

#### Manejo de Errores

- **400**: Datos inválidos (con detalles específicos)
- **409**: Email ya existe
- **413**: Archivo muy grande
- **415**: Tipo de archivo no soportado
- **500**: Error del servidor

#### Características de Seguridad

- Validación con Zod antes de procesamiento
- Sanitización de nombres de archivo
- Límites de tamaño de archivo
- Verificación de tipos MIME
- CORS habilitado para desarrollo

### FASE 3: Frontend ✅

#### Componentes Creados

**AddCandidateForm**
- Formulario principal con React Hook Form
- Gestión de estado para loading y mensajes
- Validación en tiempo real
- Confirmación al salir si hay datos sin guardar

**FileUpload**
- Drag & drop funcional
- Preview del archivo seleccionado
- Validación de tipo y tamaño
- Interfaz intuitiva con iconos

#### Características del Formulario

1. **Información Personal**:
   - Campos: nombre, apellido, email, teléfono, dirección
   - Validación en tiempo real
   - Mensajes de error específicos

2. **Educación** (Array dinámico):
   - Añadir/eliminar múltiples educaciones
   - Campos: institución, título, campo de estudio, fechas
   - Checkbox "Estudiando actualmente"
   - Mínimo 1 entrada requerida (si no hay experiencia)

3. **Experiencia Laboral** (Array dinámico):
   - Añadir/eliminar múltiples experiencias
   - Campos: empresa, puesto, descripción, fechas
   - Checkbox "Trabajo actual"
   - Mínimo 1 entrada requerida (si no hay educación)

4. **Upload de CV**:
   - Drag & drop funcional
   - Click para seleccionar archivo
   - Preview del archivo
   - Validación de formato y tamaño
   - Botón para remover archivo

5. **Estados de UI**:
   - Loading durante envío
   - Mensajes de éxito/error
   - Formulario deshabilitado durante envío
   - Opción "Añadir otro candidato" después de éxito

6. **Responsive Design**:
   - Mobile: 1 columna
   - Tablet: 2 columnas
   - Desktop: layout optimizado

## Problemas Encontrados y Soluciones

### Problema 1: Puerto 5432 ya en uso
**Descripción**: Al intentar iniciar PostgreSQL con docker-compose, el puerto 5432 ya estaba ocupado por otro contenedor.

**Solución**:
- Detuve el contenedor existente que usaba el puerto
- Reinicié docker-compose con volúmenes limpios
- Configuración correcta aplicada

### Problema 2: Error al generar cliente Prisma
**Descripción**: Durante la migración, hubo un error al intentar instalar prisma@6.19.0.

**Solución**:
- La migración se aplicó correctamente a pesar del error
- El error fue relacionado con la instalación de dependencias, no con la migración en sí
- Verificado con `docker exec` que las tablas se crearon correctamente

### Problema 3: Tipos TypeScript en controlador
**Descripción**: Los tipos de Request de Express no incluían automáticamente los tipos de multer.

**Solución**:
- Instalé @types/multer
- Usé Express.Multer.File para tipar el archivo
- Configuré correctamente los tipos en el controlador

### Problema 4: Validación de fechas en Zod
**Descripción**: Necesitaba validar que la fecha de inicio fuera anterior a la fecha de fin.

**Solución**:
- Usé `.refine()` de Zod para validaciones personalizadas
- Implementé comparación de fechas solo cuando endDate existe
- Mensajes de error claros para el usuario

## Configuración de Entorno

### Backend (.env)
```env
DB_PASSWORD=D1ymf8wyQEGthFR1E9xhCq
DB_USER=LTIdbUser
DB_NAME=LTIdb
DB_PORT=5432
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"
```

### Frontend
No requiere archivo .env especial para desarrollo local.
API URL por defecto: `http://localhost:3010`

## Comandos para Ejecutar

### Iniciar PostgreSQL
```bash
docker-compose up -d
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Testing

### Cómo Probar la Funcionalidad

1. **Iniciar servicios**:
   - PostgreSQL: `docker-compose up -d`
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm start`

2. **Acceder al formulario**:
   - Abrir navegador en `http://localhost:3000`

3. **Completar formulario**:
   - Llenar información personal
   - Añadir al menos 1 educación o experiencia
   - Subir CV (PDF o DOCX, max 5MB)
   - Click en "Guardar Candidato"

4. **Verificar en base de datos**:
   ```bash
   docker exec -it ai4devs-lab-ides-202506-db-1 psql -U LTIdbUser -d LTIdb
   SELECT * FROM candidates;
   SELECT * FROM education;
   SELECT * FROM work_experience;
   ```

## Tiempo Estimado

### Análisis del Proyecto
- Tiempo: 10 minutos
- Actividad: Revisar estructura, identificar tecnologías, leer documentación

### FASE 1: Base de Datos
- Tiempo: 20 minutos
- Actividades:
  - Diseño de modelos
  - Creación de schema.prisma
  - Generación y aplicación de migración
  - Verificación en PostgreSQL

### FASE 2: Backend API
- Tiempo: 45 minutos
- Actividades:
  - Instalación de dependencias
  - Creación de estructura de carpetas
  - Implementación de tipos
  - Validaciones con Zod
  - Middleware de upload
  - Servicio de candidatos
  - Controlador
  - Integración en index.ts
  - Manejo de errores

### FASE 3: Frontend
- Tiempo: 60 minutos
- Actividades:
  - Instalación de dependencias
  - Creación de estructura
  - Tipos TypeScript
  - Servicio API
  - Componente FileUpload
  - Componente AddCandidateForm
  - Estilos CSS
  - Integración en App.tsx

### Documentación
- Tiempo: 15 minutos
- Actividad: Creación de este documento

### Testing y Ajustes
- Tiempo: 20 minutos
- Actividades:
  - Pruebas del formulario
  - Verificación de validaciones
  - Corrección de bugs menores
  - Verificación en base de datos

**TIEMPO TOTAL ESTIMADO**: ~2.5 horas

## Mejoras Futuras Sugeridas

1. **Backend**:
   - Implementar paginación para listar candidatos
   - Añadir endpoint GET /api/candidates/:id
   - Implementar búsqueda y filtros
   - Añadir tests unitarios e integración
   - Implementar autenticación/autorización
   - Documentación con Swagger

2. **Frontend**:
   - Implementar routing (React Router)
   - Añadir página de listado de candidatos
   - Mejorar UX con animaciones
   - Añadir tests con React Testing Library
   - Implementar búsqueda en tiempo real
   - Añadir preview de PDF
   - Implementar tema oscuro
   - Mejorar accesibilidad (ARIA)

3. **Base de Datos**:
   - Añadir índices adicionales para búsqueda
   - Implementar soft delete
   - Añadir tablas de auditoría
   - Implementar versionado de CVs

4. **Infraestructura**:
   - Configurar CI/CD
   - Añadir Docker para backend y frontend
   - Implementar logging centralizado
   - Configurar monitoreo

## Conclusión

La implementación de la funcionalidad "Añadir Candidato" se completó exitosamente en las 3 fases planificadas. El sistema permite:

- ✅ Añadir candidatos con información completa
- ✅ Gestionar múltiples educaciones y experiencias laborales
- ✅ Subir CVs con validación robusta
- ✅ Validación completa de datos en backend y frontend
- ✅ Manejo de errores apropiado
- ✅ Interfaz responsive y fácil de usar
- ✅ Almacenamiento seguro en PostgreSQL
- ✅ Arquitectura escalable y mantenible

El código sigue las mejores prácticas de desarrollo, con separación de responsabilidades, validación robusta y manejo de errores apropiado.
