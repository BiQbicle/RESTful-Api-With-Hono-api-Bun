export const ERROR_CODES = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    NOT_FOUND: "NOT_FOUND",
    DATABASE_ERROR: "DATABASE_ERROR",
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
  } as const;
  
  export type Err = {
    code: string;
    message: string;
    detail?: string;
  };
  
  type Success<T> = { data: T; error?: undefined };
  type Failure<E> = { data?: undefined; error: E };
  export type Result<T, E = Err> = Success<T> | Failure<E>;
  
  export async function tryCatch<T>(
    promise: Promise<T>,
    err: Err
  ): Promise<Result<T, Err>> {
    try {
      const data = await promise;
      return { data };
    } catch {
      return { error: err };
    }
  }
  