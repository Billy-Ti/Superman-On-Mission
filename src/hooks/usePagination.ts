import { useState } from 'react';

function usePagination<T>(data: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }


  function jumpToPage(pageNumber: number): void {
    setCurrentPage(pageNumber);
  }

  return { jumpToPage, currentData, currentPage, maxPage };
}

export default usePagination;
