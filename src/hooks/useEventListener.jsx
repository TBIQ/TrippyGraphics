import { useRef, useEffect } from 'react';

const useEventListener = (eventName, handler, element = global) => {

  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      debugger; 
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      const eventListener = event => savedHandler.current(event);
      element.addEventListener(eventName, eventListener);
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element]
  );
};

export default useEventListener;