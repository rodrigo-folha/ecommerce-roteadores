export interface IPaginator<T> {
    total: number;
    page: number;
    pageSize: number;
    resultado: T[];
}
