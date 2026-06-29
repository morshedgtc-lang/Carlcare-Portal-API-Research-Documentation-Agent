import { Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { NotFoundError } from '../utils/errors';
import { notificationService } from '../services/notification';

export class AdminController {
  async getDashboard(req: Request, res: Response): Promise<void> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalSearches,
      totalRequests,
      pendingRequests,
      approvedRequests,
      todaySearches,
      monthSearches,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.lookupLog.count(),
      prisma.serviceRequest.count(),
      prisma.serviceRequest.count({ where: { status: 'PENDING' } }),
      prisma.serviceRequest.count({ where: { status: 'APPROVED' } }),
      prisma.lookupLog.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.lookupLog.count({ where: { createdAt: { gte: monthStart } } }),
    ]);

    const recentRequests = await prisma.serviceRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { submittedByUser: { select: { id: true, email: true, name: true } } },
    });

    res.json({
      success: true,
      data: {
        stats: { totalUsers, totalSearches, totalRequests, pendingRequests, approvedRequests, todaySearches, monthSearches },
        recentRequests,
      },
    });
  }

  async getAllRequests(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const imei = req.query.imei as string;
    const search = req.query.search as string;

    const where: any = {};
    if (status) where.status = status;
    if (imei) where.imei = { contains: imei };
    if (search) {
      where.OR = [
        { imei: { contains: search } },
        { serviceNumber: { contains: search } },
        { brand: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { submittedByUser: { select: { id: true, email: true, name: true } } },
      }),
      prisma.serviceRequest.count({ where }),
    ]);

    res.json({
      success: true,
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }

  async updateRequest(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { status, note, adminNote } = req.body;

    const validStatuses = ['PENDING', 'PROCESSING', 'APPROVED', 'DISAPPROVED', 'CANCELLED'] as const;
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ success: false, error: `Invalid status` });
      return;
    }

    const requestId = parseInt(id as string);
    const existing = await prisma.serviceRequest.findUnique({ where: { id: requestId } });
    if (!existing) throw new NotFoundError('Service request not found');

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (note !== undefined) updateData.note = note;
    if (adminNote !== undefined) updateData.adminNote = adminNote;
    if (status && ['APPROVED', 'DISAPPROVED', 'CANCELLED'].includes(status)) {
      updateData.reviewTime = new Date();
    }

    const updated = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: updateData,
    });

    if (existing.submittedBy && status) {
      await notificationService.create(
        existing.submittedBy,
        'Request Status Updated',
        `Your request ${existing.serviceNumber} status changed to ${status}`,
        status === 'APPROVED' ? 'success' : status === 'DISAPPROVED' ? 'error' : 'info',
        `/dashboard/requests/${updated.id}`
      );
    }

    res.json({ success: true, data: updated });
  }

  async searchImei(req: Request, res: Response): Promise<void> {
    const { imei } = req.query;
    if (!imei) {
      res.status(400).json({ success: false, error: 'IMEI query parameter required' });
      return;
    }

    const requests = await prisma.serviceRequest.findMany({
      where: { imei: imei as string },
      orderBy: { createdAt: 'desc' },
      include: { submittedByUser: { select: { id: true, email: true, name: true } } },
    });

    res.json({ success: true, data: requests, count: requests.length });
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, createdAt: true,
          _count: { select: { serviceRequests: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    res.json({
      success: true,
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }

  async exportCsv(req: Request, res: Response): Promise<void> {
    const status = req.query.status as string;
    const where: any = {};
    if (status) where.status = status;

    const requests = await prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'ServiceNumber', 'IMEI', 'Brand', 'Model', 'Country',
      'Status', 'ApplicationTime', 'ReviewTime', 'Note', 'AdminNote', 'Source', 'CreatedAt',
    ];

    const csvRows = [headers.join(',')];
    for (const r of requests) {
      csvRows.push([
        r.serviceNumber, r.imei, r.brand || '', r.model || '', r.country || '',
        r.status, r.applicationTime?.toISOString() || '', r.reviewTime?.toISOString() || '',
        r.note || '', r.adminNote || '', r.source, r.createdAt.toISOString(),
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=service-requests-${Date.now()}.csv`);
    res.send(csvRows.join('\n'));
  }

  async getLogs(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const imei = req.query.imei as string;

    const where: any = {};
    if (imei) where.imei = { contains: imei };

    const [data, total] = await Promise.all([
      prisma.lookupLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lookupLog.count({ where }),
    ]);

    res.json({
      success: true,
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }

  async getChartData(req: Request, res: Response): Promise<void> {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.lookupLog.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMap: Record<string, number> = {};
    for (const log of logs) {
      const dateKey = log.createdAt.toISOString().slice(0, 10);
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + 1;
    }

    const labels: string[] = [];
    const values: number[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      labels.push(key);
      values.push(dailyMap[key] || 0);
    }

    res.json({ success: true, data: { labels, values } });
  }
}

export const adminController = new AdminController();
