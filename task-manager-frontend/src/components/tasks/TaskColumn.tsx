import type { Task, TaskStatus } from '../../types';
import TaskCard from './TaskCard';

const ACCENT: Record<TaskStatus, string> = {
  TODO: 'border-t-amber',
  IN_PROGRESS: 'border-t-moss',
  DONE: 'border-t-sage',
};

export default function TaskColumn({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <div className={`flex flex-col rounded border-t-2 bg-surface px-4 py-3 ${ACCENT[status]}`}>
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="font-display text-base text-ink">{title}</h2>
        <span className="text-xs text-ink-soft">{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <p className="py-6 text-center text-xs text-ink-soft/70">Rien ici pour l'instant.</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
