import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import MatchCard from '../components/MatchCard';

export default function LeagueDetails() {
  const { id } = useParams<{ id: string }>();
  const leagueId = parseInt(id || '0', 10);
  const [activeTab, setActiveTab] = useState<'table' | 'matches'>('table');

  const { data: league, isLoading: leagueLoading } = useQuery({
    queryKey: ['league', leagueId],
    queryFn: () => apiService.getLeague(leagueId),
    enabled: !!leagueId,
  });

  const { data: table = [], isLoading: tableLoading } = useQuery({
    queryKey: ['league-table', leagueId],
    queryFn: () => apiService.getLeagueTable(leagueId),
    enabled: !!leagueId && activeTab === 'table',
  });

  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ['league-matches', leagueId],
    queryFn: () => apiService.getLeagueMatches(leagueId),
    enabled: !!leagueId && activeTab === 'matches',
  });

  if (leagueLoading) {
    return <div className="skeleton h-64"></div>;
  }

  if (!league) {
    return <div className="text-center py-12">الدوري غير موجود</div>;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8 text-center"
      >
        <img
          src={league.emblem || 'https://via.placeholder.com/100'}
          alt={league.name}
          className="w-32 h-32 mx-auto mb-4 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
          }}
        />
        <h1 className="text-4xl font-bold mb-2">{league.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">{league.area.name}</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center mb-8 space-x-2 space-x-reverse">
        <button
          onClick={() => setActiveTab('table')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === 'table'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          جدول الترتيب
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === 'matches'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          المباريات
        </button>
      </div>

      {/* Content */}
      {activeTab === 'table' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card overflow-x-auto"
        >
          {tableLoading ? (
            <div className="skeleton h-96"></div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-right p-4">المركز</th>
                  <th className="text-right p-4">الفريق</th>
                  <th className="text-center p-4">ل</th>
                  <th className="text-center p-4">ف</th>
                  <th className="text-center p-4">ت</th>
                  <th className="text-center p-4">خ</th>
                  <th className="text-center p-4">له</th>
                  <th className="text-center p-4">عليه</th>
                  <th className="text-center p-4">ف</th>
                  <th className="text-center p-4">النقاط</th>
                </tr>
              </thead>
              <tbody>
                {table.map((entry) => (
                  <tr
                    key={entry.team.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-4 font-bold">{entry.position}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <img
                          src={entry.team.crest || 'https://via.placeholder.com/30'}
                          alt={entry.team.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/30';
                          }}
                        />
                        <span>{entry.team.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">{entry.playedGames}</td>
                    <td className="p-4 text-center">{entry.won}</td>
                    <td className="p-4 text-center">{entry.draw}</td>
                    <td className="p-4 text-center">{entry.lost}</td>
                    <td className="p-4 text-center">{entry.goalsFor}</td>
                    <td className="p-4 text-center">{entry.goalsAgainst}</td>
                    <td className="p-4 text-center">{entry.goalDifference}</td>
                    <td className="p-4 text-center font-bold text-primary-600">{entry.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-4">
          {matchesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card skeleton h-32"></div>
              ))}
            </div>
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

