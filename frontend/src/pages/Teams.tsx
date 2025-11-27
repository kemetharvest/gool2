import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, MapPin, Calendar } from 'lucide-react';
import { apiService } from '../services/api';

export default function Teams() {
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => apiService.getTeams(),
  });

  const getTeamImage = (teamName: string) => {
    const images = [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=300&fit=crop',
    ];
    return images[teamName.length % images.length];
  };

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
          transition={{ type: "spring" }}
          className="text-5xl md:text-6xl font-black mb-4 gradient-text flex items-center justify-center gap-3"
        >
          <Users className="w-12 h-12 text-primary-600" />
          المنتخبات
        </motion.h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">استكشف جميع الفرق والمنتخبات</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="card skeleton h-64"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.05,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.08, y: -10, rotate: 2 }}
            >
              <Link to={`/teams/${team.id}`}>
                <div className="card card-hover text-center relative overflow-hidden group">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 bg-cover bg-center"
                    style={{ backgroundImage: `url(${getTeamImage(team.name)})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.15 }}
                      transition={{ duration: 0.6 }}
                      className="mb-4"
                    >
                      <img
                        src={team.crest || `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name)}&background=dc2626&color=fff&size=200`}
                        alt={team.name}
                        className="w-28 h-28 mx-auto object-contain bg-white dark:bg-gray-700 rounded-full p-3 shadow-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name)}&background=dc2626&color=fff&size=200`;
                        }}
                      />
                    </motion.div>
                    <h3 className="text-xl font-black mb-2 text-gray-900 dark:text-white">{team.name}</h3>
                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3">{team.shortName}</p>
                    <div className="flex items-center justify-center space-x-2 space-x-reverse text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{team.venue}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

