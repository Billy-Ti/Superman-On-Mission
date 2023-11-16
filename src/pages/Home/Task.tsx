import ServiceType from "../components/ServiceType";

const Task = () => {
  return (
    <div className="container mx-auto">
      <h3 className="mb-4 mt-10 border-b-8 border-black pb-3 text-4xl font-bold">
        發任務 {`>>`}
      </h3>
      <form>
        <div className="flex flex-col">
          <label htmlFor="taskTitle" className="mb-4 text-3xl font-black">
            標題
          </label>
          <input
            type="text"
            id="taskTitle"
            placeholder="例如 : 請人幫我.....，請盡量明白輸入任務需求"
            className="mb-4 rounded-[10px] border p-3 focus:outline-none"
          />
        </div>
        <div className="mb-4 flex">
          <p className="mr-3 whitespace-nowrap text-3xl font-black">服務類別</p>
          <ServiceType />
        </div>
        <div className="mb-4 flex">
          <p className="mr-3 text-3xl font-black">任務說明</p>
          <p className="flex flex-col justify-end text-lg font-black text-red-600">
            嚴格要求30字以上，好讓人明白要做什麼事情
          </p>
        </div>
        <textarea
          className="w-full resize-none rounded-[20px] border p-3 focus:outline-none mb-4"
          name="startTaskContent"
          id="startTaskContent"
        ></textarea>
        <div>
        <p className="mr-3 text-3xl font-black">任務報酬</p>
          
        </div>
      </form>
    </div>
  );
};

export default Task;
