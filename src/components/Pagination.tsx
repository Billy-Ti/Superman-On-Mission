import { showAlert } from "../utils/showAlert";

interface PaginationProps {
  tasksPerPage: number;
  totalTasks: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
  className?: string;
}
const Pagination: React.FC<PaginationProps> = ({
  tasksPerPage,
  totalTasks,
  paginate,
  currentPage,
  className = "",
}) => {
  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  const pageNumbers = [];
  let startPage = currentPage - 1 <= 0 ? 1 : currentPage - 1;

  // 設定當前頁為 1 或 2 的情況
  if (currentPage <= 2) {
    startPage = 1;
  } else if (currentPage > 2 && currentPage < totalPages) {
    // 如果當前頁碼在中間時，保證左邊有一個頁碼，右邊有兩個頁碼 (含 Next)
    startPage = currentPage - 1;
  } else if (currentPage === totalPages) {
    // 處理當前頁碼為最後一頁的情況
    startPage = totalPages - 2 <= 0 ? 1 : totalPages - 2;
  }

  for (let i = startPage; i <= Math.min(startPage + 2, totalPages); i++) {
    pageNumbers.push(i);
  }

  const handlePreviousPageButton = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    } else {
      showAlert("🔊Hi 已經是第一頁囉", "", "info");
    }
  };
  const handleNextPageButton = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    } else {
      showAlert("🙈已經是最後一頁囉", "", "info");
    }
  };

  return (
    <div className={`flex ${className}`}>
      <nav className="flex space-x-2" aria-label="Pagination">
        <a
          onClick={handlePreviousPageButton}
          className="cursor-pointer rounded-md bg-gradient-to-r from-violet-300 to-indigo-300 px-4 py-2 text-white"
        >
          Previous
        </a>
        {pageNumbers.map((number) => (
          <a
            key={number}
            onClick={() => paginate(number)}
            className={`cursor-pointer rounded-md px-4 py-2 ${
              currentPage === number
                ? "bg-fuchsia-200"
                : "bg-white text-gray-700"
            }`}
          >
            {number}
          </a>
        ))}
        <a
          onClick={handleNextPageButton}
          className="cursor-pointer rounded-md bg-gradient-to-r from-violet-300 to-indigo-300 px-4 py-2 text-white"
        >
          Next
        </a>
      </nav>
    </div>
  );
};
export default Pagination;
