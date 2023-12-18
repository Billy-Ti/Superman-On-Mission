// 多組合動畫，由內向外彈進場，使用時要傳 show={true} 的參數
import { useTransition, animated } from 'react-spring';

interface MultiTransitionProps {
  show: boolean;
  children: React.ReactNode;
}

const MultiTransition: React.FC<MultiTransitionProps> = ({ show, children }) => {
  const multiTransition = useTransition(show, {
    from: { opacity: 0, transform: 'scale(0.5) translateY(-50%)' },
    enter: { opacity: 1, transform: 'scale(1) translateY(0)' },
    leave: { opacity: 0, transform: 'scale(0.5) translateY(-50%)' },
  });

  return (
    <>
      {multiTransition((style, item) =>
        item ? (
          <animated.div style={style}>{children}</animated.div>
        ) : null
      )}
    </>
  );
};

export default MultiTransition;
