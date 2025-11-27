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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-x-auto"
        >
          {tableLoading ? (
            <div className="skeleton h-96"></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-primary-600 dark:border-primary-500 bg-gradient-to-r from-primary-50 to-red-50 dark:from-primary-900/20 dark:to-red-900/20">
                    <th className="text-right p-4 font-black text-gray-900 dark:text-white">المركز</th>
                    <th className="text-right p-4 font-black text-gray-900 dark:text-white">الفريق</th>
                    <th className="text-center p-4 font-black text-gray-900 dark:text-white">ل</th>
                    <th className="text-center p-4 font-black text-gray-900 dark:text-white">ف</th>
                    <th className="text-center p-4 font-black text-gray-900 dark:text-white">ت</th>
                    <th className="text-center p-4 font-black text-gray-900 dark:text-white">خ</th>
                    <th className="text-center p-4 font-black text-gray-900 dark:text-white">له</th>
                    <th className="text-center p-4 font-black text-gray-900 dark:text-white">عليه</th>
                    <th className="text-center p-4 font-black text-gray-900 dark:text-white">ف</th>
                    <th className="text-center p-4 font-black text-primary-600 dark:text-primary-400">النقاط</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((entry, idx) => (
                    <motion.tr
                      key={entry.team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-red-50/50 dark:hover:from-primary-900/10 dark:hover:to-red-900/10 transition-all duration-200 ${
                        entry.position <= 3 ? 'bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10' : ''
                      }`}
                    >
                      <td className="p-4 font-black text-lg">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          entry.position === 1 ? 'bg-yellow-400 text-yellow-900' :
                          entry.position === 2 ? 'bg-gray-300 text-gray-900' :
                          entry.position === 3 ? 'bg-orange-400 text-orange-900' :
                          'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}>
                          {entry.position}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <motion.img
                            src={entry.team.crest || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.team.name)}&background=dc2626&color=fff&size=64`}
                            alt={entry.team.name}
                            className="w-10 h-10 object-contain bg-white dark:bg-gray-700 rounded-full p-1 shadow-md"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.team.name)}&background=dc2626&color=fff&size=64`;
                            }}
                          />
                          <span className="font-bold text-gray-900 dark:text-white">{entry.team.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-semibold">{entry.playedGames}</td>
                      <td className="p-4 text-center font-semibold text-green-600 dark:text-green-400">{entry.won}</td>
                      <td className="p-4 text-center font-semibold text-yellow-600 dark:text-yellow-400">{entry.draw}</td>
                      <td className="p-4 text-center font-semibold text-red-600 dark:text-red-400">{entry.lost}</td>
                      <td className="p-4 text-center font-semibold">{entry.goalsFor}</td>
                      <td className="p-4 text-center font-semibold">{entry.goalsAgainst}</td>
                      <td className={`p-4 text-center font-bold ${
                        entry.goalDifference > 0 ? 'text-green-600 dark:text-green-400' :
                        entry.goalDifference < 0 ? 'text-red-600 dark:text-red-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {entry.goalDifference > 0 ? '+' : ''}{entry.goalDifference}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block bg-gradient-to-r from-primary-600 to-red-600 text-white font-black text-lg px-4 py-2 rounded-lg shadow-lg">
                          {entry.points}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
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

