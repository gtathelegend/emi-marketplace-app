export interface HealthStatus {
  status: 'healthy';
  timestamp: string;
  uptimeSeconds: number;
}

export class HealthService {
  public getHealth(): HealthStatus {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}

export const healthService = new HealthService();
