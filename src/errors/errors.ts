export class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>,
  ) {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} not found` : resource,
      'NOT_FOUND',
      404,
      id ? { resource, id } : undefined,
    )
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details)
  }
}

export class VncConnectionError extends ApplicationError {
  constructor(
    message: string,
    public url: string,
    options?: { cause?: unknown },
  ) {
    super(message, 'VNC_CONNECTION_ERROR', 502, { url })
    if (options?.cause) this.cause = options.cause
  }
}

export class VncDisconnectedError extends ApplicationError {
  constructor(message: string = 'VNC session ended unexpectedly') {
    super(message, 'VNC_DISCONNECTED', 503)
  }
}
