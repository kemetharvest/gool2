import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="card card-hover"
    >
      <Link to={`/matches/${match.id}`}>
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex-1 text-left">
            <div className="flex items-center space-x-3 space-x-reverse mb-2">
              <img
                src={match.homeTeam.crest || 'https://via.placeholder.com/60'}
                alt={match.homeTeam.name}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60';
                }}
              />
              <div>
                <h3 className="font-semibold text-lg">{match.homeTeam.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{match.competition.name}</p>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center mx-4">
            {isLive && (
              <span className="live-badge mb-2">مباشر</span>
            )}
            <div className="flex items-center space-x-4 space-x-reverse">
              <motion.span
                key={match.score.fullTime.home}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold"
              >
                {match.score.fullTime.home ?? '-'}
              </motion.span>
              <span className="text-gray-400">-</span>
              <motion.span
                key={match.score.fullTime.away}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold"
              >
                {match.score.fullTime.away ?? '-'}
              </motion.span>
            </div>
            {isFinished && (
              <p className="text-xs text-gray-500 mt-1">انتهت</p>
            )}
            {match.status === 'SCHEDULED' && (
              <p className="text-xs text-gray-500 mt-1">
                {new Date(match.utcDate).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1 text-right">
            <div className="flex items-center space-x-3 space-x-reverse justify-end mb-2">
              <div>
                <h3 className="font-semibold text-lg">{match.awayTeam.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(match.utcDate).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <img
                src={match.awayTeam.crest || 'https://via.placeholder.com/60'}
                alt={match.awayTeam.name}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60';
                }}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

