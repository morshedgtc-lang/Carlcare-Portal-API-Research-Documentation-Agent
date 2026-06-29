import crypto from 'crypto';
import { config } from '../config';
import { CarlcareImeiResponse } from '../types';
import { AppError } from '../utils/errors';

class CarlcareService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.carlcare.baseUrl;
  }

  private generateSign(params: Record<string, string>): string {
    const sorted = Object.keys(params).sort();
    const str = sorted.map((k) => `${k}=${params[k]}`).join('&');
    return crypto.createHash('md5').update(str).digest('hex');
  }

  async lookupImei(imei: string, token?: string): Promise<CarlcareImeiResponse> {
    const timeStamp = Date.now().toString();
    const sign = this.generateSign({ imei, timeStamp });

    const url = `${this.baseUrl}/unlock-phone/imei-info?sign=${sign}&timeStamp=${timeStamp}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new AppError(response.status, `Carlcare API error: ${response.statusText}`);
    }

    return response.json() as Promise<CarlcareImeiResponse>;
  }

  async submitAppeal(data: {
    imei: string;
    serviceNumber?: string;
    country?: string;
    token?: string;
  }): Promise<CarlcareImeiResponse> {
    const url = `${this.baseUrl}/unlock-phone/commit`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (data.token) {
      headers['Authorization'] = `Bearer ${data.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        imei: data.imei,
        serviceNumber: data.serviceNumber,
        country: data.country,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new AppError(response.status, `Carlcare submit error: ${response.statusText}`);
    }

    return response.json() as Promise<CarlcareImeiResponse>;
  }
}

export const carlcareService = new CarlcareService();
