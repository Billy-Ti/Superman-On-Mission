import { forwardRef, useImperativeHandle, useState } from "react";

// 定義 interface 以提供 Task 元件做清空動作
export interface ServiceTypeRef {
  resetServiceType: () => void;
  getSelectedServiceTypes: () => string[];
  getUrgentStatus: () => boolean | null;
  getDate: () => string;
}

const ServiceType = forwardRef((props, ref) => {
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

  const resetServiceType = () => {
    setSelectedIndexes([]);
    setUrgent(false);
  };

  return (
    <>
      <div className="flex">
        <div className="grid grid-cols-2 gap-4 text-2xl md:grid-cols-3 lg:grid-cols-4">
          {serviceType.map((item, index) => (
            <div
              key={index}
              className={`flex cursor-pointer items-center justify-center rounded border p-2 ${
                selectedIndexes.includes(index) ? "bg-gray-200" : ""
              }`}
              onClick={() => handleServiceTypeClick(index)}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="flex space-x-2 rounded p-2">
          <div className="flex flex-col">
            <div className="mb-4 flex">
              <p className="flex-1 rounded bg-white px-4 py-2 text-center text-2xl">
                是否十萬火急
              </p>
              <div
                className={`flex cursor-pointer items-center rounded px-4 py-2 shadow ${
                  urgent ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => handleUrgentClick(true)}
              >
                是
              </div>
              <div
                className={`flex cursor-pointer items-center rounded px-4 py-2 shadow ${
                  urgent === false ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => handleUrgentClick(false)}
              >
                否
              </div>
            </div>
            <div className="flex items-center">
              <p className="px-4">完成日期</p>
              {/* 底下 span 是 calendar_month icon */}
              {/* <span className="material-symbols-outlined">
                  calendar_month
                </span> */}
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

export default ServiceType;
