export const validateStartupForm = (formData) => {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = 'El nombre es requerido';
  }

  if (!formData.foundedAt) {
    errors.foundedAt = 'La fecha de fundación es requerida';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.foundedAt)) {
      errors.foundedAt = 'Formato de fecha inválido (YYYY-MM-DD)';
    }
  }

  if (!formData.location.trim()) {
    errors.location = 'La ubicación es requerida';
  }

  if (!formData.category) {
    errors.category = 'La categoría es requerida';
  }

  if (formData.fundingAmount && (isNaN(formData.fundingAmount) || formData.fundingAmount < 0)) {
    errors.fundingAmount = 'El monto de inversión debe ser un número positivo';
  }

  return errors;
};

export const validateTechnologyForm = (formData) => {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = 'El nombre es requerido';
  }

  if (!formData.sector) {
    errors.sector = 'El sector es requerido';
  }

  if (!formData.adoptionLevel) {
    errors.adoptionLevel = 'El nivel de adopción es requerido';
  }

  if (formData.description && formData.description.length > 500) {
    errors.description = 'La descripción no puede exceder 500 caracteres';
  }

  return errors;
};
