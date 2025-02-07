import { useState, useEffect } from "react";

const useLocalStorage = (defaultVal, key) => {
    const [val, setVal] = useState(() => {
        if (typeof window === 'undefined' || !window.localStorage) return defaultVal;

        const persistedVal = window.localStorage.getItem(key);
        return persistedVal !== null ? JSON.parse(persistedVal) : defaultVal;
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(val));
    }, [key, val]);

    return [val, setVal];
}

export { useLocalStorage };