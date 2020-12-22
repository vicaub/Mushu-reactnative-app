const apiUrl = 'http://3.139.60.113/mushu';


export function getCFPFromBarcode(barcode) {
    const url = apiUrl + '/cfp?barcode=' + barcode;
    return fetch(url)
        .then((response) => {
            if (response.status) {
                if (response.status !== 200 && response.status !== 500) {
                    throw {errorMessage: "Le serveur distant est indisponible, veuillez contacter l'équipe Mushu :)"}
                }
            }
            return response.json()
        })
        .then((json) => {
            if (json.errorMessage) {
                throw json
            } else {
                return json
            }
        })
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


export function getEquivFromCFP(cfp, unit) {
    const url = apiUrl + '/equivalent?cfp=' + cfp + "&unit=" + unit;
    return fetch(url)
        .then((response) => {
            if (response.status) {
                if (response.status !== 200 && response.status !== 500) {
                    throw {errorMessage: "Le serveur distant est indisponible, veuillez contacter l'équipe Mushu :)"}
                }
            }
            return response.json()
        })
        .then((json) => {
            if (json.errorMessage) {
                throw json
            } else {
                return json
            }
        })
}
