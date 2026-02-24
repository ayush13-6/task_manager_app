import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { taskAPI } from '../api/tasks';

const PRIORITY_STYLES = {
  high:   'bg-red-500/10   text-red-400   border-red-500/30',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  low:    'bg-blue-500/10  text-blue-400  border-blue-500/30',
};

export default function TaskDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [task,      setTask]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form,      setForm]      = useState({ title: '', description: '', priority: 'medium' });
  const [saving,    setSaving]    = useState(false);
  const [errors,    setErrors]    = useState({});

  // ── removed: const [toast, setToast] = useState(null)
  // ── removed: showToast() function
  // ── removed: the toast div at the bottom
  // Now we just call toast.success() or toast.error() directly

  useEffect(() => {
    async function loadTask() {
      try {
        const res = await taskAPI.getOne(id);
        setTask(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTask();
  }, [id]);

  function startEditing() {
    setForm({
      title:       task.title,
      description: task.description || '',
      priority:    task.priority,
    });
    setErrors({});
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setErrors({});
  }

  function validate() {
    const e = {};
    if (!form.title.trim())            e.title = 'Title is required';
    if (form.title.length > 100)       e.title = 'Max 100 characters';
    if (form.description.length > 500) e.description = 'Max 500 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await taskAPI.update(id, form);
      setTask(res.data);
      setIsEditing(false);
      toast.success('Task updated!');       // ← react-hot-toast
    } catch (err) {
      toast.error(err.message);             // ← react-hot-toast
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this task? This cannot be undone.')) return;
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted!');       // ← react-hot-toast
      navigate('/', { state: { deletedId: id } });
    } catch (err) {
      toast.error(err.message);             // ← react-hot-toast
    }
  }

  // ── Loading ──
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-white/40">
      <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
      <p className="text-sm">Loading task...</p>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <p className="text-red-400 font-semibold">⚠️ {error}</p>
      <button onClick={() => navigate('/')} className="text-sm text-white/40 hover:text-white transition-colors">
        ← Back to tasks
      </button>
    </div>
  );

  const isCompleted = task.status === 'completed';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8"
      >
        ← Back to tasks
      </button>

      <div className="bg-card border border-border rounded-2xl p-8">

        {/* ── VIEW MODE ── */}
        {!isEditing ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                <span className={`text-[0.68rem] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${PRIORITY_STYLES[task.priority]}`}>
                  {task.priority} priority
                </span>
                <span className={`text-[0.68rem] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${
                  isCompleted
                    ? 'bg-green-500/10 text-green-400 border-green-500/25'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                }`}>
                  {task.status}
                </span>
              </div>

              {/* Edit + Delete */}
              <div className="flex gap-2">
                <button
                  onClick={startEditing}
                  className="px-3 py-2 rounded-xl text-xs font-semibold border bg-surface text-white/60 border-border hover:text-white hover:border-white/30 transition-all"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 rounded-xl text-xs font-semibold border bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20 transition-all"
                >
                  🗑 Delete
                </button>
              </div>
            </div>

            <h1 className={`text-2xl font-bold mb-3 leading-snug ${isCompleted ? 'line-through text-white/30' : 'text-white'}`}>
              {task.title}
            </h1>

            {task.description ? (
              <p className="text-white/50 text-[0.95rem] leading-relaxed whitespace-pre-wrap mb-8">
                {task.description}
              </p>
            ) : (
              <p className="text-white/20 italic text-sm mb-8">No description provided.</p>
            )}

            <div className="border-t border-border mb-6" />

            <div className="space-y-3">
              {[
                { label: 'Created',      value: new Date(task.createdAt).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                { label: 'Last Updated', value: new Date(task.updatedAt).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-xs text-white/25 uppercase tracking-wider font-semibold flex-shrink-0">{label}</span>
                  <span className="text-sm text-white/40 text-right break-all">{value}</span>
                </div>
              ))}
            </div>
          </>
        ) : (

          /* ── EDIT MODE ── */
          <>
            <h2 className="text-lg font-bold text-white mb-6">✏️ Edit Task</h2>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Title <span className="text-accent-light">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Task title..."
                maxLength={100}
                autoFocus
                className={`
                  w-full bg-surface border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20
                  outline-none transition-all
                  ${errors.title
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-border focus:border-accent focus:ring-2 focus:ring-accent/20'
                  }
                `}
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-red-400">{errors.title}</span>
                <span className={`text-xs ${form.title.length > 90 ? 'text-amber-400' : 'text-white/25'}`}>
                  {form.title.length}/100
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Task description..."
                rows={4}
                maxLength={500}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-red-400">{errors.description}</span>
                <span className={`text-xs ${form.description.length > 450 ? 'text-amber-400' : 'text-white/25'}`}>
                  {form.description.length}/500
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, priority: p }))}
                    className={`
                      py-2.5 rounded-xl text-sm font-semibold capitalize border transition-all
                      ${form.priority === p
                        ? p === 'high'   ? 'bg-red-500/15   text-red-400   border-red-500/40'
                        : p === 'medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                        :                  'bg-blue-500/15  text-blue-400  border-blue-500/40'
                        : 'bg-surface text-white/40 border-border hover:text-white/70'
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelEditing}
                className="px-5 py-2.5 rounded-xl border border-border text-white/50 hover:text-white text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/80 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}