import { useState, useEffect, useCallback } from 'react';
import { startupsService } from '../../services/api';
import useForm from '../../hooks/useForm';
import useApiCall from '../../hooks/useApiCall';
import { validateStartupForm } from '../../utils/validators';
import Modal from '../common/Modal';
import Alert from '../common/Alert';
import Spinner from '../common/Spinner';
import ConfirmDialog from '../common/ConfirmDialog';
import StartupsFilters from './StartupsFilters';
import StartupsTable from './StartupsTable';
import StartupForm from './StartupForm';

const StartupsList = () => {
  const [startups, setStartups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStartup, setEditingStartup] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({ name: '', category: '' });

  const { loading, error, success, execute, clearError } = useApiCall();

  const initialFormValues = {
    name: '',
    foundedAt: '',
    location: '',
    category: '',
    fundingAmount: ''
  };

  const {
    values: formData,
    errors: formErrors,
    handleChange,
    handleSubmit,
    reset: resetForm,
    setFormValues
  } = useForm(initialFormValues, validateStartupForm);

  const loadStartups = useCallback(async () => {
    try {
      const response = await execute(() => startupsService.getAll(filters));
      setStartups(response.data || []);
    } catch (err) {
    }
  }, [execute, filters]);

  useEffect(() => {
    loadStartups();
  }, [loadStartups]);

  const handleCreateOrUpdate = async (values) => {
    try {
      const dataToSubmit = {
        ...values,
        fundingAmount: values.fundingAmount ? parseFloat(values.fundingAmount) : 0
      };

      if (editingStartup) {
        await execute(
          () => startupsService.update(editingStartup.id, dataToSubmit),
          'Startup actualizada exitosamente'
        );
      } else {
        await execute(
          () => startupsService.create(dataToSubmit),
          'Startup creada exitosamente'
        );
      }

      setShowModal(false);
      resetForm();
      setEditingStartup(null);
      loadStartups();
    } catch (err) {
    }
  };

  const handleEdit = (startup) => {
    setEditingStartup(startup);
    setFormValues({
      name: startup.name,
      foundedAt: startup.founded_at?.split('T')[0] || '',
      location: startup.location,
      category: startup.category,
      fundingAmount: startup.funding_amount || ''
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await execute(
        () => startupsService.delete(deleteConfirm),
        'Startup eliminada exitosamente'
      );
      setDeleteConfirm(null);
      loadStartups();
    } catch (err) {
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingStartup(null);
    setShowModal(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({ name: '', category: '' });
  };

  return (
    <div>

      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Gestión de Startups</h1>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Nueva Startup
          </button>
        </div>
      </div>

      {success && <Alert type="success" message={success} />}
      {error && <Alert type="error" message={error} onClose={clearError} />}

      <StartupsFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={clearFilters}
      />

      {loading ? (
        <Spinner />
      ) : (
        <StartupsTable
          startups={startups}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteConfirm(id)}
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingStartup ? 'Editar Startup' : 'Nueva Startup'}
      >
        <StartupForm
          formData={formData}
          errors={formErrors}
          onChange={handleChange}
          onSubmit={handleSubmit(handleCreateOrUpdate)}
          onCancel={() => setShowModal(false)}
          isEditing={!!editingStartup}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta startup? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        danger
      />
    </div>
  );
};

export default StartupsList;
