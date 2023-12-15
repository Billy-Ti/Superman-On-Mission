import { useNavigate } from "react-router-dom";

const HomeActionButton = () => {
  const navigate = useNavigate();

  const handleAcceptTask = () => {
    navigate("/acceptTask");
  };

  return (
    <div className="flex justify-end gap-4 text-2xl">
      <button
        onClick={handleAcceptTask}
        className="items-center justify-center rounded-md  bg-[#368DCF] p-3 text-2xl font-medium text-white transition duration-500 ease-in-out hover:bg-[#2b79b4] lg:w-1/6"
      >
        開始
      </button>
    </div>
  );
};

export default HomeActionButton;
