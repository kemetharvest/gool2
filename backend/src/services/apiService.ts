import axios, { AxiosInstance } from 'axios';
import { config } from '../config';

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime: {
      home: number | null;
      away: number | null;
    };
  };
  competition: {
    id: number;
    name: string;
    code: string;
    emblem: string;
  };
}

export interface MatchEvent {
  id: number;
  type: string;
  minute: number;
  team: {
    id: number;
    name: string;
  };
  player: {
    id: number;
    name: string;
  } | null;
  assist: {
    id: number;
    name: string;
  } | null;
}

export interface Lineup {
  team: {
    id: number;
    name: string;
    formation: string;
  };
  coach: {
    id: number;
    name: string;
  };
  formation: string;
  startXI: Array<{
    player: {
      id: number;
      name: string;
      position: string;
      shirtNumber: number;
    };
  }>;
  substitutes: Array<{
    player: {
      id: number;
      name: string;
      position: string;
      shirtNumber: number;
    };
  }>;
}

export interface League {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
  area: {
    name: string;
    code: string;
  };
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
}

export interface TableEntry {
  position: number;
  team: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface News {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  publishedAt: string;
  source: string;
}

class ApiService {
  private client: AxiosInstance;
  private matchCache: Map<number, Match> = new Map();
  private lastPollTime: number = 0;

  constructor() {
    this.client = axios.create({
      baseURL: config.externalApiUrl,
      headers: {
        'X-Auth-Token': config.externalApiKey,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  // Mock data generator for development
  private generateMockMatches(day: 'yesterday' | 'today' | 'tomorrow'): Match[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let date: Date;
    if (day === 'yesterday') {
      date = new Date(today);
      date.setDate(date.getDate() - 1);
    } else if (day === 'tomorrow') {
      date = new Date(today);
      date.setDate(date.getDate() + 1);
    } else {
      date = today;
    }

    const teams = [
      { id: 1, name: 'النصر', shortName: 'النصر', crest: 'https://via.placeholder.com/100' },
      { id: 2, name: 'الهلال', shortName: 'الهلال', crest: 'https://via.placeholder.com/100' },
      { id: 3, name: 'الاتحاد', shortName: 'الاتحاد', crest: 'https://via.placeholder.com/100' },
      { id: 4, name: 'الشباب', shortName: 'الشباب', crest: 'https://via.placeholder.com/100' },
      { id: 5, name: 'الأهلي', shortName: 'الأهلي', crest: 'https://via.placeholder.com/100' },
      { id: 6, name: 'التعاون', shortName: 'التعاون', crest: 'https://via.placeholder.com/100' },
    ];

    const competitions = [
      { id: 1, name: 'الدوري السعودي', code: 'SAU', emblem: 'https://via.placeholder.com/50' },
      { id: 2, name: 'دوري أبطال أوروبا', code: 'CL', emblem: 'https://via.placeholder.com/50' },
    ];

    const matches: Match[] = [];
    for (let i = 0; i < 6; i++) {
      const homeTeam = teams[Math.floor(Math.random() * teams.length)];
      const awayTeam = teams[Math.floor(Math.random() * teams.length)];
      if (homeTeam.id === awayTeam.id) continue;

      const matchDate = new Date(date);
      matchDate.setHours(15 + i * 2, 0, 0, 0);

      const status = day === 'today' && i < 2 ? 'LIVE' : day === 'today' ? 'FINISHED' : 'SCHEDULED';
      const homeScore = status === 'LIVE' || status === 'FINISHED' ? Math.floor(Math.random() * 4) : null;
      const awayScore = status === 'LIVE' || status === 'FINISHED' ? Math.floor(Math.random() * 4) : null;

      matches.push({
        id: 1000 + i,
        utcDate: matchDate.toISOString(),
        status,
        matchday: 1,
        homeTeam,
        awayTeam,
        score: {
          fullTime: { home: homeScore, away: awayScore },
          halfTime: { home: homeScore !== null ? Math.floor(homeScore / 2) : null, away: awayScore !== null ? Math.floor(awayScore / 2) : null },
        },
        competition: competitions[Math.floor(Math.random() * competitions.length)],
      });
    }

    return matches;
  }

  async getMatches(day: 'yesterday' | 'today' | 'tomorrow'): Promise<Match[]> {
    try {
      // In production, use real API
      // const response = await this.client.get('/matches', { params: { dateFrom, dateTo } });
      // return response.data.matches;
      
      // For now, return mock data
      return this.generateMockMatches(day);
    } catch (error) {
      console.error('Error fetching matches:', error);
      return this.generateMockMatches(day);
    }
  }

  async getMatchById(id: number): Promise<Match | null> {
    try {
      // const response = await this.client.get(`/matches/${id}`);
      // return response.data;
      
      const matches = await this.getMatches('today');
      return matches.find(m => m.id === id) || null;
    } catch (error) {
      console.error('Error fetching match:', error);
      return null;
    }
  }

  async getMatchEvents(matchId: number): Promise<MatchEvent[]> {
    try {
      // const response = await this.client.get(`/matches/${matchId}/events`);
      // return response.data;
      
      // Mock events
      return [
        { id: 1, type: 'GOAL', minute: 15, team: { id: 1, name: 'النصر' }, player: { id: 1, name: 'كريم بنزيما' }, assist: null },
        { id: 2, type: 'YELLOW_CARD', minute: 23, team: { id: 2, name: 'الهلال' }, player: { id: 2, name: 'محمد السهلاوي' }, assist: null },
        { id: 3, type: 'GOAL', minute: 45, team: { id: 2, name: 'الهلال' }, player: { id: 3, name: 'سالم الدوسري' }, assist: { id: 4, name: 'عبدالله عطيف' } },
      ];
    } catch (error) {
      console.error('Error fetching match events:', error);
      return [];
    }
  }

  async getMatchLineups(matchId: number): Promise<{ home: Lineup; away: Lineup } | null> {
    try {
      // const response = await this.client.get(`/matches/${matchId}/lineups`);
      // return response.data;
      
      // Mock lineups
      const players = Array.from({ length: 11 }, (_, i) => ({
        player: {
          id: i + 1,
          name: `لاعب ${i + 1}`,
          position: ['GK', 'DF', 'DF', 'DF', 'DF', 'MF', 'MF', 'MF', 'MF', 'FW', 'FW'][i],
          shirtNumber: i + 1,
        },
      }));

      return {
        home: {
          team: { id: 1, name: 'النصر', formation: '4-3-3' },
          coach: { id: 1, name: 'لويس كاسترو' },
          formation: '4-3-3',
          startXI: players,
          substitutes: Array.from({ length: 7 }, (_, i) => ({
            player: {
              id: 20 + i,
              name: `بديل ${i + 1}`,
              position: 'SUB',
              shirtNumber: 20 + i,
            },
          })),
        },
        away: {
          team: { id: 2, name: 'الهلال', formation: '4-4-2' },
          coach: { id: 2, name: 'خورخي خيسوس' },
          formation: '4-4-2',
          startXI: players.map((p, i) => ({ ...p, player: { ...p.player, id: p.player.id + 100 } })),
          substitutes: Array.from({ length: 7 }, (_, i) => ({
            player: {
              id: 120 + i,
              name: `بديل ${i + 1}`,
              position: 'SUB',
              shirtNumber: 20 + i,
            },
          })),
        },
      };
    } catch (error) {
      console.error('Error fetching lineups:', error);
      return null;
    }
  }

  async getLeagues(): Promise<League[]> {
    try {
      // const response = await this.client.get('/competitions');
      // return response.data.competitions;
      
      return [
        { id: 1, name: 'الدوري السعودي', code: 'SAU', type: 'LEAGUE', emblem: 'https://via.placeholder.com/100', area: { name: 'السعودية', code: 'SAU' } },
        { id: 2, name: 'دوري أبطال أوروبا', code: 'CL', type: 'CUP', emblem: 'https://via.placeholder.com/100', area: { name: 'أوروبا', code: 'EUR' } },
        { id: 3, name: 'الدوري الإنجليزي', code: 'PL', type: 'LEAGUE', emblem: 'https://via.placeholder.com/100', area: { name: 'إنجلترا', code: 'ENG' } },
        { id: 4, name: 'الدوري الإسباني', code: 'PD', type: 'LEAGUE', emblem: 'https://via.placeholder.com/100', area: { name: 'إسبانيا', code: 'ESP' } },
      ];
    } catch (error) {
      console.error('Error fetching leagues:', error);
      return [];
    }
  }

  async getLeagueById(id: number): Promise<League | null> {
    try {
      const leagues = await this.getLeagues();
      return leagues.find(l => l.id === id) || null;
    } catch (error) {
      console.error('Error fetching league:', error);
      return null;
    }
  }

  async getLeagueTable(leagueId: number): Promise<TableEntry[]> {
    try {
      // const response = await this.client.get(`/competitions/${leagueId}/standings`);
      // return response.data.standings[0].table;
      
      const teams = [
        'النصر', 'الهلال', 'الاتحاد', 'الشباب', 'الأهلي', 'التعاون', 'الفتح', 'الرائد',
        'الطائي', 'أبها', 'الخليج', 'الوحدة', 'النهضة', 'الرياض', 'الخالدية', 'الباطن',
      ];

      return teams.map((name, i) => ({
        position: i + 1,
        team: { id: i + 1, name, shortName: name.substring(0, 3), crest: 'https://via.placeholder.com/50' },
        playedGames: 15,
        won: 10 - Math.floor(i / 2),
        draw: 3,
        lost: 2 + Math.floor(i / 2),
        points: (10 - Math.floor(i / 2)) * 3 + 3,
        goalsFor: 25 - i,
        goalsAgainst: 10 + i,
        goalDifference: 15 - i * 2,
      }));
    } catch (error) {
      console.error('Error fetching league table:', error);
      return [];
    }
  }

  async getLeagueMatches(leagueId: number): Promise<Match[]> {
    try {
      return this.generateMockMatches('today');
    } catch (error) {
      console.error('Error fetching league matches:', error);
      return [];
    }
  }

  async getTeams(): Promise<Team[]> {
    try {
      const teams = [
        'النصر', 'الهلال', 'الاتحاد', 'الشباب', 'الأهلي', 'التعاون', 'الفتح', 'الرائد',
      ];

      return teams.map((name, i) => ({
        id: i + 1,
        name,
        shortName: name.substring(0, 3),
        tla: name.substring(0, 3).toUpperCase(),
        crest: 'https://via.placeholder.com/100',
        address: `عنوان ${name}`,
        website: `https://${name.toLowerCase()}.com`,
        founded: 1950 + i * 5,
        clubColors: i % 2 === 0 ? 'أصفر / أزرق' : 'أحمر / أبيض',
        venue: `ملعب ${name}`,
      }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }

  async getTeamById(id: number): Promise<Team | null> {
    try {
      const teams = await this.getTeams();
      return teams.find(t => t.id === id) || null;
    } catch (error) {
      console.error('Error fetching team:', error);
      return null;
    }
  }

  async getTeamMatches(teamId: number): Promise<Match[]> {
    try {
      return this.generateMockMatches('today');
    } catch (error) {
      console.error('Error fetching team matches:', error);
      return [];
    }
  }

  async getNews(): Promise<News[]> {
    try {
      return [
        {
          id: '1',
          title: 'النصر يتغلب على الهلال في ديربي الرياض',
          description: 'فاز النصر على الهلال بنتيجة 3-2 في مباراة مثيرة',
          content: 'شهدت مباراة ديربي الرياض بين النصر والهلال أحداثاً مثيرة...',
          image: 'https://via.placeholder.com/800x400',
          publishedAt: new Date().toISOString(),
          source: 'يالا جول',
        },
        {
          id: '2',
          title: 'الاتحاد يعلن عن تعاقد جديد',
          description: 'أعلن نادي الاتحاد عن تعاقده مع لاعب جديد',
          content: 'أعلن نادي الاتحاد اليوم عن تعاقده مع لاعب جديد...',
          image: 'https://via.placeholder.com/800x400',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          source: 'يالا جول',
        },
      ];
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async getNewsById(id: string): Promise<News | null> {
    try {
      const news = await this.getNews();
      return news.find(n => n.id === id) || null;
    } catch (error) {
      console.error('Error fetching news:', error);
      return null;
    }
  }

  // Polling method to detect changes
  async pollMatches(): Promise<Match[]> {
    const matches = await this.getMatches('today');
    const changes: Match[] = [];

    matches.forEach(match => {
      const cached = this.matchCache.get(match.id);
      if (!cached || JSON.stringify(cached.score) !== JSON.stringify(match.score) || cached.status !== match.status) {
        changes.push(match);
        this.matchCache.set(match.id, match);
      }
    });

    this.lastPollTime = Date.now();
    return changes;
  }
}

export const apiService = new ApiService();

