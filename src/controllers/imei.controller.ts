import { Response } from 'express';
import { AuthRequest } from '../types';
import { lookupService } from '../services/lookup';
import { prisma } from '../services/prisma';
import { generateServiceNumber } from '../utils/helpers';
import { NotFoundError } from '../utils/errors';
import { notificationService } from '../services/notification';

export class ImeiController {
  async search(req: AuthRequest, res: Response): Promise<void> {
    const { imei } = req.body;
    const ip = req.ip || req.socket.remoteAddress;
    const result = await lookupService.searchByImei(imei, req.user?.userId, ip);
    res.json({ success: true, data: result });
  }

  async getByImei(req: AuthRequest, res: Response): Promise<void> {
    const { imei } = req.params;
    const request = await prisma.serviceRequest.findFirst({
      where: { imei },
      orderBy: { createdAt: 'desc' },
    });
    if (!request) throw new NotFoundError('No record found for this IMEI');
    res.json({ success: true, data: request });
  }

  async submit(req: AuthRequest, res: Response): Promise<void> {
    const { imei, brand, model, country } = req.body;

    const existing = await prisma.serviceRequest.findFirst({
      where: { imei, status: { in: ['PENDING', 'PROCESSING'] } },
    });
    if (existing) {
      res.json({
        success: true,
        data: {
          message: 'Existing pending request found',
          serviceNumber: existing.serviceNumber,
          status: existing.status,
          duplicate: true,
        },
      });
      return;
    }

    const serviceNumber = generateServiceNumber();
    const request = await prisma.serviceRequest.create({
      data: {
        serviceNumber,
        imei,
        brand,
        model,
        country,
        status: 'PENDING',
        submittedBy: req.user?.userId,
        source: 'MANUAL',
      },
    });

    if (req.user?.userId) {
      await notificationService.create(
        req.user.userId,
        'Service Request Created',
        `Service request ${serviceNumber} has been submitted for IMEI ${imei}`,
        'success',
        `/dashboard/requests/${request.id}`
      );
    }

    res.status(201).json({ success: true, data: request });
  }

  async getStatus(req: AuthRequest, res: Response): Promise<void> {
    const { imei } = req.params;
    const request = await prisma.serviceRequest.findFirst({
      where: { imei },
      orderBy: { createdAt: 'desc' },
    });
    if (!request) throw new NotFoundError('No service request found for this IMEI');
    res.json({ success: true, data: request });
  }

  async getMyRequests(req: AuthRequest, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const [data, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        where: { submittedBy: req.user?.userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.serviceRequest.count({ where: { submittedBy: req.user?.userId } }),
    ]);

    res.json({
      success: true,
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }
}

export const imeiController = new ImeiController();
