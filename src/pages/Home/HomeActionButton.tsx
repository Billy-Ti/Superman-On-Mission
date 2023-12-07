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
        className="items-center justify-center rounded-md  p-3 text-2xl font-black text-white transition bg-[#368DCF] hover:bg-[#2b79b4] duration-500 ease-in-out lg:w-1/4"
      >
        就從這裡開始
      </button>
    </div>
  );
};

export default HomeActionButton;
