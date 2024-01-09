import { useLocation } from "react-router-dom";
import { animated, useTransition } from "react-spring";

interface TransitionPageProps {
  children: React.ReactNode;
}

const TransitionPage: React.FC<TransitionPageProps> = ({ children }) => {
  const location = useLocation();

  const transitions = useTransition(location.pathname, {
    from: { opacity: 0, transform: "translate3d(-100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(100%,0,0)" },
  });

  return transitions((style) => (
    <animated.div style={style}>{children}</animated.div>
  ));
};

export default TransitionPage;
