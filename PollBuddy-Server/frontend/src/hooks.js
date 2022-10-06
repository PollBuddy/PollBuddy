import React from 'react';

/*----------------------------------------------------------------------------*/

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
  }, arguments);
}

// Using contexts instead of ever changing values for the page title.
const PageContext = React.createContext([ "", () => {} ]);

// This helper function updates the title of the webpage when a component is
// loaded.
function useTitle(newTitle) {
  const updateTitle = React.useContext(PageContext);

  React.useEffect(() => {
    updateTitle(newTitle);
  }, [ updateTitle, newTitle ]);
}

// This helper effect allows users to run an asynchronous effect.
function useAsyncEffect(func, deps) {
  React.useEffect(() => {
    func();
  }, deps);
}

/*----------------------------------------------------------------------------*/

export { useFn, useTitle, useAsyncEffect, PageContext };