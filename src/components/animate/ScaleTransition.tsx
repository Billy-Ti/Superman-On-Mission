// 由下而上進場，使用時要傳 show={true} 的參數
import { useTransition, animated } from 'react-spring';

interface ScaleTransitionProps {
  show: boolean;
  children: React.ReactNode;
}

const ScaleTransition: React.FC<ScaleTransitionProps> = ({ show, children }) => {
  const scaleTransition = useTransition(show, {
    from: { transform: 'scale(0)' },
    enter: { transform: 'scale(1)' },
    leave: { transform: 'scale(0)' },
  });

  return (
    <>
      {scaleTransition((style, item) =>
        item ? <animated.div style={style}>{children}</animated.div> : ''
      )}
    </>
  );
};

export default ScaleTransition;
