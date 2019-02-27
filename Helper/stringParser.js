export const formatFloat = (float) => {
    if (float >= 100) {
        return parseInt(float)
    } else if (float >= 10) {
        return float.toFixed(1)
    } else {
        return float.toFixed(2)
    }
};