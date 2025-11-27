import { motion } from 'framer-motion';
import { Lineup } from '../services/api';

interface LineupPitchProps {
  home: Lineup;
  away: Lineup;
}

const positions: Record<string, { x: number; y: number }> = {
  GK: { x: 50, y: 5 },
  DF: { x: 50, y: 25 },
  MF: { x: 50, y: 50 },
  FW: { x: 50, y: 75 },
  SUB: { x: 50, y: 95 },
};

export default function LineupPitch({ home, away }: LineupPitchProps) {
  const getPlayerPosition = (position: string, index: number, total: number) => {
    const basePos = positions[position] || positions.MF;
    const spread = total > 1 ? (index - (total - 1) / 2) * 15 : 0;
    return {
      x: basePos.x + spread,
      y: basePos.y,
    };
  };

  const homePlayers = home.startXI;
  const awayPlayers = away.startXI;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-green-600 rounded-lg overflow-hidden" style={{ aspectRatio: '2/3', minHeight: '600px' }}>
        {/* Field markings */}
        <div className="absolute inset-0 border-4 border-white opacity-30">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white rounded-full opacity-30"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-white opacity-30 rounded-b-full"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-white opacity-30 rounded-t-full"></div>
        </div>

        {/* Away Team (Top) */}
        <div className="absolute top-4 left-0 right-0">
          <h3 className="text-center text-white font-bold mb-2">{away.team.name}</h3>
          <div className="flex justify-center flex-wrap gap-2">
            {awayPlayers.map((item, index) => {
              const pos = getPlayerPosition(item.player.position, index, awayPlayers.length);
              return (
                <motion.div
                  key={item.player.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold text-gray-800 shadow-lg">
                    {item.player.shirtNumber}
                  </div>
                  <p className="text-xs text-white text-center mt-1 w-16 truncate">{item.player.name}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Home Team (Bottom) */}
        <div className="absolute bottom-4 left-0 right-0">
          <h3 className="text-center text-white font-bold mb-2">{home.team.name}</h3>
          <div className="flex justify-center flex-wrap gap-2">
            {homePlayers.map((item, index) => {
              const pos = getPlayerPosition(item.player.position, index, homePlayers.length);
              return (
                <motion.div
                  key={item.player.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute"
                  style={{
                    left: `${pos.x}%`,
                    top: `${100 - pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold text-gray-800 shadow-lg">
                    {item.player.shirtNumber}
                  </div>
                  <p className="text-xs text-white text-center mt-1 w-16 truncate">{item.player.name}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Formation Info */}
      <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span className="font-semibold">{home.team.name}:</span> {home.formation}
        </div>
        <div>
          <span className="font-semibold">{away.team.name}:</span> {away.formation}
        </div>
      </div>
    </div>
  );
}

