import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTasks } from './hooks/useTasks';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { useToast, ToastList } from './components/Toast';
import toast from 'react-hot-toast';
import TaskDetail from './pages/TaskDetail';

export default function App() {
  const {
    tasks, stats, loading, error,
    filter, setFilter,
    priority, setPriority,
    createTask, updateTask, toggleStatus, deleteTask,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTask,  setEditTask]  = useState(null);


  function openAdd() {
    setEditTask(null);
    setModalOpen(true);
  }

  function openEdit(task) {
    setEditTask(task);
    setModalOpen(true);
  }

  async function handleSubmit(data) {
    if (editTask) {
      await updateTask(editTask._id, data);
      toast.success('Task updated!');
    } else {
      await createTask(data);
      toast.success('Task created!');
    }
  }

  async function handleToggle(id, status) {
    try {
      await toggleStatus(id, status);
      const next = status === 'completed' ? 'pending' : 'completed';
      toast.success(`Marked as ${next}`);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.message);
    }
  }

  const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const HomePage = (
    <main className="max-w-3xl mx-auto px-4 py-8">

      {stats.total > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 mb-6">
          <div className="flex justify-between text-sm font-semibold text-white/40 mb-2.5">
            <span>Progress</span>
            <span className="text-white/70">{percent}%</span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/25 uppercase tracking-wider font-semibold">Status</span>
          {['all', 'pending', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all ${
                filter === f
                  ? 'bg-accent text-white border-accent'
                  : 'bg-transparent text-white/40 border-border hover:text-white/70'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/25 uppercase tracking-wider font-semibold">Priority</span>
          {['all', 'high', 'medium', 'low'].map(p => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all ${
                priority === p
                  ? 'bg-accent text-white border-accent'
                  : 'bg-transparent text-white/40 border-border hover:text-white/70'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20 text-white/30">
          <div className="w-7 h-7 border-2 border-border border-t-accent rounded-full animate-spin" />
          <p className="text-sm">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <p className="text-red-400 font-semibold">⚠️ {error}</p>
          <p className="text-xs text-white/25">Make sure the backend is running on port 5000</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-white/25">
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M9 12h6M9 8h6M9 16h3" />
          </svg>
          <p className="text-sm">No tasks found</p>
          <button onClick={openAdd} className="text-sm text-accent-light hover:text-accent transition-colors">
            + Create your first task
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onToggle={handleToggle}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </main>
  );

  return (
    <div className="min-h-screen bg-base font-sans">

      <header className="sticky top-0 z-40 bg-base/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">

          <div className="flex items-center gap-2.5 mr-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-light to-accent flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">
              Task<span className="text-accent-light">Flow</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {[
              { label: 'Total',   value: stats.total },
              { label: 'Done',    value: stats.completed },
              { label: 'Pending', value: stats.pending },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center bg-surface border border-border rounded-xl px-3 py-1.5 min-w-[52px]">
                <span className="text-base font-bold text-white leading-none">{value}</span>
                <span className="text-[0.6rem] text-white/30 uppercase tracking-wider mt-0.5">{label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-accent/20"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Task
          </button>

        </div>
      </header>

      <Routes>
        <Route path="/"          element={HomePage} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
      </Routes>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editTask={editTask}
      />

    </div>
  );
}