import { useApp } from '../../context/AppContext';

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void;
  onClose: () => void;
}

export function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  const { templates } = useApp();

  if (templates.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <p className="mb-1">No templates available.</p>
        <p className="small text-muted mb-0">
          Create a template in the Templates tab first.
        </p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-2">
      {templates.map((template) => (
        <button
          key={template.id}
          className="btn btn-outline-secondary text-start"
          onClick={() => {
            onSelect(template.id);
            onClose();
          }}
        >
          <span className="flex-grow-1">{template.name}</span>
          <span className="px-2 text-muted small">
            ( {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''} )
          </span>
        </button>
      ))}
    </div>
  );
}
