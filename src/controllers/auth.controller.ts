import { Request, Response } from 'express';
import { authService } from '../services/auth';
import { AuthRequest } from '../types';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    res.status(201).json({ success: true, ...result });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, ...result });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, error: 'Refresh token required' });
      return;
    }
    const result = await authService.refresh(refreshToken);
    res.json({ success: true, ...result });
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    await authService.logout(req.user!.userId);
    res.json({ success: true, message: 'Logged out' });
  }

  async profile(req: AuthRequest, res: Response): Promise<void> {
    const user = await authService.getProfile(req.user!.userId);
    res.json({ success: true, data: user });
  }
}

export const authController = new AuthController();
