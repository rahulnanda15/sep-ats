import { useState, useEffect } from 'react';
import App from '../App';
import Photo from '../pages/Photo';

const AppRouter: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/photo':
        return <Photo navigate={navigate} />;
      case '/':
      default:
        return <App navigate={navigate} />;
    }
  };

  return (
    <>
      {renderPage()}
    </>
  );
};

export default AppRouter;
