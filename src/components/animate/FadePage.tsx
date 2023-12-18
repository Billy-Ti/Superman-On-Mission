/* eslint-disable @typescript-eslint/no-unused-vars */
// 淡入淡出
import { useLocation } from "react-router-dom";
import { animated, useTransition } from "react-spring";

interface TransitionPageProps {
  children: React.ReactNode;
}

const FadePage: React.FC<TransitionPageProps> = ({ children }) => {
  const location = useLocation();

  const transitions = useTransition(location, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 1000 }, // 調整持續時間以符合您的需求
  });

  return transitions((props, _item) => (
    <animated.div style={props}>{children}</animated.div>
  ));
};

export default FadePage;
