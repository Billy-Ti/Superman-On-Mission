import React from "react";

type SearchBarProps = {
  placeholder?: string;
  onSearch: (value: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearch = () => {
    onSearch(searchValue);
    setSearchValue("");
  };

  return (
    <div className="lg:flex justify-center hidden lg-block">
      <div className="relative flex items-center rounded border-2">
        <input
          type="text"
          className="w-[200px] rounded-md px-4 py-2 focus:outline-none"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          className="absolute inset-y-0 right-0 flex items-center justify-center px-4"
          onClick={handleSearch}
        >
          <svg
            className="h-5 w-5 text-gray-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15.5 15.5l4 4M10 18a8 8 0 100-16 8 8 0 000 16z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
