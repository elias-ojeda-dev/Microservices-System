import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';

const StartupForm = ({
  formData,
  errors,
  onChange,
  onSubmit,
  onCancel,
  isEditing
}) => {
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
    <form onSubmit={onSubmit} className="form">
      <FormInput
        label="Nombre"
        name="name"
        value={formData.name}
        onChange={onChange}
        error={errors.name}
        placeholder="Nombre de la startup"
        required
      />

      <FormInput
        label="Fecha de Fundación"
        name="foundedAt"
        type="date"
        value={formData.foundedAt}
        onChange={onChange}
        error={errors.foundedAt}
        max={new Date().toISOString().split('T')[0]}
        required
      />

      <FormInput
        label="Ubicación"
        name="location"
        value={formData.location}
        onChange={onChange}
        error={errors.location}
        placeholder="Ciudad, País"
        required
      />

      <FormSelect
        label="Categoría"
        name="category"
        value={formData.category}
        onChange={onChange}
        options={categories}
        error={errors.category}
        placeholder="Seleccionar categoría"
        required
      />

      <FormInput
        label="Monto de Inversión (USD)"
        name="fundingAmount"
        type="number"
        value={formData.fundingAmount}
        onChange={onChange}
        error={errors.fundingAmount}
        placeholder="0"
        min="0"
        step="1000"
      />

      <div className="btn-group" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Startup
        </button>
      </div>
    </form>
  );
};

export default StartupForm;
