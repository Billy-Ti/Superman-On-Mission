// 旋轉進場，使用時要傳 show={true} 的參數
import { animated, useTransition } from "react-spring";

interface RotateTransitionProps {
  show: boolean;
  children: React.ReactNode;
}

const RotateTransition: React.FC<RotateTransitionProps> = ({
  show,
  children,
}) => {
  const rotateTransition = useTransition(show, {
    from: { transform: "rotate(0deg)" },
    enter: { transform: "rotate(360deg)" },
    leave: { transform: "rotate(0deg)" },
  });

  return (
    <>
      {rotateTransition((style, item) =>
        item ? <animated.div style={style}>{children}</animated.div> : null,
      )}
    </>
  );
};

export default RotateTransition;
