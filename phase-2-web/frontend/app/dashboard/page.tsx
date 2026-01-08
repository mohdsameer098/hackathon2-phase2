'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [filterView, setFilterView] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Simulate loading
    setTimeout(() => {
      setTasks([
        { id: 1, title: 'Complete project proposal', description: 'Write detailed proposal for Q1', completed: false, created_at: new Date().toISOString() },
        { id: 2, title: 'Team meeting', description: 'Discuss sprint planning', completed: true, created_at: new Date().toISOString() },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTaskObj = {
      id: Date.now(),
      ...newTask,
      completed: false,
      created_at: new Date().toISOString()
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask({ title: '', description: '' });
    setShowAddModal(false);
  };

  const handleToggleComplete = (task: Task) => {
    if (!task.completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: number) => {
    if (confirm('Delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const filteredTasks = tasks.filter(task => {
    if (filterView === 'active') return !task.completed;
    if (filterView === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 border-4 border-t-violet-500 rounded-full mx-auto mb-4 ${
              darkMode ? 'border-slate-800' : 'border-gray-200'
            }`}
          />
          <p className={`font-medium ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Loading your workspace...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode ? 'bg-slate-950' : 'bg-gray-50'
    }`}>
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: '50vw', y: -20, scale: 0, rotate: 0 }}
                animate={{ 
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 50,
                  scale: [0, 1, 1, 0],
                  rotate: Math.random() * 720
                }}
                transition={{ duration: 2 + Math.random(), ease: "easeOut" }}
                className="absolute w-2 h-2"
                style={{ 
                  backgroundColor: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'][i % 4],
                  borderRadius: Math.random() > 0.5 ? '50%' : '0%'
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
          darkMode 
            ? 'bg-slate-950/90 border-slate-800' 
            : 'bg-white/90 border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center"
            >
              <span className="text-white text-lg font-bold">T</span>
            </motion.div>
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              TaskManager
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                darkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {user.username}
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                darkMode 
                  ? 'text-red-400 hover:bg-red-500/10' 
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Tasks', value: tasks.length, icon: '📊', bg: darkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200', text: darkMode ? 'text-blue-400' : 'text-blue-600' },
            { label: 'Active', value: pendingCount, icon: '🔥', bg: darkMode ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200', text: darkMode ? 'text-orange-400' : 'text-orange-600' },
            { label: 'Completed', value: completedCount, icon: '✓', bg: darkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200', text: darkMode ? 'text-green-400' : 'text-green-600' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -2 }}
              className={`p-5 rounded-2xl border ${stat.bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-3xl font-bold ${stat.text}`}>
                  {stat.value}
                </span>
              </div>
              <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs + Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div className={`inline-flex rounded-xl p-1 ${
            darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-gray-100 border border-gray-200'
          }`}>
            {(['all', 'active', 'completed'] as const).map(view => (
              <motion.button
                key={view}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilterView(view)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterView === view
                    ? darkMode
                      ? 'bg-violet-500 text-white shadow-lg'
                      : 'bg-white text-gray-900 shadow-md'
                    : darkMode
                      ? 'text-slate-400 hover:text-slate-300'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-medium shadow-lg flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            <span>New Task</span>
          </motion.button>
        </div>

        {/* Tasks List */}
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`py-20 text-center rounded-2xl border-2 border-dashed ${
                darkMode ? 'border-slate-800 bg-slate-900/30' : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="text-5xl mb-3">📝</div>
              <h3 className={`text-xl font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No tasks {filterView !== 'all' && filterView}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {filterView === 'all' ? 'Create your first task to get started' : `You don't have any ${filterView} tasks`}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ x: 4 }}
                  className={`group p-4 rounded-xl border transition-all ${
                    task.completed
                      ? darkMode
                        ? 'bg-slate-900/50 border-slate-800'
                        : 'bg-gray-50 border-gray-200'
                      : darkMode
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleComplete(task)}
                      className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        task.completed
                          ? 'bg-violet-500 border-violet-500'
                          : darkMode
                            ? 'border-slate-600 hover:border-violet-500'
                            : 'border-gray-300 hover:border-violet-500'
                      }`}
                    >
                      {task.completed && (
                        <motion.svg
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </motion.button>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold mb-0.5 ${
                        task.completed
                          ? darkMode ? 'text-slate-500 line-through' : 'text-gray-400 line-through'
                          : darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {task.description}
                        </p>
                      )}
                      <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        {new Date(task.created_at).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteTask(task.id)}
                      className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all ${
                        darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-2xl p-6 max-w-md w-full ${
                darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Create Task
                </h2>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => setShowAddModal(false)}
                  className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                >
                  <svg className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-violet-500'
                        : 'bg-white border-gray-200 focus:border-violet-500'
                    }`}
                    placeholder="Enter task title..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all resize-none ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-violet-500'
                        : 'bg-white border-gray-200 focus:border-violet-500'
                    }`}
                    rows={3}
                    placeholder="Add details (optional)..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(false)}
                    className={`flex-1 px-4 py-2.5 rounded-xl font-medium ${
                      darkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddTask}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-medium"
                  >
                    Create
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}