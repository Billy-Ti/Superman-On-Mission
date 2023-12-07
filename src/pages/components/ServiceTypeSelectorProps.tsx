import { Icon } from "@iconify/react";
// 重用 ServiceType 元件
interface ServiceTypeSelectorProps {
  serviceType: string[];
  selectedIndexes: number[];
  handleServiceTypeClick: (index: number) => void;
}

const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  serviceType,
  selectedIndexes,
  handleServiceTypeClick,
}) => {
  return (
    <div className="mb-20 grid grid-cols-2 gap-4 rounded-md text-center text-xl md:grid-cols-4 lg:grid-cols-9">
      {serviceType.map((item, index) => (
        <div
          key={index}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-md p-2 font-normal text-gray-500 ${
            selectedIndexes.includes(index)
              ? "bg-[#6366fe] font-medium text-white"
              : ""
          }`}
          onClick={() => handleServiceTypeClick(index)}
        >
          {getIcon(index)} {/* 使用對應的 SVG 圖標 */}
          {item}
        </div>
      ))}
    </div>
  );
};

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

export default ServiceTypeSelector;
