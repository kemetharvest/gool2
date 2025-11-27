import { Router, Request, Response } from 'express';
import { apiService } from '../services/apiService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const teams = await apiService.getTeams();
    res.json({ success: true, data: teams });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const team = await apiService.getTeamById(id);
    
    if (!team) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    
    res.json({ success: true, data: team });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id/matches', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const matches = await apiService.getTeamMatches(id);
    res.json({ success: true, data: matches });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

