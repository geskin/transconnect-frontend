import { useState, useEffect } from "react";

const useLocalStorage = (defaultVal, key) => {
    const [val, setVal] = useState(() => {
        if (typeof window === 'undefined' || !window.localStorage) return defaultVal;

        const persistedVal = window.localStorage.getItem(key);
        // return persistedVal !== null ? JSON.parse(persistedVal) : defaultVal;

        if (!persistedVal || persistedVal === "undefined" || persistedVal === "null" || persistedVal === null || persistedVal === undefined) {
            return defaultVal;
        } else {
            try {
                return JSON.parse(persistedVal);
            } catch (error) {
                console.error("Error parsing value:", error);
                return defaultVal;
            }
        }
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(val));
    }, [key, val]);

    return [val, setVal];
}

export { useLocalStorage };