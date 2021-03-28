export class paginatedData<T> {
    currentPage:number; 
    totalPages:number; 
    pageSize:number; 
    data:T[]; 
    totalCount:number;
    hasPrevious:boolean;
    hasNext:boolean;
}