import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CandidateFormData } from '../../types/candidate.types';
import { candidateService } from '../../services/candidateService';
import { FileUpload } from './FileUpload';
import './AddCandidateForm.css';

export const AddCandidateForm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CandidateFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      education: [{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', isCurrentlyStudying: false }],
      workExperience: [{ company: '', position: '', description: '', startDate: '', endDate: '', isCurrentJob: false }],
    },
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education',
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'workExperience',
  });

  const onSubmit = async (data: CandidateFormData) => {
    if (!selectedFile) {
      setSubmitMessage({ type: 'error', text: 'Por favor, sube tu CV' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const formData: CandidateFormData = {
        ...data,
        cv: selectedFile,
      };

      const response = await candidateService.createCandidate(formData);

      if (response.success) {
        setSubmitMessage({ type: 'success', text: response.message });
        reset();
        setSelectedFile(null);

        setTimeout(() => {
          const addAnother = window.confirm('Candidato añadido exitosamente. ¿Deseas añadir otro candidato?');
          if (!addAnother) {
            setSubmitMessage(null);
          }
        }, 500);
      } else {
        const errorMessages = Array.isArray(response.errors)
          ? response.errors.map((err) => (typeof err === 'string' ? err : err.message)).join(', ')
          : 'Error al crear el candidato';
        setSubmitMessage({ type: 'error', text: errorMessages });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error de conexión con el servidor';
      const errors = error.response?.data?.errors;

      if (errors && Array.isArray(errors)) {
        const errorText = errors.map((err: any) => (typeof err === 'string' ? err : err.message)).join(', ');
        setSubmitMessage({ type: 'error', text: errorText });
      } else {
        setSubmitMessage({ type: 'error', text: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Añadir Candidato</h1>

      {submitMessage && (
        <div className={`message ${submitMessage.type}`}>
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="form-section">
          <h2>Información Personal</h2>

          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              {...register('firstName', { required: 'El nombre es requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
            />
            {errors.firstName && <span className="error">{errors.firstName.message}</span>}
          </div>

          <div className="form-group">
            <label>Apellido *</label>
            <input
              type="text"
              {...register('lastName', { required: 'El apellido es requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
            />
            {errors.lastName && <span className="error">{errors.lastName.message}</span>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              {...register('email', {
                required: 'El email es requerido',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' }
              })}
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" {...register('phone')} />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <textarea {...register('address')} rows={3} />
          </div>
        </section>

        <section className="form-section">
          <h2>Educación</h2>
          {educationFields.map((field, index) => (
            <div key={field.id} className="array-item">
              <h3>Educación {index + 1}</h3>

              <div className="form-group">
                <label>Institución *</label>
                <input
                  type="text"
                  {...register(`education.${index}.institution`, { required: 'Requerido' })}
                />
                {errors.education?.[index]?.institution && (
                  <span className="error">{errors.education[index]?.institution?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Título/Grado *</label>
                <input
                  type="text"
                  {...register(`education.${index}.degree`, { required: 'Requerido' })}
                />
                {errors.education?.[index]?.degree && (
                  <span className="error">{errors.education[index]?.degree?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Campo de estudio *</label>
                <input
                  type="text"
                  {...register(`education.${index}.fieldOfStudy`, { required: 'Requerido' })}
                />
                {errors.education?.[index]?.fieldOfStudy && (
                  <span className="error">{errors.education[index]?.fieldOfStudy?.message}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha inicio *</label>
                  <input
                    type="date"
                    {...register(`education.${index}.startDate`, { required: 'Requerido' })}
                  />
                  {errors.education?.[index]?.startDate && (
                    <span className="error">{errors.education[index]?.startDate?.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Fecha fin</label>
                  <input
                    type="date"
                    {...register(`education.${index}.endDate`)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register(`education.${index}.isCurrentlyStudying`)}
                  />
                  Estudiando actualmente
                </label>
              </div>

              {educationFields.length > 1 && (
                <button type="button" onClick={() => removeEducation(index)} className="btn-remove">
                  Eliminar
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendEducation({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', isCurrentlyStudying: false })}
            className="btn-add"
          >
            + Añadir Educación
          </button>
        </section>

        <section className="form-section">
          <h2>Experiencia Laboral</h2>
          {experienceFields.map((field, index) => (
            <div key={field.id} className="array-item">
              <h3>Experiencia {index + 1}</h3>

              <div className="form-group">
                <label>Empresa *</label>
                <input
                  type="text"
                  {...register(`workExperience.${index}.company`, { required: 'Requerido' })}
                />
                {errors.workExperience?.[index]?.company && (
                  <span className="error">{errors.workExperience[index]?.company?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Puesto *</label>
                <input
                  type="text"
                  {...register(`workExperience.${index}.position`, { required: 'Requerido' })}
                />
                {errors.workExperience?.[index]?.position && (
                  <span className="error">{errors.workExperience[index]?.position?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  {...register(`workExperience.${index}.description`)}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha inicio *</label>
                  <input
                    type="date"
                    {...register(`workExperience.${index}.startDate`, { required: 'Requerido' })}
                  />
                  {errors.workExperience?.[index]?.startDate && (
                    <span className="error">{errors.workExperience[index]?.startDate?.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Fecha fin</label>
                  <input
                    type="date"
                    {...register(`workExperience.${index}.endDate`)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register(`workExperience.${index}.isCurrentJob`)}
                  />
                  Trabajo actual
                </label>
              </div>

              {experienceFields.length > 1 && (
                <button type="button" onClick={() => removeExperience(index)} className="btn-remove">
                  Eliminar
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendExperience({ company: '', position: '', description: '', startDate: '', endDate: '', isCurrentJob: false })}
            className="btn-add"
          >
            + Añadir Experiencia
          </button>
        </section>

        <section className="form-section">
          <h2>Curriculum Vitae</h2>
          <FileUpload
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
            error={!selectedFile && submitMessage?.type === 'error' ? 'El CV es requerido' : undefined}
          />
        </section>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn-back-home">
            Volver al Inicio
          </button>
          <button type="button" onClick={() => { reset(); setSelectedFile(null); }} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Guardando...' : 'Guardar Candidato'}
          </button>
        </div>
      </form>
    </div>
  );
};
