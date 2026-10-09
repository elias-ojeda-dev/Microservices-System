import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';

const TechnologyForm = ({
  formData,
  errors,
  onChange,
  onSubmit,
  onCancel,
  isEditing
}) => {
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
    <form onSubmit={onSubmit} className="form">
      <FormInput
        label="Nombre"
        name="name"
        value={formData.name}
        onChange={onChange}
        error={errors.name}
        placeholder="Nombre de la tecnología"
        required
      />

      <FormSelect
        label="Sector"
        name="sector"
        value={formData.sector}
        onChange={onChange}
        options={sectors}
        error={errors.sector}
        placeholder="Seleccionar sector"
        required
      />

      <FormSelect
        label="Nivel de Adopción"
        name="adoptionLevel"
        value={formData.adoptionLevel}
        onChange={onChange}
        options={adoptionLevels}
        error={errors.adoptionLevel}
        placeholder="Seleccionar nivel"
        required
      />

      <div className="form-group">
        <label className="form-label">
          Descripción (opcional)
          <span style={{
            float: 'right',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            {formData.description.length}/500
          </span>
        </label>
        <textarea
          name="description"
          className="form-textarea"
          value={formData.description}
          onChange={onChange}
          placeholder="Describe brevemente esta tecnología..."
          maxLength="500"
          rows="4"
        />
        {errors.description && (
          <span className="form-error">{errors.description}</span>
        )}
      </div>

      <div className="btn-group" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Tecnología
        </button>
      </div>
    </form>
  );
};

export default TechnologyForm;
