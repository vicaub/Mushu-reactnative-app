const apiUrl = 'http://54.37.23.103/mushu';


export function getCFPFromBarcode(barcode) {
    // TODO: use backend API
    const url = apiUrl + '/cfp?barcode=' + barcode;
    console.log(url)
    return fetch(url)
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .catch() //network fail is handled in call in Product.js
}


// export function getAllergensFromApi() {
//     // TODO: Do we keep it?
//     const url = apiUrl + '/allergens.json';
//     return fetch(url)
//         .then((response) => response.json())
//         .then((json) => {
//             let allergens = [];
//             if (json.tags) {
//                 allergens = json.tags
//                     .filter((obj => (obj.id !== obj.name) && obj.products > 50))
//                     // only keep allergens with a meaningful name and which appear in more than 50 products
//                     // => the list is otherwise too long
//                     .map((obj) => {
//                         return {
//                             obj: {
//                                 id: obj.id,
//                                 name: obj.name},
//                             name: obj.name,
//                             _id: obj.id
//                         }
//                     });
//             }
//             return allergens;
//         })
//         .catch() //network fail is handled in call in Allergies.js
// }
