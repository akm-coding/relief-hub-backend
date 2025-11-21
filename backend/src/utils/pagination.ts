import { Request } from "express";

// Defines the shape of the pagination query
export interface PaginationParams {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

/**
 * Parses pagination query parameters from the request.
 * @param req Express Request object
 * @returns PaginationParams object
 */
export const getPaginationParams = (req: Request): PaginationParams => {
  const defaultLimit = 10;
  const maxLimit = 100;

  // Parse 'page' and 'limit' from query, default to 1 and defaultLimit
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  let limit = parseInt(req.query.limit as string) || defaultLimit;

  // Ensure limit is within a reasonable range
  limit = Math.min(maxLimit, Math.max(1, limit));

  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
};

/**
 * Creates the metadata object for a paginated response.
 * @param totalCount Total number of records
 * @param params Pagination parameters
 * @returns Metadata object
 */
export const createPaginationMeta = (
  totalCount: number,
  params: PaginationParams
) => {
  const { page, limit } = params;
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    totalItems: totalCount,
    totalPages: totalPages,
    currentPage: page,
    itemsPerPage: limit,
    hasNextPage,
    hasPrevPage,
  };
};
