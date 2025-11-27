import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';

export default function Leagues() {
  const { data: leagues = [], isLoading } = useQuery({
    queryKey: ['leagues'],
    queryFn: () => apiService.getLeagues(),
  });

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        الدوريات
      </motion.h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card skeleton h-48"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league, index) => (
            <motion.div
              key={league.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Link to={`/leagues/${league.id}`}>
                <div className="card card-hover text-center">
                  <img
                    src={league.emblem || 'https://via.placeholder.com/100'}
                    alt={league.name}
                    className="w-24 h-24 mx-auto mb-4 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                    }}
                  />
                  <h3 className="text-xl font-bold mb-2">{league.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{league.area.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{league.type}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

