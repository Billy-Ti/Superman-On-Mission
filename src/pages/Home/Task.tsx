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
            placeholder="例如 : 請人幫我...，請盡量輸入明白的任務需求"
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
          className="mb-4 h-80 w-full resize-none rounded-[20px] border p-4 text-xl focus:outline-none"
          name="startTaskContent"
          id="startTaskContent"
        ></textarea>
        <div className="mb-20 flex items-center justify-between">
          <div className="flex items-center">
            <p className="mr-3 text-3xl font-black">任務報酬</p>
            <input
              type="text"
              id="taskTitle"
              placeholder="願支付多少 Coin 請人完成任務"
              className=" mr-4 w-72 rounded-[10px] border p-3 focus:outline-none"
            />
            <span className="text-xl font-black">Super Coin</span>
          </div>
          <div className="flex items-center text-xl font-black">
            <p>我的 Super Coin :</p>
            <span className="ml-1">3000</span>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex">
            <p className="mr-3 text-3xl font-black">上傳照片</p>
            <p className="flex flex-col justify-end text-lg font-black text-red-600">
              建議上傳
            </p>
          </div>
          {/* 底下四個 img 標籤要改成 file 上傳照片 */}
          <ul className="mb-28 flex justify-evenly border p-4">
            <li className="border">
              <img
                src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                alt=""
              />
            </li>
            <li className="border">
              <img
                src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                alt=""
              />
            </li>
            <li className="border">
              <img
                src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                alt=""
              />
            </li>
            <li className="border">
              <img
                src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                alt=""
              />
            </li>
          </ul>
          <div className="mt-10 flex text-2xl">
            <div className="group pointer-events-auto relative w-full overflow-hidden rounded-lg bg-gray-200 px-6 py-3 text-center [transform:translateZ(0)] before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-pink-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[25] hover:before:opacity-100">
              刪除任務
              <button className="absolute inset-0 h-full w-full text-white opacity-0 transition duration-500 ease-in-out hover:opacity-100">
                {"刪除任務"}
              </button>
            </div>
            <div className="group pointer-events-auto relative w-full overflow-hidden rounded-lg bg-gray-200 px-6 py-3 text-center [transform:translateZ(0)] before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-teal-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[25] hover:before:opacity-100">
              提交任務
              <button className="absolute inset-0 h-full w-full text-white opacity-0 transition duration-500 ease-in-out hover:opacity-100">
                {"提交任務"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Task;
