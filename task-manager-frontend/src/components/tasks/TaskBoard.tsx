import type { Task, TaskStatus } from '../../types';
import type { FilterValue } from './StatusFilter';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'TODO', title: 'À faire' },
  { status: 'IN_PROGRESS', title: 'En cours' },
  { status: 'DONE', title: 'Terminé' },
];

export default function TaskBoard({
  tasks,
  filter,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  filter: FilterValue;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  if (filter !== 'ALL') {
    const filtered = tasks.filter((t) => t.status === filter);
    return (
      <div className="rounded border-t-2 border-t-line bg-surface px-4 py-3">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-soft/70">Aucune tâche ne correspond à ces critères.</p>
        ) : (
          filtered.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((column) => (
        <TaskColumn
          key={column.status}
          title={column.title}
          status={column.status}
          tasks={tasks.filter((t) => t.status === column.status)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
