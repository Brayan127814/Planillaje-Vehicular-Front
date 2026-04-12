export interface PageResponseP<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // página actual
  first: boolean;
  last: boolean;
  empty: boolean;
}