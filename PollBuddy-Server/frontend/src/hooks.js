import React from "react";

/* eslint-disable */

// This is a function binder hook, that memoizes the arguments and function for
// cleaner syntax and clearer components.

// TIP: All of the ...args should be primitive/memoized, otherwise this hook
// serves no performative purposes (still looks nice though).
function useFn(func, ...args) {
  return React.useCallback(() => func(...args), [ func, ...args ]);
}

// Helper hook with returns the composition of its arguments.

// NOTE: this applies the functions in reverse order. This is done to match how
// compositions of functions are done in mathematics:
// https://en.wikipedia.org/wiki/Function_composition
function useCompose(...funcs) {
  funcs.reverse();

  return React.useCallback(input => {
    return funcs.reduce((acc, cur) => cur?.(acc), input);
  }, funcs);
}

// This helper effect allows users to run an asynchronous effect.
function useAsyncEffect(func, deps) {
  React.useEffect(() => {
    func();
  }, deps);
}

// This helper hook allows one useCallback to run multiple functions at once.
function useCall(...funcs) {
  return React.useCallback(() => {
    const last = funcs.pop();
    for (const func of funcs) { func?.(); }
    return last?.();
  }, funcs);
}

/* eslint-enable */

// Helper function that toggles its input.
function selectToggle(value) {
  return !value;
}

// Helper function that gets the target value of the input.
function selectTarget(event) {
  return event.target.value;
}

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

export {
  useFn, useTitle, useAsyncEffect, TitleProvider, useLocal, useCall, useCompose,
  selectToggle, selectTarget,
};