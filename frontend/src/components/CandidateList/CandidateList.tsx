import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateService } from '../../services/candidateService';
import './CandidateList.css';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cvFileName?: string;
  createdAt: string;
  education: any[];
  workExperience: any[];
}

export const CandidateList: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getAllCandidates();
      if (response.success && response.data) {
        setCandidates(response.data);
      }
    } catch (err: any) {
      setError('Error al cargar los candidatos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="candidate-list-page">
        <div className="candidate-list-container">
          <div className="loading">Cargando candidatos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-list-page">
      <div className="candidate-list-container">
        <div className="list-header">
          <h1>Gestionar Candidatos</h1>
          <div className="header-actions">
            <button className="btn-add-new" onClick={() => navigate('/add-candidate')}>
              + Añadir Candidato
            </button>
            <button className="btn-back" onClick={() => navigate('/')}>
              Volver al Inicio
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {candidates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>No hay candidatos registrados</h2>
            <p>Comienza añadiendo tu primer candidato al sistema</p>
            <button className="btn-primary" onClick={() => navigate('/add-candidate')}>
              Añadir Primer Candidato
            </button>
          </div>
        ) : (
          <div className="candidates-grid">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="candidate-card">
                <div className="card-header">
                  <h3>{candidate.firstName} {candidate.lastName}</h3>
                  {candidate.cvFileName && (
                    <span className="cv-badge">📄 CV</span>
                  )}
                </div>
                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{candidate.email}</span>
                  </div>
                  {candidate.phone && (
                    <div className="info-row">
                      <span className="label">Teléfono:</span>
                      <span className="value">{candidate.phone}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="label">Educación:</span>
                    <span className="value">{candidate.education.length} registro(s)</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Experiencia:</span>
                    <span className="value">{candidate.workExperience.length} registro(s)</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Registrado:</span>
                    <span className="value">{new Date(candidate.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn-view" onClick={() => alert('Ver detalles: Próximamente')}>
                    Ver Detalles
                  </button>
                  <button className="btn-edit" onClick={() => alert('Editar: Próximamente')}>
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
