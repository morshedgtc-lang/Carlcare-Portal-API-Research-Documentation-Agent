import { prisma } from './prisma';

export class NotificationService {
  async create(userId: number, title: string, message: string, type = 'info', link?: string) {
    return prisma.notification.create({
      data: { userId, title, message, type, link },
    });
  }

  async getUnread(userId: number) {
    return prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAll(userId: number, page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async markRead(id: number, userId: number) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllRead(userId: number) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}

export const notificationService = new NotificationService();
