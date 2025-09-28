import { useState, useEffect } from 'react';
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
    // Always show the Photo page (check-in app)
    return <Photo navigate={navigate} />;
  };

  return (
    <>
      {renderPage()}
    </>
  );
};

export default AppRouter;
