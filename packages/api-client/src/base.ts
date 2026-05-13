import axios, { AxiosInstance, AxiosError } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  tenantId: string;
  token?: string;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
  path?: string;
}

export class BaseApiClient {
  protected client: AxiosInstance;
  protected config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': config.tenantId,
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use((cfg) => {
      if (this.config.token) {
        cfg.headers.Authorization = `Bearer ${this.config.token}`;
      }
      return cfg;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        throw this.handleError(error);
      }
    );
  }

  protected handleError(error: AxiosError<ApiError>): Error {
    if (error.response?.data) {
      const apiError = error.response.data;
      const message = apiError.message || 'An error occurred';
      const err = new Error(message) as any;
      err.statusCode = apiError.statusCode;
      err.errors = apiError.errors;
      return err;
    }

    return error;
  }

  setToken(token: string): void {
    this.config.token = token;
  }

  clearToken(): void {
    this.config.token = undefined;
  }

  setTenantId(tenantId: string): void {
    this.config.tenantId = tenantId;
    this.client.defaults.headers['X-Tenant-ID'] = tenantId;
  }

  protected async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(path, { params });
    return response.data;
  }

  protected async post<T>(path: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(path, data);
    return response.data;
  }

  protected async put<T>(path: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(path, data);
    return response.data;
  }

  protected async delete<T>(path: string): Promise<T> {
    const response = await this.client.delete<T>(path);
    return response.data;
  }
}
