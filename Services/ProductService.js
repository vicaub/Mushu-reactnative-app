import DBConnector from '../Database/DBConnector';
// Service to fetch, add, update the products in the Database


let productDB = DBConnector.objects('Product');

let ProductService = {

    findAll: () => {
        return Array.from((productDB.sorted('updatedAt', true)))
    },

    addOrUpdate: (productJson) => {
        const productsInDB = productDB.filtered("barcode = '" + productJson.barcode + "'");
        if (productsInDB.length) {
            ProductService.update(Array.from(productsInDB)[0]);
        } else {
            productJson.ingredients = JSON.stringify(productJson.ingredients);
            ProductService.add(productJson)
        }
    },

    update: (product) => {
        DBConnector.write(() => {
            product.ingredients = JSON.stringify(product.ingredients);
            product.updatedAt = new Date();
            product.nbScans += 1;
            DBConnector.create('Product', product, true);
        });
    },

    add: (product) => {
        DBConnector.write(() => {
            product.ingredients = JSON.stringify(product.ingredients);
            product.updatedAt = new Date();
            product.scanDate = new Date();
            product.nbScans = 1;
            DBConnector.create('Product', product);
        })
    },

    // Retrieve a specific product in the database from the barcode (Used from the basket screen)
    fetchProduct: (barcode) => {
        const result = Array.from(productDB.filtered("barcode = '" + barcode + "'"));
        if (result.length > 0) {
            const product = result[0];
            const new_product = JSON.parse(JSON.stringify(product));
            new_product.ingredients = JSON.parse(JSON.parse(new_product.ingredients));
            return new_product
        } else {
            return undefined
        }
    }

};

export default ProductService;
