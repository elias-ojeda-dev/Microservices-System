import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';

const StartupsFilters = ({ filters, onChange, onClear }) => {
  const categories = [
    'AI/ML',
    'FinTech',
    'HealthTech',
    'EdTech',
    'CleanTech',
    'E-commerce',
    'SaaS',
    'IoT',
    'Blockchain',
    'Other'
  ];

  return (
    <div className="card">
      <div className="card-body">
        <div className="grid grid-3" style={{ gap: '1rem', alignItems: 'end' }}>
          <FormInput
            label="Buscar por nombre"
            name="name"
            value={filters.name}
            onChange={onChange}
            placeholder="Nombre de startup..."
          />

          <FormSelect
            label="Filtrar por categoría"
            name="category"
            value={filters.category}
            onChange={onChange}
            options={categories}
            placeholder="Todas las categorías"
          />

          <button
            className="btn btn-outline"
            onClick={onClear}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartupsFilters;
