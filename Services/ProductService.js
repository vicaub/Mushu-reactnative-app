import DBConnector from '../Database/DBConnector';
// Service to fetch, add, update the products in the Database


let productDB = DBConnector.objects('Product');

let ProductService = {

    findAll: () => {
        return Array.from((productDB.sorted('updatedAt', true)))
    },

    addOrUpdate: (productJson, scan) => {
        const productsInDB = productDB.filtered("barcode = '" + productJson.barcode + "'");
        productJson.ingredients = JSON.stringify(productJson.ingredients);
        if (productsInDB.length) {
            productJson.updatedAt = productsInDB[0].updatedAt;
            productJson.scanDate = productsInDB[0].scanDate;
            productJson.nbScans = productsInDB[0].nbScans;
            ProductService.update(productJson)
        } else {
            ProductService.add(productJson)
        }
        if (scan) {
            ProductService.scan(productJson.barcode)
        }
    },

    update: (product) => {
        // console.warn("update");
        DBConnector.write(() => {
            product.updatedAt = new Date();
            DBConnector.create('Product', product, true);
        });
    },

    add: (product) => {
        // console.warn("add");
        DBConnector.write(() => {
            product.updatedAt = new Date();
            product.scanDate = new Date();
            product.nbScans = 0;
            DBConnector.create('Product', product);
        })
    },

    scan: (barcode) => {
        // console.warn("scan");
        const product = Array.from(productDB.filtered("barcode = '" + barcode + "'"))[0];
        DBConnector.write(() => {
            product.nbScans += 1;
            DBConnector.create('Product', product, true);
        });
    },

    // Retrieve a specific product in the database from the barcode (Used from the basket screen)
    fetchProduct: (barcode) => {
        const result = Array.from(productDB.filtered("barcode = '" + barcode + "'"));
        if (result.length > 0) {
            return result[0]
        } else {
            return undefined
        }
    }

};

export default ProductService;
