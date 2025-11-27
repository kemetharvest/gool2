import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiService, Match } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import LineupPitch from '../components/LineupPitch';
import EventsTimeline from '../components/EventsTimeline';

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const matchId = parseInt(id || '0', 10);
  const [activeTab, setActiveTab] = useState<'overview' | 'lineups' | 'events'>('overview');

  const { data: match, isLoading: matchLoading } = useQuery<Match>({
    queryKey: ['match', matchId],
    queryFn: () => apiService.getMatch(matchId),
    enabled: !!matchId,
  });

  const { data: lineups, isLoading: lineupsLoading } = useQuery({
    queryKey: ['match-lineups', matchId],
    queryFn: () => apiService.getMatchLineups(matchId),
    enabled: !!matchId && activeTab === 'lineups',
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['match-events', matchId],
    queryFn: () => apiService.getMatchEvents(matchId),
    enabled: !!matchId && activeTab === 'events',
  });

  // Real-time updates
  const { lastMessage } = useWebSocket(undefined, (message) => {
    if (message.type === 'match_update' && message.matchId === matchId) {
      // Refetch match data
      window.location.reload(); // Simple approach, could be optimized
    }
  });

  if (matchLoading) {
    return (
      <div className="text-center py-12">
        <div className="skeleton h-64 w-full mb-4"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">المباراة غير موجودة</p>
      </div>
    );
  }

  const isLive = match.status === 'LIVE';

  return (
    <div>
      {/* Match Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 text-center">
            <img
              src={match.homeTeam.crest || 'https://via.placeholder.com/100'}
              alt={match.homeTeam.name}
              className="w-24 h-24 mx-auto mb-4 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
              }}
            />
            <h2 className="text-2xl font-bold">{match.homeTeam.name}</h2>
          </div>

          <div className="flex flex-col items-center mx-8">
            {isLive && <span className="live-badge mb-4">مباشر</span>}
            <div className="flex items-center space-x-6 space-x-reverse">
              <motion.span
                key={match.score.fullTime.home}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="text-6xl font-bold"
              >
                {match.score.fullTime.home ?? '-'}
              </motion.span>
              <span className="text-4xl text-gray-400">-</span>
              <motion.span
                key={match.score.fullTime.away}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="text-6xl font-bold"
              >
                {match.score.fullTime.away ?? '-'}
              </motion.span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{match.competition.name}</p>
          </div>

          <div className="flex-1 text-center">
            <img
              src={match.awayTeam.crest || 'https://via.placeholder.com/100'}
              alt={match.awayTeam.name}
              className="w-24 h-24 mx-auto mb-4 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
              }}
            />
            <h2 className="text-2xl font-bold">{match.awayTeam.name}</h2>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center mb-8 space-x-2 space-x-reverse">
        {[
          { key: 'overview', label: 'المحتوى + البث' },
          { key: 'lineups', label: 'التشكيلة' },
          { key: 'events', label: 'أحداث المباراة' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">معلومات المباراة</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><span className="font-semibold">التاريخ:</span> {new Date(match.utcDate).toLocaleString('ar-SA')}</p>
              <p><span className="font-semibold">الحالة:</span> {match.status}</p>
              <p><span className="font-semibold">الدوري:</span> {match.competition.name}</p>
              {match.score.halfTime.home !== null && (
                <p>
                  <span className="font-semibold">نتيجة الشوط الأول:</span>{' '}
                  {match.score.halfTime.home} - {match.score.halfTime.away}
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'lineups' && (
          <div>
            {lineupsLoading ? (
              <div className="skeleton h-96"></div>
            ) : lineups ? (
              <LineupPitch home={lineups.home} away={lineups.away} />
            ) : (
              <p className="text-center text-gray-500 py-8">التشكيلة غير متاحة</p>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-20"></div>
                ))}
              </div>
            ) : (
              <EventsTimeline events={events} />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

