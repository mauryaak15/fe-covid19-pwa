export default (callback: (...args: any[]) => void, delay: number) => {
    let timeoutId: any;
    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};
