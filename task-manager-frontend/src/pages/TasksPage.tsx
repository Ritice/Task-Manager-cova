import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import StatusFilter, { type FilterValue } from '../components/tasks/StatusFilter';
import SearchBar from '../components/tasks/SearchBar';
import TaskBoard from '../components/tasks/TaskBoard';
import TaskFormModal from '../components/tasks/TaskFormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { createTaskRequest, deleteTaskRequest, fetchTasks, updateTaskRequest } from '../api/tasks';
import { extractErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import type { Task, TaskInput, TaskStatus } from '../types';

export default function TasksPage() {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>('ALL');
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const status: TaskStatus | undefined = filter === 'ALL' ? undefined : filter;
      const data = await fetchTasks({ status, search: search.trim() || undefined });
      setTasks(data);
    } catch (err) {
      showToast(extractErrorMessage(err, 'Impossible de charger les tâches'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filter, search, showToast]);

  useEffect(() => {
    const timeout = window.setTimeout(loadTasks, search ? 300 : 0);
    return () => window.clearTimeout(timeout);
  }, [loadTasks, search]);

  function openCreateModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  async function handleSubmit(data: TaskInput) {
    try {
      if (editingTask) {
        await updateTaskRequest(editingTask.id, data);
        showToast('Tâche mise à jour.', 'success');
      } else {
        await createTaskRequest(data);
        showToast('Tâche créée.', 'success');
      }
      setModalOpen(false);
      await loadTasks();
    } catch (err) {
      showToast(extractErrorMessage(err, 'Impossible d\'enregistrer la tâche'), 'error');
    }
  }

  async function handleDelete() {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTaskRequest(taskToDelete.id);
      showToast('Tâche supprimée.', 'success');
      setTaskToDelete(null);
      await loadTasks();
    } catch (err) {
      showToast(extractErrorMessage(err, 'Impossible de supprimer la tâche'), 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <StatusFilter value={filter} onChange={setFilter} />
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <Button onClick={openCreateModal}>+ Nouvelle tâche</Button>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded border border-dashed border-line py-16 text-center">
              <p className="text-sm text-ink-soft">
                {search || filter !== 'ALL'
                  ? 'Aucune tâche ne correspond à ces critères.'
                  : "Aucune tâche pour l'instant — commence par en créer une."}
              </p>
            </div>
          ) : (
            <TaskBoard tasks={tasks} filter={filter} onEdit={openEditModal} onDelete={setTaskToDelete} />
          )}
        </div>
      </main>

      <TaskFormModal
        open={modalOpen}
        task={editingTask}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title="Supprimer cette tâche ?"
        description={`« ${taskToDelete?.title} » sera définitivement supprimée.`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setTaskToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
