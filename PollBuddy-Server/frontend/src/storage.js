// This file allows the `useLocal` hook in hooks to work.

// What this does is override the main `localStorage` functions and replaces
// these with ones that dispatch events with `useLocal` catches and uses. Only
// `clear`, `removeItem`, and `setItem` are changed because they mutate the
// storage. When another window changes localStorage, regular `StorageEvent`s
// take over.

// Usually, `StorageEvent` fires when localStorage is changed from a different
// window, so this file is here to make it so it also fires when localStorage
// changes when in the same window.

const { clear: __CLEAR, removeItem: __REMOVE, setItem: __SET } = localStorage;

function storageEvent(key, newValue, oldValue) {
  return window.dispatchEvent(new StorageEvent("storage", {
    key, newValue, oldValue,
    storageArea: window.localStorage,
    url: window.location.href,
  }));
}

// NOTE: function() {...} notation is needed because it creates its own closure
// environment. Without it, a call to the original functions (e.g. __SET) will
// cause an error.

localStorage.clear = function() {
  __CLEAR.call(this);
  storageEvent(null, null, null);
};

localStorage.removeItem = function(key) {
  const old = localStorage.getItem(key);
  __REMOVE.call(this, key);
  storageEvent(key, null, old);
};

localStorage.setItem = function(key, value) {
  const old = localStorage.getItem(key);
  __SET.call(this, key, value);
  storageEvent(key, value, old);
};