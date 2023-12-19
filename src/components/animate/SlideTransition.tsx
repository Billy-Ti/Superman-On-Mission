// 由下而上的滑動，使用時要傳 show={true} 的參數
import { animated, useTransition } from "react-spring";

interface SlideTransitionProps {
  show: boolean;
  children: React.ReactNode;
}

const SlideTransition: React.FC<SlideTransitionProps> = ({
  show,
  children,
}) => {
  const slideTransition = useTransition(show, {
    from: { transform: "translateY(-100%)" },
    enter: { transform: "translateY(0)" },
    leave: { transform: "translateY(-100%)" },
  });

  return (
    <>
      {slideTransition((style, item) =>
        item ? <animated.div style={style}>{children}</animated.div> : null,
      )}
    </>
  );
};

export default SlideTransition;
