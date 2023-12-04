import { ReactNode, useState } from "react";

interface InteractiveBlockProps {
  bgColor: string;
  transform: string;
  content: ReactNode;
  link1: string;
  link2: string;
  link3: string;
}

const InteractiveBlock: React.FC<InteractiveBlockProps> = ({
  bgColor,
  transform,
  content,
  link1,
  // link2,
  // link3,
}) => {
  const [showLinks, setShowLinks] = useState(false);

  return (
    <div
      className={`absolute inset-0 flex h-52 w-60 flex-col items-center justify-center rounded-[10px] ${bgColor} text-center text-sm text-white opacity-95 ${transform} sm:w-64`}
      onClick={() => setShowLinks(!showLinks)}
    >
      {!showLinks && content}
      {showLinks && (
        <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-gray-300 bg-opacity-25 backdrop-blur-sm">
          <a
            href={link1}
            className="bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text text-2xl font-black italic text-transparent hover:text-blue-700"
          >
            Send messages
          </a>
        </div>
      )}
    </div>
  );
};

export default InteractiveBlock;
