import { useNavigate } from "react-router-dom";

const HomeActionButton = () => {
  const navigate = useNavigate();

  const handleAcceptTask = () => {
    navigate("/acceptTask");
  };

  return (
    <div className="flex gap-4 text-2xl justify-end">
      <button
        onClick={handleAcceptTask}
        className="w-24 items-center justify-center  rounded-md bg-[#368DCF] p-3 text-2xl font-medium text-white transition duration-500 ease-in-out hover:bg-[#2b79b4] sm:w-48 lg:w-52"
      >
        開始
      </button>
    </div>
  );
};

export default HomeActionButton;
