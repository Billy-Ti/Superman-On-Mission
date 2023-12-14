import { Icon } from "@iconify/react";
import { forwardRef, useImperativeHandle, useState } from "react";

// 定義 interface 以提供 Task 元件做清空動作
export interface ServiceTypeRef {
  resetServiceType: () => void;
  getSelectedServiceTypes: () => string[];
  getUrgentStatus: () => boolean | null;
  getDate: () => string;
}

const ServiceType = forwardRef((_props, ref) => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [urgent, setUrgent] = useState<boolean | null>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useImperativeHandle(ref, () => ({
    resetServiceType: () => {
      setSelectedIndexes([]);
      setUrgent(false);
      setSelectedDate("");
    },
    getSelectedServiceTypes: () => {
      return selectedIndexes.map((index) => serviceType[index]);
    },
    getUrgentStatus: () => {
      return urgent;
    },
    getDate: () => {
      if (!selectedDate) {
        return "";
      }

      const date = new Date(selectedDate);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      return `${year}/${month}/${day}`;
    },
  }));

  const serviceType = [
    "生活服務",
    "履歷撰寫",
    "專業顧問",
    "社群貼文",
    "程式開發",
    "專題製作",
    "翻譯寫作",
    "影像服務",
    "其他",
  ];

  const handleServiceTypeClick = (index: number) => {
    const isSelected = selectedIndexes.includes(index);

    if (isSelected) {
      setSelectedIndexes((prevIndexes) =>
        prevIndexes.filter((i) => i !== index),
      );
    } else {
      setSelectedIndexes((prevIndexes) => [...prevIndexes, index]);
    }
  };

  const handleUrgentClick = (value: boolean) => {
    setUrgent(value);
  };
  return (
    <>
      <div className="flex flex-col font-medium lg:justify-between">
        <div className="mb-10 grid grid-cols-2 gap-4 rounded-md text-center text-xl md:grid-cols-4 lg:grid-cols-9">
          {serviceType.map((item, index) => (
            <div
              key={index}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-md p-2 font-normal text-gray-500 transition duration-200 ease-in-out hover:bg-[#368DCF] hover:text-white ${
                selectedIndexes.includes(index)
                  ? "bg-[#3178C6] font-medium text-white"
                  : ""
              }`}
              onClick={() => handleServiceTypeClick(index)}
            >
              {getIcon(index)} {/* 使用對應的 SVG 圖標 */}
              {item}
            </div>
          ))}
        </div>
        <div className="mb-8 mt-4 flex space-x-2 rounded-md lg:mt-0">
          <div className="flex flex-col">
            <div className="mb-8 flex">
              <div className="flex items-center">
                <span className="mr-2 h-8 w-2 bg-[#368dcf]"></span>
                <p className="flex-1 rounded-md py-2 pr-4 text-center text-3xl font-semibold">
                  急件
                </p>
              </div>
              <div
                className={`flex mr-3 cursor-pointer items-center rounded-md px-4 py-2 font-semibold shadow ${
                  urgent ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => handleUrgentClick(true)}
              >
                是
              </div>
              <div
                className={`flex cursor-pointer items-center rounded-md px-4 py-2 font-semibold shadow ${
                  urgent === false ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => handleUrgentClick(false)}
              >
                否
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center font-semibold">
                <span className="mr-2 h-8 w-2 bg-[#368dcf]"></span>
                <p className="pr-4 text-3xl font-semibold">任務截止日</p>
              </div>
              <input
                className="border"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
const getIcon = (index: number) => {
  switch (index) {
    case 0:
      return (
        <Icon icon="fluent:star-settings-24-filled" width="40" height="40" />
      );
    case 1:
      return <Icon icon="mdi:resume" width="40" height="40" />;
    case 2:
      return <Icon icon="fa6-solid:handshake" width="40" height="40" />;
    case 3:
      return (
        <Icon icon="icon-park-outline:music-list" width="40" height="40" />
      );
    case 4:
      return <Icon icon="carbon:cics-program" width="40" height="40" />;
    case 5:
      return (
        <Icon icon="file-icons:microsoft-project" width="40" height="40" />
      );
    case 6:
      return (
        <Icon icon="material-symbols:g-translate" width="40" height="40" />
      );
    case 7:
      return <Icon icon="ph:video-fill" width="40" height="40" />;
    case 8:
      return <Icon icon="mingcute:more-3-fill" width="40" height="40" />;
    default:
      return <Icon icon="subway:redo-icon" width="40" height="40" />; // 若無圖標顯示
  }
};

export default ServiceType;
