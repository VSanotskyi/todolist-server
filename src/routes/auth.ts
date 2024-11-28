import { Router, Request, Response } from 'express';

const route = Router();

route.post('/sign-up', (req: Request, res: Response) => {
  res.json({ message: 'sign-up' });
});

route.post('/sign-in', (req: Request, res: Response) => {
  res.json({ message: 'sign-in' });
});

route.get('/logout', (req: Request, res: Response) => {
  res.json({ message: 'logout' });
});

export { route };
