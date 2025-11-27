import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 space-x-reverse">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="text-3xl font-black gradient-text"
            >
              يلا جول
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-bold text-gray-500 dark:text-gray-400"
            >
              YallaGoal
            </motion.span>
          </Link>

          <div className="hidden md:flex items-center space-x-2 space-x-reverse">
            {[
              { to: '/', label: 'الرئيسية' },
              { to: '/leagues', label: 'الدوريات' },
              { to: '/teams', label: 'المنتخبات' },
              { to: '/news', label: 'الأخبار' },
              { to: '/admin', label: 'لوحة التحكم' },
            ].map((item) => (
              <Link key={item.to} to={item.to}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-red-50 dark:hover:from-primary-900/20 dark:hover:to-red-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
          </div>

          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </motion.button>
        </div>
      </div>
    </nav>
  );
}

