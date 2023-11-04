import { useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

type TProps = {
  children: ReactNode;
};

const ScrollToTop: React.FC<TProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};

export default ScrollToTop;
