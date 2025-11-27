import { Router, Request, Response } from 'express';
import { apiService } from '../services/apiService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const leagues = await apiService.getLeagues();
    res.json({ success: true, data: leagues });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const league = await apiService.getLeagueById(id);
    
    if (!league) {
      return res.status(404).json({ success: false, error: 'League not found' });
    }
    
    res.json({ success: true, data: league });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id/table', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const table = await apiService.getLeagueTable(id);
    res.json({ success: true, data: table });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id/matches', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const matches = await apiService.getLeagueMatches(id);
    res.json({ success: true, data: matches });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

