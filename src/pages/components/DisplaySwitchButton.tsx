interface DisplaySwitchButtonProps {
  onToggleUrgent: (event: React.ChangeEvent<HTMLInputElement>) => void;
  buttonText: string; // 傳一個新的 prop 來自定義文字
}

const DisplaySwitchButton = ({
  onToggleUrgent,
  buttonText,
}: DisplaySwitchButtonProps) => {
  return (
    <div className="mb-4 flex items-center">
      <p className="mr-2 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-400 bg-clip-text text-2xl font-black text-transparent">
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
