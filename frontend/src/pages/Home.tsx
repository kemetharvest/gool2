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
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        يلا جول - YallaGoal
      </motion.h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8 space-x-2 space-x-reverse">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedDay(tab.key)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedDay === tab.key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

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

