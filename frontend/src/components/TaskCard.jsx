import { useNavigate } from 'react-router-dom';

// Priority badge colors
const PRIORITY_STYLES = {
  high:   'bg-red-500/10   text-red-400   border-red-500/30',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  low:    'bg-blue-500/10  text-blue-400  border-blue-500/30',
};

export function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const navigate = useNavigate();
  const isCompleted = task.status === 'completed';

  function handleToggle(e) {
    e.stopPropagation(); // don't navigate when clicking checkbox
    onToggle(task._id, task.status);
  }

  function handleEdit(e) {
    e.stopPropagation(); // don't navigate when clicking edit
    onEdit(task);
  }
  
  function handleDelete(e) {
    e.stopPropagation(); // don't navigate when clicking delete
    if (confirm('Delete this task?')) onDelete(task._id);
  }

  return (
    <div
      onClick={() => navigate(`/tasks/${task._id}`)}
      className="
        group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer
        bg-card border-border
        hover:border-accent/40 hover:bg-[#1e1e30]
        transition-all duration-200 animate-fade-up
      "
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={`
          mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
          transition-all duration-200
          ${isCompleted
            ? 'bg-green-500 border-green-500'
            : 'border-border hover:border-accent'
          }
        `}
      >
        {isCompleted && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-[0.95rem] mb-1 ${isCompleted ? 'line-through text-white/30' : 'text-white/90'}`}>
          {task.title}
        </h3>

        {task.description && (
          <p className="text-sm text-white/40 mb-3 leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[0.68rem] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${PRIORITY_STYLES[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`text-[0.68rem] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${
            isCompleted
              ? 'bg-green-500/10 text-green-400 border-green-500/25'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
          }`}>
            {task.status}
          </span>
          <span className="text-[0.72rem] text-white/25 ml-auto">
            {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Action buttons — visible on hover */}
      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-white/40 hover:text-accent-light hover:border-accent/50 transition-colors"
          title="Edit"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-500/50 transition-colors"
          title="Delete"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
