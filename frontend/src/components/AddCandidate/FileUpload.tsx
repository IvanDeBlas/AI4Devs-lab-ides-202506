import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, error }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    onDropRejected: () => {
      alert('Archivo rechazado. Solo se permiten archivos PDF o DOCX de máximo 5MB.');
    },
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Curriculum Vitae (CV) *
      </label>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
          transition: 'background-color 0.2s',
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📄</div>
        {isDragActive ? (
          <p>Suelta el archivo aquí...</p>
        ) : (
          <>
            <p style={{ margin: '0 0 10px 0' }}>Arrastra tu CV aquí</p>
            <p style={{ margin: '0 0 10px 0' }}>o haz clic para subir</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              Formatos: PDF, DOCX | Tamaño máximo: 5MB
            </p>
          </>
        )}
      </div>

      {selectedFile && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#e8f5e9',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>📄 {selectedFile.name}</span>
          <button
            type="button"
            onClick={handleRemove}
            style={{
              background: 'none',
              border: 'none',
              color: '#d32f2f',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '0 10px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <p style={{ color: '#d32f2f', fontSize: '14px', marginTop: '5px' }}>{error}</p>
      )}
    </div>
  );
};
