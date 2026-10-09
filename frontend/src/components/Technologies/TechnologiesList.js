import { useState, useEffect, useCallback } from 'react';
import { technologiesService } from '../../services/api';
import useForm from '../../hooks/useForm';
import useApiCall from '../../hooks/useApiCall';
import { validateTechnologyForm } from '../../utils/validators';
import Modal from '../common/Modal';
import Alert from '../common/Alert';
import Spinner from '../common/Spinner';
import ConfirmDialog from '../common/ConfirmDialog';
import TechnologiesFilters from './TechnologiesFilters';
import TechnologiesGrid from './TechnologiesGrid';
import TechnologyForm from './TechnologyForm';

const TechnologiesList = () => {
  const [technologies, setTechnologies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({ sector: '', adoptionLevel: '' });

  const { loading, error, success, execute, clearError } = useApiCall();

  const initialFormValues = {
    name: '',
    sector: '',
    description: '',
    adoptionLevel: ''
  };

  const {
    values: formData,
    errors: formErrors,
    handleChange,
    handleSubmit,
    reset: resetForm,
    setFormValues
  } = useForm(initialFormValues, validateTechnologyForm);

  const loadTechnologies = useCallback(async () => {
    try {
      const response = await execute(() => technologiesService.getAll(filters));
      setTechnologies(response.data || []);
    } catch (err) {
    }
  }, [execute, filters]);

  useEffect(() => {
    loadTechnologies();
  }, [loadTechnologies]);

  const handleCreateOrUpdate = async (values) => {
    try {
      const dataToSubmit = {
        ...values,
        description: values.description || null
      };

      if (editingTechnology) {
        await execute(
          () => technologiesService.update(editingTechnology.id, dataToSubmit),
          'Tecnología actualizada exitosamente'
        );
      } else {
        await execute(
          () => technologiesService.create(dataToSubmit),
          'Tecnología creada exitosamente'
        );
      }

      setShowModal(false);
      resetForm();
      setEditingTechnology(null);
      loadTechnologies();
    } catch (err) {
    }
  };

  const handleEdit = (technology) => {
    setEditingTechnology(technology);
    setFormValues({
      name: technology.name,
      sector: technology.sector,
      description: technology.description || '',
      adoptionLevel: technology.adoption_level
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await execute(
        () => technologiesService.delete(deleteConfirm),
        'Tecnología eliminada exitosamente'
      );
      setDeleteConfirm(null);
      loadTechnologies();
    } catch (err) {
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingTechnology(null);
    setShowModal(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({ sector: '', adoptionLevel: '' });
  };

  return (
    <div>

      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Gestión de Tecnologías</h1>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Nueva Tecnología
          </button>
        </div>
      </div>

      {success && <Alert type="success" message={success} />}
      {error && <Alert type="error" message={error} onClose={clearError} />}

      <TechnologiesFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={clearFilters}
      />

      {loading ? (
        <Spinner />
      ) : (
        <TechnologiesGrid
          technologies={technologies}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteConfirm(id)}
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTechnology ? 'Editar Tecnología' : 'Nueva Tecnología'}
      >
        <TechnologyForm
          formData={formData}
          errors={formErrors}
          onChange={handleChange}
          onSubmit={handleSubmit(handleCreateOrUpdate)}
          onCancel={() => setShowModal(false)}
          isEditing={!!editingTechnology}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta tecnología? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        danger
      />
    </div>
  );
};

export default TechnologiesList;
