import { FieldPolicy } from '@apollo/client';
import { SearchSearchResponse } from '../../gen';
type ExistingSearchPagination = SearchSearchResponse | null;
type ResultSearchPagination = SearchSearchResponse | null;
type SearchFieldPolicy = FieldPolicy<ExistingSearchPagination, ResultSearchPagination, ResultSearchPagination>;
export declare function searchPagination(): SearchFieldPolicy;
export {};
