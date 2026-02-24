import { useState, useEffect, useRef } from 'react';

const EMPTY_FORM = { title: '', description: '', priority: 'medium' };

export function TaskModal({ isOpen, onClose, onSubmit, editTask }) {
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // When modal opens: fill form if editing, reset if adding
  useEffect(() => {
    if (!isOpen) return;
    setForm(editTask
      ? { title: editTask.title, description: editTask.description || '', priority: editTask.priority }
      : EMPTY_FORM
    );
    setErrors({});
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen, editTask]);

  function validate() {
    const e = {};
    if (!form.title.trim())          e.title = 'Title is required';
    if (form.title.length > 100)     e.title = 'Max 100 characters';
    if (form.description.length > 500) e.description = 'Max 500 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  }

  // Close on backdrop click
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">
            {editTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Title field */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Title <span className="text-accent-light">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="What needs to be done?"
              maxLength={100}
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

          {/* Description field */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Add more details (optional)..."
              rows={3}
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

          {/* Priority selector */}
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
                    py-2 rounded-xl text-sm font-semibold capitalize border transition-all
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

          {/* Submit error */}
          {errors.submit && (
            <p className="text-sm text-red-400 mb-4">{errors.submit}</p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border text-white/50 hover:text-white text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/80 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : editTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
