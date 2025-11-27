import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import MatchCard from '../components/MatchCard';

export default function TeamDetails() {
  const { id } = useParams<{ id: string }>();
  const teamId = parseInt(id || '0', 10);

  const { data: team, isLoading: teamLoading } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => apiService.getTeam(teamId),
    enabled: !!teamId,
  });

  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ['team-matches', teamId],
    queryFn: () => apiService.getTeamMatches(teamId),
    enabled: !!teamId,
  });

  if (teamLoading) {
    return <div className="skeleton h-64"></div>;
  }

  if (!team) {
    return <div className="text-center py-12">الفريق غير موجود</div>;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 md:space-x-reverse">
          <img
            src={team.crest || 'https://via.placeholder.com/150'}
            alt={team.name}
            className="w-32 h-32 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
            }}
          />
          <div className="flex-1 text-center md:text-right">
            <h1 className="text-4xl font-bold mb-4">{team.name}</h1>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><span className="font-semibold">الاسم المختصر:</span> {team.shortName}</p>
              <p><span className="font-semibold">الملعب:</span> {team.venue}</p>
              <p><span className="font-semibold">تأسس:</span> {team.founded}</p>
              <p><span className="font-semibold">ألوان النادي:</span> {team.clubColors}</p>
              {team.website && (
                <p>
                  <span className="font-semibold">الموقع:</span>{' '}
                  <a href={team.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                    {team.website}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold mb-6">مباريات الفريق</h2>
      {matchesLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card skeleton h-32"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {matches.length === 0 ? (
            <p className="text-center text-gray-500 py-8">لا توجد مباريات</p>
          ) : (
            matches.map((match, index) => (
              <MatchCard key={match.id} match={match} index={index} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

