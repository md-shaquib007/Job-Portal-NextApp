export type ControllerSuccess<T> = { ok: true; status: number; data: T };
export type ControllerFailure = {
  ok: false;
  status: number;
  error?: string;
  message?: string;
  errors?: Record<string, string[]>;
};
export type ControllerResult<T> = ControllerSuccess<T> | ControllerFailure;
