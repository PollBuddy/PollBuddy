import React from 'react';

/*----------------------------------------------------------------------------*/

// This is a function binder hook, that memoizes the arguments and function for
// cleaner syntax and clearer components.

// If the argument is just one function, then that argument acts as a selector
// for arguments when the returned function is called.
function useFn(func, ...args) {
  if (args.length === 1 && typeof args[0] === "function") {
    const select = args[0];
    return React.useCallback((...input) => {
      return func(select(...input));
    }, arguments);
  } else {
    return React.useCallback(() => {
      return func(...args);
    }, arguments);
  }
}

function useTitle(updateTitle, title) {
  React.useEffect(() => {
    updateTitle?.(title);
  }, [ updateTitle, title ]);
}

/*----------------------------------------------------------------------------*/

export { useFn, useTitle };