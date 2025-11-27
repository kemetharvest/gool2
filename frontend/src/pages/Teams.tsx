import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';

export default function Teams() {
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => apiService.getTeams(),
  });

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        المنتخبات
      </motion.h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="card skeleton h-48"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Link to={`/teams/${team.id}`}>
                <div className="card card-hover text-center">
                  <img
                    src={team.crest || 'https://via.placeholder.com/100'}
                    alt={team.name}
                    className="w-24 h-24 mx-auto mb-4 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                    }}
                  />
                  <h3 className="text-xl font-bold mb-2">{team.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{team.shortName}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

