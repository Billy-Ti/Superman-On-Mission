interface DisplaySwitchButtonProps {
  onToggleUrgent: (event: React.ChangeEvent<HTMLInputElement>) => void;
  buttonText: string; // 傳一個新的 prop 來自定義文字
  className: string;
}

const DisplaySwitchButton = ({
  onToggleUrgent,
  buttonText,
  className,
}: DisplaySwitchButtonProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <p className="mr-2 text-2xl font-semibold ">
        {buttonText}
      </p>
      <div className="relative mr-2 inline-block w-10 select-none align-middle transition duration-200 ease-in">
        <input
          type="checkbox"
          name="toggle"
          className="toggle-checkbox absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white"
          onChange={onToggleUrgent}
        />
        <label
          htmlFor="toggle"
          className="toggle-label block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300"
        ></label>
      </div>
    </div>
  );
};

export default DisplaySwitchButton;
