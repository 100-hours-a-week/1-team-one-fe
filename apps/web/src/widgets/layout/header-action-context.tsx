import { createContext, type DependencyList, type ReactNode, useContext, useEffect } from 'react';

interface HeaderActionContextValue {
  setAction: (node: ReactNode | null) => void;
}

export const HeaderActionContext = createContext<HeaderActionContextValue>({
  setAction: () => undefined,
});

export function useSetHeaderAction(factory: () => ReactNode | null, deps: DependencyList) {
  const { setAction } = useContext(HeaderActionContext);

  useEffect(() => {
    setAction(factory());
    return () => setAction(null);
  }, [deps, setAction, factory]);
}
