const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  ...rest
}) => {
  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        name={name}
        className="form-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default FormInput;
