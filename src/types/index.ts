import { Request } from 'express';

export interface AuthPayload {
  userId: number;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface CarlcareImeiResponse {
  code: number;
  message: string;
  desc: string;
  data: CarlcareImeiData | null;
  timestamp?: number;
  requestId?: string;
}

export interface CarlcareImeiData {
  imei?: string;
  service_number?: string;
  status?: string;
  application_time?: string;
  review_time?: string;
  note?: string;
  brand?: string;
  model?: string;
  country?: string;
}
