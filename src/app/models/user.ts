export interface User {
        id: string,
        name: string,
        email: string,
        role: string
}
export interface PaginatedUsers {
  data: User[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}