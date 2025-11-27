import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, MapPin, Calendar } from 'lucide-react';
import { apiService } from '../services/api';

export default function Leagues() {
  const { data: leagues = [], isLoading } = useQuery({
    queryKey: ['leagues'],
    queryFn: () => apiService.getLeagues(),
  });

  const getLeagueImage = (leagueName: string) => {
    const images = [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600&h=400&fit=crop',
    ];
    return images[leagueName.length % images.length];
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
          <Trophy className="w-12 h-12 text-primary-600" />
          الدوريات
        </motion.h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">استكشف جميع الدوريات والبطولات</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card skeleton h-64"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leagues.map((league, index) => (
            <motion.div
              key={league.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <Link to={`/leagues/${league.id}`}>
                <div className="card card-hover text-center relative overflow-hidden group">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 bg-cover bg-center"
                    style={{ backgroundImage: `url(${getLeagueImage(league.name)})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className="mb-6"
                    >
                      <img
                        src={league.emblem || `https://ui-avatars.com/api/?name=${encodeURIComponent(league.name)}&background=dc2626&color=fff&size=200`}
                        alt={league.name}
                        className="w-32 h-32 mx-auto object-contain bg-white dark:bg-gray-700 rounded-full p-4 shadow-2xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(league.name)}&background=dc2626&color=fff&size=200`;
                        }}
                      />
                    </motion.div>
                    <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white">{league.name}</h3>
                    <div className="flex items-center justify-center space-x-2 space-x-reverse mb-2">
                      <MapPin className="w-4 h-4 text-primary-600" />
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{league.area.name}</p>
                    </div>
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">{league.type}</p>
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

