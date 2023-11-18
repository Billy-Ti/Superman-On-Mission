import { useRef, useState } from "react";
import Swal from "sweetalert2";
import ServiceType, { ServiceTypeRef } from "../components/ServiceType";
import countyToRegion from "../components/TaiwanRegion";

const Task = () => {
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  // 保留 selectedRegion 儲存地區的 state
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [taskReward, setTaskReward] = useState("");

  const serviceTypeRef = useRef<ServiceTypeRef>(null);

  const handleCountyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const county = event.target.value;
    setSelectedCounty(county);
    setSelectedRegion("");
  };

  const deleteTask = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      (input as HTMLInputElement).value = ""; // 直接操作 DOM 清除選擇的檔案
    });

    if (serviceTypeRef.current) {
      serviceTypeRef.current.resetServiceType();
    }

    Swal.fire({
      title: "確定要刪除任務嗎？",
      text: "此操作將清空所有已填寫的資訊。",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "已刪除",
          text: "任務資訊已清空",
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        });
        setSelectedCounty("請選擇任務縣市");
        setSelectedRegion("");
        setTaskTitle("");
        setTaskDetails("");
        setTaskDescription("");
        setDetailedAddress("");
        setAdditionalNotes("");
        setTaskReward("");
      }
    });
  };

  const confirmSubmitTask = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    Swal.fire({
      title: "是否提交任務?",
      text: "請再次確認所有資訊皆已填寫",
      icon: "question",
      confirmButtonText: "確定",
      showCancelButton: true,
      cancelButtonText: "取消",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "提交任務成功",
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        });
      }
    });
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(event.target.value);
  };
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
            value={taskTitle} // 綁定 taskTitle 狀態
            onChange={(e) => setTaskTitle(e.target.value)} // 更新狀態
            placeholder="例如 : 請人幫我...，請盡量輸入明白的任務需求"
            className="mb-4 rounded-[10px] border p-3 focus:outline-none"
          />
        </div>
        <div className="mb-4 flex items-center">
          <p className="mr-3 whitespace-nowrap text-3xl font-black">服務類別</p>
          <select
            className="mr-3 flex items-center border bg-gray-200 p-2"
            name="county"
            id="county"
            value={selectedCounty}
            onChange={handleCountyChange}
          >
            <option value="">請選擇任務縣市</option>
            <option value="台北市">台北市</option>
            <option value="新北市">新北市</option>
            <option value="桃園市">桃園市</option>
            <option value="台中市">台中市</option>
            <option value="台南市">台南市</option>
            <option value="高雄市">高雄市</option>
            <option value="基隆市">基隆市</option>
            <option value="新竹市">新竹市</option>
            <option value="新竹縣">新竹縣</option>
            <option value="苗栗縣">苗栗縣</option>
            <option value="彰化縣">彰化縣</option>
            <option value="南投縣">南投縣</option>
            <option value="雲林縣">雲林縣</option>
            <option value="嘉義市">嘉義市</option>
            <option value="嘉義縣">嘉義縣</option>
            <option value="屏東縣">屏東縣</option>
            <option value="宜蘭縣">宜蘭縣</option>
            <option value="花蓮縣">花蓮縣</option>
            <option value="台東縣">台東縣</option>
          </select>
          {selectedCounty && (
            <div className="mr-3 flex items-center">
              <select
                className="flex items-center border bg-gray-200 p-2"
                name="region"
                id="region"
                onChange={handleRegionChange}
              >
                <option value="">請選擇任務地區</option>
                {countyToRegion[selectedCounty]?.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          )}
          <input
            type="text"
            placeholder="請輸入詳細地址，例如 : xx 路 x 巷 x 弄 x 號 x 樓"
            className="w-full rounded-[10px] border p-3 focus:outline-none"
            value={detailedAddress}
            onChange={(e) => setDetailedAddress(e.target.value)}
          />
        </div>
        <ServiceType ref={serviceTypeRef} />
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
          value={taskDescription} // 綁定 taskDescription 狀態
          onChange={(e) => setTaskDescription(e.target.value)} // 更新狀態
        ></textarea>

        <div className="mb-4 flex">
          <p className="mr-3 text-3xl font-black">其它備註</p>
        </div>
        <textarea
          className="h-30 mb-4 w-full resize-none rounded-[20px] border p-4 text-xl focus:outline-none"
          name="additionalNotes"
          id="additionalNotes"
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
        ></textarea>
        <div className="mb-20 flex items-center justify-between">
          <div className="flex items-center">
            <p className="mr-3 text-3xl font-black">任務報酬</p>
            <input
              type="text"
              id="taskReward"
              placeholder="願支付多少 Coin 請人完成任務"
              className="mr-4 w-72 rounded-[10px] border p-3 focus:outline-none"
              value={taskReward}
              onChange={(e) => setTaskReward(e.target.value)}
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
          <ul className="mb-28 flex justify-evenly border p-4">
            <li className="border">
              <input type="file" name="taskPhoto" />
            </li>
            <li className="border">
              <input type="file" name="taskPhoto" />
            </li>
            <li className="border">
              <input type="file" name="taskPhoto" />
            </li>
            <li className="border">
              <input type="file" name="taskPhoto" />
            </li>
          </ul>
          <div className="mt-10 flex text-2xl">
            <div className="group pointer-events-auto relative w-full overflow-hidden rounded-lg bg-gray-200 px-6 py-3 text-center [transform:translateZ(0)] before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-pink-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[25] hover:before:opacity-100">
              刪除任務
              <button
                onClick={deleteTask}
                className="absolute inset-0 h-full w-full text-white opacity-0 transition duration-500 ease-in-out hover:opacity-100"
              >
                {"刪除任務"}
              </button>
            </div>
            <div className="group pointer-events-auto relative w-full overflow-hidden rounded-lg bg-gray-200 px-6 py-3 text-center [transform:translateZ(0)] before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-teal-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[25] hover:before:opacity-100">
              提交任務
              <button
                onClick={confirmSubmitTask}
                className="absolute inset-0 h-full w-full text-white opacity-0 transition duration-500 ease-in-out hover:opacity-100"
              >
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
