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
    <div className="mb-4 grid grid-cols-2 border rounded-md border-slate-500 gap-4 text-2xl md:grid-cols-3 lg:grid-cols-4">
      {serviceType.map((item, index) => (
        <div
          key={index}
          className={`flex cursor-pointer items-center justify-center rounded-md text-gray-500 font-medium p-2 ${
            selectedIndexes.includes(index) ? "bg-slate-500 font-semibold text-white" : ""
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
