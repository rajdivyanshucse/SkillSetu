import React, { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext({
  currentPath: '/',
  navigate: () => {},
});

export const Router = ({ children }) => {
  const getPath = () => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname || '/';
  };

  const [currentPath, setCurrentPath] = useState(getPath());

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getPath());
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (path === currentPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a Router');
  }
  return context;
};

export const Link = ({ href, to, children, className = '', activeClassName = '', onClick, ...props }) => {
  const { currentPath, navigate } = useRouter();
  const targetPath = to || href || '/';
  const isActive = currentPath === targetPath;

  const handleClick = (e) => {
    e.preventDefault();
    onClick && onClick(e);
    navigate(targetPath);
  };

  return (
    <a
      href={targetPath}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''}`}
      {...props}
    >
      {children}
    </a>
  );
};

export default Router;
