import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { taskAPI } from '../api/tasks';

export function useTasks() {
  const [tasks,    setTasks]    = useState([]);
  const [stats,    setStats]    = useState({ total: 0, completed: 0, pending: 0 });
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [filter,   setFilter]   = useState('all');
  const [priority, setPriority] = useState('all');

  // useLocation lets us detect every time the user arrives at this page
  const location = useLocation();

  // Re-fetch whenever:
  // 1. filter changes
  // 2. priority changes
  // 3. the user navigates back to homepage (location changes)
  useEffect(() => {
    loadTasks();
  }, [filter, priority, location.key]);
  // location.key is a unique string React Router changes on EVERY navigation
  // so coming back from TaskDetail always triggers a fresh fetch

  async function loadTasks() {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filter   !== 'all') params.status   = filter;
      if (priority !== 'all') params.priority = priority;

      const res = await taskAPI.getAll(params);
      setTasks(res.data);
      setStats(res.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createTask(data) {
    const res = await taskAPI.create(data);
    setTasks(prev => [res.data, ...prev]);
    setStats(prev => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));
  }

  async function updateTask(id, data) {
    const res = await taskAPI.update(id, data);
    setTasks(prev => prev.map(t => t._id === id ? res.data : t));
  }

  async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const res = await taskAPI.toggleStatus(id, newStatus);
    setTasks(prev => prev.map(t => t._id === id ? res.data : t));
    const delta = newStatus === 'completed' ? 1 : -1;
    setStats(prev => ({
      ...prev,
      completed: prev.completed + delta,
      pending:   prev.pending   - delta,
    }));
  }

  async function deleteTask(id) {
    await taskAPI.delete(id);
    const task = tasks.find(t => t._id === id);
    setTasks(prev => prev.filter(t => t._id !== id));
    setStats(prev => ({
      total:     prev.total - 1,
      completed: prev.completed - (task?.status === 'completed' ? 1 : 0),
      pending:   prev.pending   - (task?.status === 'pending'   ? 1 : 0),
    }));
  }

  return {
    tasks, stats, loading, error,
    filter, setFilter,
    priority, setPriority,
    createTask, updateTask, toggleStatus, deleteTask,
  };
}