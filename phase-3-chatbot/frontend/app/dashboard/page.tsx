'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWidget from '../components/ChatWidget';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    loadTasks(token);
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

  const loadTasks = async (token: string) => {
    try {
      const data = await api.getTasks(token);
      setTasks(data);
    } catch (error: any) {
      if (error.message.includes('Failed to fetch')) {
        localStorage.clear();
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await api.createTask(token, newTask);
      setNewTask({ title: '', description: '' });
      setShowAddModal(false);
      loadTasks(token);
    } catch (error: any) {
      alert('Failed to create task: ' + error.message);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await api.updateTask(token, task.id, { completed: !task.completed });
      loadTasks(token);
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await api.deleteTask(token, id);
      loadTasks(token);
    } catch (error) {
      alert('Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'completed' ? task.completed :
      !task.completed;
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 border-4 border-t-transparent rounded-full mx-auto mb-4 ${darkMode ? 'border-indigo-500' : 'border-indigo-600'}`}
          />
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading...</p>
        </motion.div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-950' 
        : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50'
    }`}>
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed left-0 top-0 h-full w-72 border-r backdrop-blur-xl z-40 ${
          darkMode 
            ? 'bg-slate-900/95 border-slate-800' 
            : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>TaskFlow</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Stay Organized</p>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className={`p-4 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.username}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Premium User</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="space-y-3">
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Overview</h3>
            <div className="space-y-2">
              {[
                { label: 'All Tasks', count: tasks.length, icon: '📋', gradient: 'from-blue-500 to-cyan-500' },
                { label: 'In Progress', count: pendingCount, icon: '⏳', gradient: 'from-orange-500 to-amber-500' },
                { label: 'Completed', count: completedCount, icon: '✅', gradient: 'from-green-500 to-emerald-500' },
              ].map((stat) => (
                <motion.div 
                  key={stat.label}
                  whileHover={{ x: 4 }}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center text-xl shadow-md`}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{stat.label}</p>
                      </div>
                    </div>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.count}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-slate-800">
            <motion.button
              whileHover={{ x: 4 }}
              onClick={toggleDarkMode}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                darkMode ? 'hover:bg-slate-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
              <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ x: 4 }}
              onClick={handleLogout}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                darkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="ml-72 min-h-screen">
        {/* Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`sticky top-0 z-30 backdrop-blur-xl border-b ${
            darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'
          }`}
        >
          <div className="px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  My Tasks
                </h2>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Task</span>
              </motion.button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="flex-1 relative">
                <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-indigo-500' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Filter Tabs */}
              <div className={`flex items-center space-x-1 p-1 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                {(['all', 'pending', 'completed'] as const).map((f) => (
                  <motion.button
                    key={f}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${
                      filter === f
                        ? darkMode
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-white text-indigo-600 shadow-md'
                        : darkMode
                          ? 'text-gray-400 hover:text-gray-300'
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Tasks Grid */}
        <div className="p-8">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`rounded-3xl p-20 text-center border ${
                  darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
                }`}
              >
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-6xl">📝</span>
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {searchQuery ? 'No tasks found' : 'No tasks yet'}
                </h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first task'}
                </p>
                {!searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Create Task
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className={`group relative rounded-2xl p-6 border transition-all ${
                      task.completed
                        ? darkMode
                          ? 'bg-slate-900/50 border-slate-800 hover:border-green-500/50'
                          : 'bg-green-50/50 border-green-200 hover:border-green-300'
                        : darkMode
                          ? 'bg-slate-900/50 border-slate-800 hover:border-indigo-500/50'
                          : 'bg-white border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-lg'
                    }`}
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleComplete(task)}
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-green-500 border-green-500'
                            : darkMode
                              ? 'border-slate-600 hover:border-indigo-500'
                              : 'border-gray-300 hover:border-indigo-500'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteTask(task.id)}
                        className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all ${
                          darkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Task Content */}
                    <div className="space-y-3">
                      <h3 className={`text-lg font-semibold leading-tight ${
                        task.completed
                          ? darkMode ? 'text-gray-500 line-through' : 'text-gray-400 line-through'
                          : darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p className={`text-sm leading-relaxed line-clamp-3 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {task.description}
                        </p>
                      )}

                      {/* Task Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-800">
                        <span className={`text-xs flex items-center space-x-1 ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </span>
                        
                        {task.completed && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className={`text-center py-8 border-t ${darkMode ? 'border-slate-800 text-gray-500' : 'border-gray-200 text-gray-600'}`}>
          <p className="text-sm">
            Crafted with ❤️ by <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Sameer Sheikh</span>
          </p>
        </footer>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-3xl p-8 max-w-lg w-full shadow-2xl ${
                darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Create New Task
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddModal(false)}
                  className={`p-2 rounded-xl transition-all ${
                    darkMode ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-5">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                      darkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'
                    }`}
                    placeholder="What needs to be done?"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description (Optional)
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none ${
                      darkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'
                    }`}
                    rows={4}
                    placeholder="Add more details..."
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(false)}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                      darkMode
                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                        : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Create Task
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}