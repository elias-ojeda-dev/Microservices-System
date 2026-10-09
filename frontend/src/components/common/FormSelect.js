const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  placeholder = 'Seleccionar...',
  required = false
}) => {
  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && '*'}
      </label>
      <select
        name={name}
        className="form-select"
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default FormSelect;
