import { useNavigate } from "react-router-dom";

const TaskButton = () => {
  const navigate = useNavigate();

  const handleStartTask = () => {
    navigate("/taskPage");
  };
  const handleAcceptTask = () => {
    navigate("/acceptTask");
  };
  return (
    <div className="container mx-auto px-4 md:max-w-7xl">
      <div className="mt-10 flex text-2xl">
        <button
          onClick={handleAcceptTask}
          className="flex w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-600 via-[#f6037d] to-[#F99659] py-3 text-2xl font-black text-white"
        >
          立即接任務
        </button>
        <button
          onClick={handleStartTask}
          className="flex w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-600 via-[#F658A8] to-[#F99659] py-3 text-2xl font-black text-white"
        >
          立即發任務
        </button>
      </div>
    </div>
  );
};

export default TaskButton;
