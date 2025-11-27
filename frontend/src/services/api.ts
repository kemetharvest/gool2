import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

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

export const apiService = {
  getMatches: async (day: 'yesterday' | 'today' | 'tomorrow'): Promise<Match[]> => {
    const { data } = await api.get(`/matches?day=${day}`);
    return data.data;
  },

  getMatch: async (id: number): Promise<Match> => {
    const { data } = await api.get(`/matches/${id}`);
    return data.data;
  },

  getMatchEvents: async (id: number): Promise<MatchEvent[]> => {
    const { data } = await api.get(`/matches/${id}/events`);
    return data.data;
  },

  getMatchLineups: async (id: number): Promise<{ home: Lineup; away: Lineup }> => {
    const { data } = await api.get(`/matches/${id}/lineups`);
    return data.data;
  },

  getLeagues: async (): Promise<League[]> => {
    const { data } = await api.get('/leagues');
    return data.data;
  },

  getLeague: async (id: number): Promise<League> => {
    const { data } = await api.get(`/leagues/${id}`);
    return data.data;
  },

  getLeagueTable: async (id: number): Promise<TableEntry[]> => {
    const { data } = await api.get(`/leagues/${id}/table`);
    return data.data;
  },

  getLeagueMatches: async (id: number): Promise<Match[]> => {
    const { data } = await api.get(`/leagues/${id}/matches`);
    return data.data;
  },

  getTeams: async (): Promise<Team[]> => {
    const { data } = await api.get('/teams');
    return data.data;
  },

  getTeam: async (id: number): Promise<Team> => {
    const { data } = await api.get(`/teams/${id}`);
    return data.data;
  },

  getTeamMatches: async (id: number): Promise<Match[]> => {
    const { data } = await api.get(`/teams/${id}/matches`);
    return data.data;
  },

  getNews: async (): Promise<News[]> => {
    const { data } = await api.get('/news');
    return data.data;
  },

  getNewsArticle: async (id: string): Promise<News> => {
    const { data } = await api.get(`/news/${id}`);
    return data.data;
  },
};

