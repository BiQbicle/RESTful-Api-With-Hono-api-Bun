export enum ERROR_CODES {
  DATABASE_ERROR = 'DB_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT'
}

export interface ErrorResponse {
  message: string;
  code: ERROR_CODES;
  description?: string;
  detail?: string;
}

export type Result<T> = 
  | { data: T; error?: never }
  | { error: ErrorResponse; data?: never };

export async function tryCatch<T>(
  promise: Promise<T>, 
  errorConfig?: Partial<ErrorResponse>
): Promise<{ data?: T; error?: ErrorResponse }> {
  try {
    const data = await promise;
    return { data };
  } catch (err) {
    return { 
      error: {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: errorConfig?.code || ERROR_CODES.DATABASE_ERROR,
        description: errorConfig?.description,
        detail: errorConfig?.detail
      }
    };
  }
}