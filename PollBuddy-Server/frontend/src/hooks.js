import React from "react";

/* eslint-disable */

// This is a function binder hook, that memoizes the arguments and function for
// cleaner syntax and clearer components.

// If the argument is just one function, then that argument acts as a selector
// for arguments when the returned function is called.
function useFn(func, ...args) {
  return React.useCallback((...input) => {
    if (args.length === 1 && typeof args[0] === "function") {
      const select = args[0];
      return func(select(...input));
    } else {
      return func(...args);
    }
  }, [ func, ...args ]);
}

// This helper effect allows users to run an asynchronous effect.
function useAsyncEffect(func, deps) {
  React.useEffect(() => {
    func();
  }, deps);
}

/* eslint-enable */

// Using contexts instead of ever changing values for the page title.
const PageContext = React.createContext({ current: null });

// This helper function updates the title of the webpage when a component is
// loaded. Returns the current document title (minus the " - Poll Buddy") part.
function useTitle(newTitle) {
  const title = React.useContext(PageContext);

  React.useEffect(() => {
    if (title == null) { return; }
    title.current = newTitle;
    document.title = newTitle + " - Poll Buddy";
  }, [ newTitle, title ]);

  return title.current;
}

// This helper component provides a page context for its children.
function _TitleProvider({ initial, children }) {
  const title = React.useRef(initial ?? "");

  return (
    <PageContext.Provider value={title}>
      {children}
    </PageContext.Provider>
  );
}

const TitleProvider = React.memo(_TitleProvider);

// This hook detects changes to localStorage and provides a way to easily
// access and change values in localStorage.
function useLocal(key) {
  const [ value, setValue ] = React.useState(localStorage.getItem(key));

  const onEvent = React.useCallback(event => {
    if (event.storageArea !== localStorage) { return; }
    if (event.key == null) {
      setValue(null);
    } else if (event.key === key) {
      setValue(event.newValue);
    }
  }, [ key, setValue ]);

  const changeValue = React.useCallback(newValue => {
    localStorage.setItem(key, newValue);
  }, [ key ]);

  React.useEffect(() => {
    window.addEventListener("storage", onEvent);
    return () => window.removeEventListener("storage", onEvent);
  }, [ onEvent ]);

  return [ value, changeValue ];
}

export { useFn, useTitle, useAsyncEffect, TitleProvider, useLocal };