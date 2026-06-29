import { v4 as uuidv4 } from 'uuid';

export function generateServiceNumber(): string {
  const prefix = 'SRV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().slice(0, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function sanitizeImei(imei: string): string {
  return imei.replace(/\D/g, '').slice(0, 15);
}
