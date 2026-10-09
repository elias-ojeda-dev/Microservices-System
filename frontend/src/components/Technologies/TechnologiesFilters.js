import FormSelect from '../common/FormSelect';

const TechnologiesFilters = ({ filters, onChange, onClear }) => {
  const sectors = [
    'Computing',
    'FinTech',
    'Healthcare',
    'Education',
    'Energy',
    'Transportation',
    'Telecommunications',
    'Manufacturing',
    'Agriculture',
    'Retail',
    'Entertainment',
    'Other'
  ];

  const adoptionLevels = [
    { value: 'emerging', label: 'Emergente' },
    { value: 'growing', label: 'En Crecimiento' },
    { value: 'mature', label: 'Maduro' },
    { value: 'declining', label: 'En Declive' }
  ];

  return (
    <div className="card">
      <div className="card-body">
        <div className="grid grid-3" style={{ gap: '1rem', alignItems: 'end' }}>
          <FormSelect
            label="Filtrar por sector"
            name="sector"
            value={filters.sector}
            onChange={onChange}
            options={sectors}
            placeholder="Todos los sectores"
          />

          <FormSelect
            label="Nivel de adopción"
            name="adoptionLevel"
            value={filters.adoptionLevel}
            onChange={onChange}
            options={adoptionLevels}
            placeholder="Todos los niveles"
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

export default TechnologiesFilters;
