const apiUrl = 'http://54.37.23.103/mushu';


export function getCFPFromBarcode(barcode) {
    const url = apiUrl + '/cfp?barcode=' + barcode;
    console.log("calling api: " + url);
    return fetch(url)
        .then((response) => {
            return response.json();
        })
        .catch() //network fail is handled in call in Product.js
}


export function formatProductJson(json) {
    return {
        barcode: json.barcode,
        name: json.name,
        imageUrl: json.image_url,
        CFPDensity: json.value,
        totalCFP: 1.12,
        CFPUnit: 'kg',
        weight: 100,
        weightUnit: 'gr',
    };
}


export function getEquivFromCFP(cfp) {
    const url = apiUrl + '/equivalent?cfp=' + cfp;
    return fetch(url)
        .then((response) => {
            return response.json();
        })
        .catch() //network fail is handled in call in Product.js
}
