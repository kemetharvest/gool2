import { motion } from 'framer-motion';
import { MatchEvent } from '../services/api';
import { Goal, AlertCircle, UserX } from 'lucide-react';

interface EventsTimelineProps {
  events: MatchEvent[];
}

export default function EventsTimeline({ events }: EventsTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'GOAL':
        return <Goal className="w-5 h-5 text-green-500" />;
      case 'YELLOW_CARD':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'RED_CARD':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'SUBSTITUTION':
        return <UserX className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getEventText = (event: MatchEvent) => {
    switch (event.type) {
      case 'GOAL':
        return `هدف - ${event.player?.name || 'لاعب'}${event.assist ? ` (تمريرة حاسمة: ${event.assist.name})` : ''}`;
      case 'YELLOW_CARD':
        return `بطاقة صفراء - ${event.player?.name || 'لاعب'}`;
      case 'RED_CARD':
        return `بطاقة حمراء - ${event.player?.name || 'لاعب'}`;
      case 'SUBSTITUTION':
        return `تبديل - ${event.player?.name || 'لاعب'}`;
      default:
        return `${event.type} - ${event.player?.name || 'لاعب'}`;
    }
  };

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">لا توجد أحداث حتى الآن</p>
      ) : (
        events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex-shrink-0">
              {getEventIcon(event.type)}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{getEventText(event)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{event.team.name}</p>
            </div>
            <div className="flex-shrink-0">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {event.minute}'
              </span>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

