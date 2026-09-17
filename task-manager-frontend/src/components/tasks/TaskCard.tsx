import type { Task } from '../../types';

const STATUS_DOT: Record<Task['status'], string> = {
  TODO: 'bg-amber',
  IN_PROGRESS: 'bg-moss',
  DONE: 'bg-sage',
};

const STATUS_LABEL: Record<Task['status'], string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <div className="group border-b border-line py-3 last:border-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[task.status]}`} aria-hidden />
          <div>
            <p className="text-sm font-medium text-ink">{task.title}</p>
            {task.description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-ink-soft">{task.description}</p>
            )}
            <p className="mt-1 text-[11px] text-ink-soft/70">
              {STATUS_LABEL[task.status]} · mis à jour le {formatDate(task.updatedAt)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Modifier ${task.title}`}
            className="rounded p-1.5 text-ink-soft hover:bg-paper-dim hover:text-ink cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Supprimer ${task.title}`}
            className="rounded p-1.5 text-ink-soft hover:bg-clay/10 hover:text-clay cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
