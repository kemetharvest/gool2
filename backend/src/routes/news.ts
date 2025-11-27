import { Router, Request, Response } from 'express';
import { apiService } from '../services/apiService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const news = await apiService.getNews();
    res.json({ success: true, data: news });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const article = await apiService.getNewsById(id);
    
    if (!article) {
      return res.status(404).json({ success: false, error: 'News article not found' });
    }
    
    res.json({ success: true, data: article });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

