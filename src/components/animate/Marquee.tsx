import { ReactNode, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";

interface MarqueeProps {
  content: ReactNode;
  style?: React.CSSProperties;
}

const Marquee: React.FC<MarqueeProps> = ({ content, style }) => {
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const marqueeContentRef = useRef<HTMLHeadingElement>(null);
  const [duration, setDuration] = useState(15000);

  useEffect(() => {
    const updateDuration = () => {
      const containerWidth = marqueeContainerRef.current
        ? marqueeContainerRef.current.offsetWidth
        : 0;
      const contentWidth = marqueeContentRef.current
        ? marqueeContentRef.current.offsetWidth
        : 0;

      setDuration(Math.max((contentWidth + containerWidth) * 5, 5000)); // 至少保持 10000 毫秒
    };

    window.addEventListener("resize", updateDuration);
    updateDuration();

    return () => window.removeEventListener("resize", updateDuration);
  }, []);

  const scrolling = useSpring({
    from: { transform: "translateX(100%)" },
    to: { transform: "translateX(-100%)" },
    config: { duration: duration },
    reset: true,
    loop: true,
  });

  return (
    <div
      className="overflow-hidden"
      style={{ whiteSpace: "nowrap" }}
      ref={marqueeContainerRef}
    >
      <animated.div style={{ ...style, ...scrolling }} ref={marqueeContentRef}>
        {content}
      </animated.div>
    </div>
  );
};

export default Marquee;
