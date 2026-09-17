import { useEffect, useState, type FormEvent } from 'react';
import type { Task, TaskInput, TaskStatus } from '../../types';
import Button from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

interface TaskFormModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (data: TaskInput) => Promise<void>;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'À faire' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'DONE', label: 'Terminé' },
];

const EMPTY_FORM: TaskInput = { title: '', description: '', status: 'TODO' };

export default function TaskFormModal({ open, task, onClose, onSubmit }: TaskFormModalProps) {
  const [form, setForm] = useState<TaskInput>(EMPTY_FORM);
  const [titleError, setTitleError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        task
          ? { title: task.title, description: task.description ?? '', status: task.status }
          : EMPTY_FORM
      );
      setTitleError(undefined);
    }
  }, [open, task]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setTitleError('Le titre est obligatoire');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-md rounded bg-surface p-6 shadow-lg">
        <h2 className="font-display text-xl text-ink">
          {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
        </h2>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <Input
            label="Titre"
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              if (titleError) setTitleError(undefined);
            }}
            error={titleError}
            autoFocus
          />
          <Textarea
            label="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink-soft">Statut</span>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm({ ...form, status: option.value })}
                  className={`flex-1 rounded border px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                    form.status === option.value
                      ? 'border-moss bg-moss text-paper'
                      : 'border-line text-ink-soft hover:border-ink'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {task ? 'Enregistrer' : 'Créer la tâche'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
