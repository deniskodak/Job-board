import { User } from "./auth.interface";

export interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export interface LoginPageProps {
    onLogin: (user: User | null) => void;
}

export interface ApiPagination {
    limit: number;
    page: number
}

export enum SortDirection {
    asc = 'asc',
    desc = 'desc'
}