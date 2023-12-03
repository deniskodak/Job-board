import JobList from '../components/JobList';
import PaginationBar from '../components/PaginationBar';
import { useJobs } from '../lib/graphql/hooks';
import { useCallback, useState } from 'react';

const SORT_DIRECTIONS = {
  asc: 'asc',
  desc: 'desc'
}

const INITIAL_PAGINATION = {
  limit: 10,
  page: 1
}

function HomePage() {
  const [sort, setSort] = useState(SORT_DIRECTIONS.desc);
  const [{ limit, page }, setPagination] = useState(INITIAL_PAGINATION)
  const { jobs, totalCount } = useJobs({ sort, limit, page: page - 1 });
  const maxPage = Math.ceil(totalCount / limit);

  const changeSort = () => {
    setSort(prevSort => 
      prevSort === SORT_DIRECTIONS.asc ? SORT_DIRECTIONS.desc : SORT_DIRECTIONS.asc
    )
    setPagination(INITIAL_PAGINATION);
  }

  const handlePageChange = useCallback((page) => setPagination(prev => ({...prev, page })),[]);

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
