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
        CFPDensity: json.CFPDensity,
        totalCFP: json.TotalCFP,
        CFPUnit: json.CFPUnit,
        weight: json.weight,
        weightUnit: json.weightUnit,
        ingredients: json.ingredients
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
