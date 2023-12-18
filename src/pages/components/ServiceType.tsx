import { Icon } from "@iconify/react";
import "air-datepicker";
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import localeZh from "air-datepicker/locale/zh";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
new AirDatepicker("#zh", {
  locale: localeZh,
});
// 定義 interface 以提供 Task 元件做清空動作
export interface ServiceTypeRef {
  resetServiceType: () => void;
  getSelectedServiceTypes: () => string[];
  getUrgentStatus: () => boolean | null;
  getDate: () => string;
}
// 定義一個接口消除 TS 對 data picker 參數的提醒
interface AirDatepickerInstance {
  selectDate: (date: Date) => void;
  setViewDate: (date: Date) => void;
  hide: () => void;
}

// 讓 SVG 日期 icon 也能觸發選擇器
const handleIconClick = () => {
  const datepickerInput = document.getElementById("datepicker");
  if (datepickerInput) {
    datepickerInput.focus(); // 觸發選擇器輸入框的 focus 事件
  }
};
const ServiceType = forwardRef((_props, ref) => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [urgent, setUrgent] = useState<boolean | null>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  useEffect(() => {
    const todayButton = {
      content: "今天",
      onClick: (dp: AirDatepickerInstance) => {
        const currentDate = new Date();
        dp.selectDate(currentDate);
        dp.setViewDate(currentDate);
      },
    };
    const confirmButton = {
      content: "確定",
      onClick: (dp: AirDatepickerInstance) => {
        dp.hide();
      },
    };
    // 初始化日期選擇器設定
    const datepicker = new AirDatepicker("#datepicker", {
      locale: localeZh, // 將語言設定為英文
      dateFormat: "yyyy/MM/dd", // 設定日期格式
      isMobile: true, // 手機板日期跳出視窗，false 的話則只用下拉的
      buttons: [todayButton, confirmButton], // 加上"今天" "確定" 按鈕
      firstDay: 0, // 將一周的第一天設為星期日
      onSelect: function ({ formattedDate }) {
        if (Array.isArray(formattedDate)) {
          // 如果日期回傳是陣列，只取第一个元素
          setSelectedDate(formattedDate[0]);
        } else {
          // 如果是字串，直接使用
          setSelectedDate(formattedDate);
        }
      },
    });
    // 清除日期選擇器以避免內存洩漏
    return () => {
      datepicker.destroy();
    };
  }, []);
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
                <p className="flex-1 rounded-md py-2 pr-4 text-center text-xl font-semibold sm:text-2xl">
                  急件
                </p>
              </div>
              <div
                className={`mr-3 flex cursor-pointer items-center rounded-md px-4 py-2 font-normal shadow ${
                  urgent ? "bg-[#368DCF] text-white " : ""
                }`}
                onClick={() => handleUrgentClick(true)}
              >
                是
              </div>
              <div
                className={`flex cursor-pointer items-center rounded-md px-4 py-2 font-normal shadow ${
                  urgent === false ? "bg-[#368DCF] text-white" : ""
                }`}
                onClick={() => handleUrgentClick(false)}
              >
                否
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center font-semibold">
                <span className="mr-2 h-8 w-2 bg-[#368dcf]"></span>
                <p className="pr-4 text-xl font-semibold sm:text-2xl">
                  任務截止日
                </p>
              </div>
              <div className="relative flex items-center">
                <input
                  className="scale-95 transform cursor-pointer rounded-md border p-1  focus:outline-none"
                  id="datepicker"
                  placeholder="請選擇截止日期"
                  type="text"
                  value={selectedDate}
                />
                <svg
                  onClick={handleIconClick}
                  className="absolute right-3 h-5 w-5 cursor-pointer text-[#368dcf]" // 調整這裡來改變 SVG 的大小和顏色
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor" // 使用currentColor來讓SVG繼承文字顏色
                >
                  <path d="M8 14q-.425 0-.712-.288T7 13q0-.425.288-.712T8 12q.425 0 .713.288T9 13q0 .425-.288.713T8 14m4 0q-.425 0-.712-.288T11 13q0-.425.288-.712T12 12q.425 0 .713.288T13 13q0 .425-.288.713T12 14m4 0q-.425 0-.712-.288T15 13q0-.425.288-.712T16 12q.425 0 .713.288T17 13q0 .425-.288.713T16 14M5 22q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm0-2h14V10H5z" />
                </svg>
              </div>
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
