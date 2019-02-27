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
            ProductService.add(productJson)
        }
    },

    update: (product) => {
        DBConnector.write(() => {
            product.updatedAt = new Date();
            product.nbScans += 1;
            DBConnector.create('Product', product, true);
        });
    },

    add: (product) => {
        DBConnector.write(() => {
            product.updatedAt = new Date();
            product.scanDate = new Date();
            product.nbScans = 1;
            DBConnector.create('Product', product);
        })
    },

    // Retrieve a specific product in the database from the barcode (Used from the basket screen)
    fetchProduct: (barcode) => {
        return Array.from(productDB.filtered("barcode = '" + barcode + "'"))[0]
    }

};

export default ProductService;
