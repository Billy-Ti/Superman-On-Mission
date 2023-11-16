import { useNavigate } from "react-router-dom";

const StartTask = () => {
  const navigate = useNavigate();

  const handleStartTask = () => {
    navigate("/taskPage");
  };
  return (
    <div className="mt-10 flex text-2xl">
      <div className="group pointer-events-auto relative w-full overflow-hidden rounded-lg bg-gray-200 px-6 py-3 text-center [transform:translateZ(0)] before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-sky-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[25] hover:before:opacity-100">
        立即接任務
        <button className="absolute inset-0 h-full w-full text-white opacity-0 transition duration-500 ease-in-out hover:opacity-100">
          {"立即接任務"}
        </button>
      </div>
      <div className="group pointer-events-auto relative w-full overflow-hidden rounded-lg bg-gray-200 px-6 py-3 text-center [transform:translateZ(0)] before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-sky-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[25] hover:before:opacity-100">
        發起任務
        <button
          onClick={handleStartTask}
          className="absolute inset-0 h-full w-full text-white opacity-0 transition duration-500 ease-in-out hover:opacity-100"
        >
          {"發起任務"}
        </button>
      </div>
    </div>
  );
};

export default StartTask;
