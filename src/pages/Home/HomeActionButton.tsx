import { useNavigate } from "react-router-dom";

const HomeActionButton = () => {
  const navigate = useNavigate();

  const handleStartTask = () => {
    navigate("/taskPage");
  };
  const handleAcceptTask = () => {
    navigate("/acceptTask");
  };
  return (
    <div className="flex justify-evenly text-2xl">
      <button
        onClick={handleAcceptTask}
        className="w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-600 via-[#f6037d] to-[#f99659] p-5 py-3 text-2xl font-black text-white transition duration-500 ease-in-out hover:bg-gradient-to-r hover:from-pink-500 hover:via-blue-600 hover:to-[#ff7f50]"
      >
        立即接任務
      </button>

      <button
        onClick={handleStartTask}
        className="w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-600 via-[#f6037d] to-[#f99659] p-5 py-3 text-2xl font-black text-white transition duration-500 hover:bg-gradient-to-r hover:from-pink-500 hover:via-blue-600 hover:to-[#ff7f50]"
      >
        立即發任務
      </button>
    </div>
  );
};

export default HomeActionButton;
