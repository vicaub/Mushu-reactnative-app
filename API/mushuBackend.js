const apiUrl = 'http://54.37.23.103/mushu';


export function getCFPFromBarcode(barcode) {
    const url = apiUrl + '/cfp?barcode=' + barcode;
    return fetch(url)
        .then((response) => {
            return response.json();
        })
        .catch() //network fail is handled in call in Product.js
}


export function getEquivFromCFP(cfp) {
    const url = apiUrl + '/equivalent?cfp=' + cfp;
    return fetch(url)
        .then((response) => {
            return response.json();
        })
        .catch() //network fail is handled in call in Product.js
}
