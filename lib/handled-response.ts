export type HandledResponse<T> = {
    data: T;
    error: null;
} | {
    data: null;
    error: string;
}

export const ok = <T>(data: T): HandledResponse<T> => ({
    data,
    error: null
})

export const err = <T>(error: string): HandledResponse<T> => ({
    data: null,
    error
})