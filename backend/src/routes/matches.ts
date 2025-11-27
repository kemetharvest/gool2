import { Router, Request, Response } from 'express';
import { apiService } from '../services/apiService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const day = (req.query.day as 'yesterday' | 'today' | 'tomorrow') || 'today';
    const matches = await apiService.getMatches(day);
    res.json({ success: true, data: matches });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const match = await apiService.getMatchById(id);
    
    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }
    
    res.json({ success: true, data: match });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id/events', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const events = await apiService.getMatchEvents(id);
    res.json({ success: true, data: events });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id/lineups', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const lineups = await apiService.getMatchLineups(id);
    
    if (!lineups) {
      return res.status(404).json({ success: false, error: 'Lineups not found' });
    }
    
    res.json({ success: true, data: lineups });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

