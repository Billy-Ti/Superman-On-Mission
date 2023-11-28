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
  );
};

export default ServiceTypeSelector;