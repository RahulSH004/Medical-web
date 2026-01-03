export interface Test {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: string;
    category: string;
}

export interface PaginatedTestsResponse {
    data: Test[];
    pagination: {
        currentPage: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

