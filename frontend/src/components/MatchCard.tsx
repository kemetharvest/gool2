import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Clock } from 'lucide-react';
import { Match } from '../services/api';

interface MatchCardProps {
  match: Match;
  index?: number;
}

export default function MatchCard({ match, index = 0 }: MatchCardProps) {
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FINISHED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.02, y: -8 }}
      className="card card-hover relative overflow-hidden group"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 via-transparent to-red-50/50 dark:from-primary-900/10 dark:to-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <Link to={`/matches/${match.id}`} className="relative z-10">
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex-1 text-left">
            <motion.div 
              className="flex items-center space-x-4 space-x-reverse mb-2"
              whileHover={{ x: -5 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative"
              >
                <img
                  src={match.homeTeam.crest || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.homeTeam.name)}&background=dc2626&color=fff&size=128`}
                  alt={match.homeTeam.name}
                  className="w-16 h-16 object-contain bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(match.homeTeam.name)}&background=dc2626&color=fff&size=128`;
                  }}
                />
              </motion.div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">{match.homeTeam.name}</h3>
                <div className="flex items-center space-x-1 space-x-reverse mt-1">
                  <Trophy className="w-3 h-3 text-primary-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{match.competition.name}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center mx-6">
            {isLive && (
              <motion.span 
                className="live-badge mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                🔴 مباشر
              </motion.span>
            )}
            <div className="flex items-center space-x-6 space-x-reverse">
              <motion.span
                key={match.score.fullTime.home}
                initial={{ scale: 1.8, color: '#dc2626' }}
                animate={{ scale: 1, color: '#111827' }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-4xl font-black gradient-text dark:text-white"
              >
                {match.score.fullTime.home ?? '-'}
              </motion.span>
              <span className="text-2xl text-gray-400 font-bold">-</span>
              <motion.span
                key={match.score.fullTime.away}
                initial={{ scale: 1.8, color: '#dc2626' }}
                animate={{ scale: 1, color: '#111827' }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-4xl font-black gradient-text dark:text-white"
              >
                {match.score.fullTime.away ?? '-'}
              </motion.span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse mt-2">
              {isFinished && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500 flex items-center"
                >
                  <Clock className="w-3 h-3 ml-1" />
                  انتهت
                </motion.p>
              )}
              {match.status === 'SCHEDULED' && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500 flex items-center"
                >
                  <Calendar className="w-3 h-3 ml-1" />
                  {new Date(match.utcDate).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </motion.p>
              )}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex-1 text-right">
            <motion.div 
              className="flex items-center space-x-4 space-x-reverse justify-end mb-2"
              whileHover={{ x: 5 }}
            >
              <div className="text-right">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">{match.awayTeam.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center justify-end mt-1">
                  {new Date(match.utcDate).toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="relative"
              >
                <img
                  src={match.awayTeam.crest || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.awayTeam.name)}&background=dc2626&color=fff&size=128`}
                  alt={match.awayTeam.name}
                  className="w-16 h-16 object-contain bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(match.awayTeam.name)}&background=dc2626&color=fff&size=128`;
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

