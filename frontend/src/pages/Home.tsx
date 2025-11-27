import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import MatchCard from '../components/MatchCard';
import { useWebSocket } from '../hooks/useWebSocket';

type DayFilter = 'yesterday' | 'today' | 'tomorrow';

export default function Home() {
  const [selectedDay, setSelectedDay] = useState<DayFilter>('today');

  const { data: matches = [], isLoading, refetch } = useQuery({
    queryKey: ['matches', selectedDay],
    queryFn: () => apiService.getMatches(selectedDay),
  });

  // Listen for real-time updates
  useWebSocket(undefined, (message) => {
    if (message.type === 'match_update') {
      refetch();
    }
  });

  const tabs = [
    { key: 'yesterday' as DayFilter, label: 'مباريات الأمس' },
    { key: 'today' as DayFilter, label: 'مباريات اليوم' },
    { key: 'tomorrow' as DayFilter, label: 'مباريات الغد' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-5xl md:text-6xl font-black mb-4 gradient-text"
        >
          يلا جول
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 dark:text-gray-400"
        >
          YallaGoal - متابعة مباشرة لجميع المباريات
        </motion.p>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mb-10 space-x-3 space-x-reverse"
      >
        {tabs.map((tab, idx) => (
          <motion.button
            key={tab.key}
            onClick={() => setSelectedDay(tab.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              selectedDay === tab.key
                ? 'bg-gradient-to-r from-primary-600 to-red-600 text-white shadow-xl scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Matches */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card skeleton h-32"></div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد مباريات في هذا اليوم</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <MatchCard key={match.id} match={match} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

