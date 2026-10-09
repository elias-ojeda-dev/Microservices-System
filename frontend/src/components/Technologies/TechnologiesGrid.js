import { formatDateTime } from '../../utils/formatters';

const TechnologiesGrid = ({ technologies, onEdit, onDelete }) => {
  const adoptionLevels = {
    emerging: { label: 'Emergente', color: '#10b981' },
    growing: { label: 'En Crecimiento', color: '#3b82f6' },
    mature: { label: 'Maduro', color: '#6b7280' },
    declining: { label: 'En Declive', color: '#ef4444' }
  };

  if (technologies.length === 0) {
    return (
      <div className="card">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            No se encontraron tecnologías. Crea la primera!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-2">
      {technologies.map(tech => {
        const levelInfo = adoptionLevels[tech.adoption_level] || {};

        return (
          <div key={tech.id} className="card">
            <div className="tech-card-header">
              <h3 className="tech-card-title">{tech.name}</h3>
              <span
                className="tech-badge"
                style={{
                  background: levelInfo.color,
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  display: 'inline-block'
                }}
              >
                {levelInfo.label}
              </span>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  background: 'var(--background)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  display: 'inline-block'
                }}>
                  {tech.sector}
                </span>
              </div>

              {tech.description && (
                <p style={{
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}>
                  {tech.description}
                </p>
              )}

              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem'
              }}>
                Actualizado: {formatDateTime(tech.updated_at)}
              </div>

              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onEdit(tech)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(tech.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TechnologiesGrid;
