// LandingPageAnimation.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface LandingPageAnimationProps {
  gif: string;
  duration: number;
}

const LandingPageAnimation: React.FC<LandingPageAnimationProps> = ({
  gif,
  duration,
}) => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 只有當路徑是首頁時顯示動畫
    if (location.pathname === "/") {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [location, duration]);

  if (!visible) return null;

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-200 via-blue-100 to-[#f7f4f0]">
      <img
        src={gif}
        alt="Loading..."
        className="h-50 w-50 animate-slide-in-3d rounded-full object-cover"
      />
    </div>
  );
};

export default LandingPageAnimation;
