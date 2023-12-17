interface NoRecordsComponentProps {
  message: string;
}

const NoRecordsComponent: React.FC<NoRecordsComponentProps> = ({ message }) => {
  return (
    <div className="col-span-1 h-64 border border-[#368DCF] md:col-span-2 lg:col-span-3">
      <div className="flex h-full w-full items-center justify-center">
        <p className="text text-center text-lg font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default NoRecordsComponent;
