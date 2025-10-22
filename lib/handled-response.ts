export type HandledResponse<D,E = never> =
  | {
      data: D;
      error?: E;
    }
  | {
      data?: never;
      error?: E;
    };

export const ok = <D,E = never>(data: D): HandledResponse<D,E> => ({
  data,
});

export const err = <D,E = never>(error: E): HandledResponse<D,E> => ({
  error,
});