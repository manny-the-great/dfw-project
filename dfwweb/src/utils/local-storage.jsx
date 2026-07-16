export const getLocalStorageData = (key) => {
    if (key === "userData") {
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data) || null;
        }
    } else {
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data) || null;
        }
    }
    return null;
};
export const SetInLocalStorage = (key, value) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, value);
};

export const clearLocalStorage = (key) => {
    localStorage.removeItem(key);
};
