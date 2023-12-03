import JobList from '../components/JobList';
import PaginationBar from '../components/PaginationBar';
import { useJobs } from '../lib/graphql/hooks';
import { useCallback, useState } from 'react';
import { ApiPagination, SortDirection } from '../types/common';

const INITIAL_PAGINATION: ApiPagination = {
  limit: 10,
  page: 1
}

function HomePage() {
  const [sort, setSort] = useState<SortDirection>(SortDirection.desc);
  const [{ limit, page }, setPagination] = useState(INITIAL_PAGINATION)
  const { jobs, totalCount } = useJobs({ sort, limit, page: page - 1 });
  const maxPage = Math.ceil(totalCount / limit);

  const changeSort = () => {
    setSort(prevSort => 
      prevSort === SortDirection.asc ? SortDirection.desc : SortDirection.asc
    )
    setPagination(INITIAL_PAGINATION);
  }

  const handlePageChange = useCallback((page: number) => setPagination(prev => ({...prev, page })),[]);

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <PaginationBar totalPages={maxPage} currentPage={page} onPageChange={handlePageChange}/> 
      <button className="button" onClick={changeSort}>Current order: {sort}</button>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
