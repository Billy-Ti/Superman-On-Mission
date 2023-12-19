// 彈跳動畫，使用時要傳 show={true} 的參數
import { animated, useTransition } from "react-spring";

interface BounceTransitionProps {
  show: boolean;
  children: React.ReactNode;
}

const BounceTransition: React.FC<BounceTransitionProps> = ({
  show,
  children,
}) => {
  const bounceTransition = useTransition(show, {
    from: { transform: "scale(0.5)", opacity: 0 },
    enter: { transform: "scale(1)", opacity: 1 },
    leave: { transform: "scale(0.5)", opacity: 0 },
    config: { tension: 180, friction: 12 },
  });

  return (
    <>
      {bounceTransition((style, item) =>
        item ? <animated.div style={style}>{children}</animated.div> : null,
      )}
    </>
  );
};

export default BounceTransition;
