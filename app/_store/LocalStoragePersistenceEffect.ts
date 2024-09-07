"use client";

import { AtomEffect } from "recoil";

export function localStoragePersistenceEffect<T>(localStorageKey: string, defaultValue?: T): AtomEffect<T> {
  return ({ setSelf, onSet }) => {

    let savedValue = null;
    if (typeof window !== "undefined") {
      savedValue = localStorage.getItem(localStorageKey);
    }

    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    } else {
      if (defaultValue !== undefined) {
        setSelf(JSON.parse(JSON.stringify(defaultValue)));

        if (typeof window !== "undefined") localStorage.setItem(localStorageKey, JSON.stringify(defaultValue));
      }
    }

    onSet((newValue, _, isReset) => {
      if (typeof window !== "undefined") isReset
        ? localStorage.removeItem(localStorageKey)
        : localStorage.setItem(localStorageKey, JSON.stringify(newValue));
    });
  }
}