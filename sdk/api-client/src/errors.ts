export class OpenRiskOSError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'OpenRiskOSError';
  }
}

export class AuthenticationError extends OpenRiskOSError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends OpenRiskOSError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'AUTHZ_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends OpenRiskOSError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends OpenRiskOSError {
  constructor(message: string, public errors?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NetworkError extends OpenRiskOSError {
  constructor(message: string = 'Network error') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends OpenRiskOSError {
  constructor(message: string = 'Request timeout') {
    super(message, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}
