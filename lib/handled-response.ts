export type HandledResponse<D, E = D> =
  | {
      readonly data: D;
      readonly error: never;
    }
  | {
      readonly data: never;
      readonly error: E;
    };

export const ok = <D, E = D>(data: D): HandledResponse<D, E> => ({
  data,
  error: undefined as never,
});

export const err = <D, E = D>(error: E): HandledResponse<D, E> => ({
  data: undefined as never,
  error,
});