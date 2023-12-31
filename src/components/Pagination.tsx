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

  if (currentPage <= 2) {
    startPage = 1;
  } else if (currentPage > 2 && currentPage < totalPages) {
    startPage = currentPage - 1;
  } else if (currentPage === totalPages) {
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
    <div className={`mb-4 flex justify-center lg:justify-end ${className}`}>
      <nav className="flex space-x-2" aria-label="Pagination">
        <button
          type="button"
          onClick={handlePreviousPageButton}
          className="cursor-pointer rounded-md bg-[#368DCF] px-4 py-2 font-medium text-white transition duration-500 ease-in-out hover:bg-[#2b79b4]"
        >
          上一頁
        </button>
        {pageNumbers.map((number) => (
          <button
            type="button"
            key={number}
            onClick={() => paginate(number)}
            className={`cursor-pointer rounded-md px-4 py-2 font-medium ${
              currentPage === number
                ? "bg-[#368DCF] text-white transition duration-500 ease-in-out"
                : "bg-white text-gray-700 hover:bg-[#2b79b4] hover:text-white"
            }`}
          >
            {number}
          </button>
        ))}
        <a
          onClick={handleNextPageButton}
          className="cursor-pointer rounded-md bg-[#368DCF] px-4 py-2 font-medium text-white transition duration-500 ease-in-out hover:bg-[#3178C6]"
        >
          下一頁
        </a>
      </nav>
    </div>
  );
};
export default Pagination;
