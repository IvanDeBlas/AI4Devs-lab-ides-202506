import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1>ATS LTI System</h1>
          <p>Applicant Tracking System - AI4Devs Lab Exercise</p>
        </div>

        <div className="home-about">
          <h2>About This System</h2>
          <p>
            Welcome to the ATS LTI System, a comprehensive Applicant Tracking System built with modern technologies. This
            platform is designed to streamline the recruitment process by managing candidates, their educational background,
            work experience, and job applications efficiently.
          </p>
        </div>

        <div className="home-features">
          <div className="feature-card blue">
            <div className="feature-header">
              <div className="feature-icon blue-icon">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3>Candidate Management</h3>
            </div>
            <p>Comprehensive candidate profiles with personal information, contact details, and employment history.</p>
          </div>

          <div className="feature-card green">
            <div className="feature-header">
              <div className="feature-icon green-icon">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3>Education Tracking</h3>
            </div>
            <p>Track academic credentials, degrees, institutions, and fields of study for each candidate.</p>
          </div>

          <div className="feature-card purple">
            <div className="feature-header">
              <div className="feature-icon purple-icon">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Work Experience</h3>
            </div>
            <p>Detailed work history including companies, positions, responsibilities, and employment periods.</p>
          </div>

          <div className="feature-card orange">
            <div className="feature-header">
              <div className="feature-icon orange-icon">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3>Application Tracking</h3>
            </div>
            <p>Monitor job applications with status tracking and application timeline management.</p>
          </div>
        </div>

        <div className="home-tech-stack">
          <h2>Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <p className="tech-name">Express.js</p>
              <p className="tech-label">Framework</p>
            </div>
            <div className="tech-item">
              <p className="tech-name">TypeScript</p>
              <p className="tech-label">Language</p>
            </div>
            <div className="tech-item">
              <p className="tech-name">React 18</p>
              <p className="tech-label">Frontend</p>
            </div>
            <div className="tech-item">
              <p className="tech-name">PostgreSQL 16</p>
              <p className="tech-label">Database</p>
            </div>
            <div className="tech-item">
              <p className="tech-name">Prisma</p>
              <p className="tech-label">ORM</p>
            </div>
            <div className="tech-item">
              <p className="tech-name">Zod</p>
              <p className="tech-label">Validation</p>
            </div>
          </div>
        </div>

        <div className="home-actions">
          <button
            className="btn-primary-large"
            onClick={() => navigate('/add-candidate')}
          >
            Añadir Candidato
          </button>
          <button
            className="btn-secondary-large"
            onClick={() => navigate('/candidates')}
          >
            Gestionar Candidatos
          </button>
        </div>
      </div>
    </div>
  );
};
