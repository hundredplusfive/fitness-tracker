import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TemplateCard } from './TemplateCard';
import { TemplateForm } from './TemplateForm';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function TemplatesList() {
  const { templates, deleteTemplate, duplicateTemplate } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingTemplateId(id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(id);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateTemplate(id);
  };

  const editingTemplate = editingTemplateId
    ? templates.find((t) => t.id === editingTemplateId)
    : undefined;

  const canCreateMore = templates.length < 6;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplateId(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Workout Templates</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={!canCreateMore}
          title={!canCreateMore ? 'Maximum 6 templates reached' : undefined}
        >
          + New Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p className="mb-0">No templates yet. Create your first workout template!</p>
        </div>
      ) : (
        <div className="row g-3">
          {templates.map((template) => (
            <div key={template.id} className="col-12 col-md-6 col-lg-4">
              <TemplateCard
                template={template}
                onEdit={() => handleEdit(template.id)}
                onDuplicate={() => handleDuplicate(template.id)}
                onDelete={() => handleDelete(template.id)}
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTemplate ? 'Edit Template' : 'Create Template'}
        className="modal-no-scrollbar"
      >
        <TemplateForm
          template={editingTemplate}
          onSubmit={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
