import { formatCurrency, formatDate } from '../../utils/formatters';

const StartupsTable = ({ startups, onEdit, onDelete }) => {
  if (startups.length === 0) {
    return (
      <div className="card">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            No se encontraron startups. Crea la primera!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fundación</th>
            <th>Ubicación</th>
            <th>Categoría</th>
            <th>Inversión</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {startups.map(startup => (
            <tr key={startup.id}>
              <td><strong>{startup.name}</strong></td>
              <td>{formatDate(startup.founded_at)}</td>
              <td>{startup.location}</td>
              <td>
                <span style={{
                  background: 'var(--secondary-color)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}>
                  {startup.category}
                </span>
              </td>
              <td>{formatCurrency(startup.funding_amount)}</td>
              <td>
                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => onEdit(startup)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(startup.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StartupsTable;
