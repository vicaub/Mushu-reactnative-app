import DBConnector from '../Database/DBConnector';
import {todayTimeStamp} from '../Helper/basketHelper';
import ProductService from "./ProductService";

let basketDB = DBConnector.objects('Basket');

let BasketService = {

    /**
     * Get and return all baskets in DB
     */
    findAll: () => {
        return Array.from((basketDB.sorted('dayTimestamp', true)))
    },

    /**
     * Search for the basket of the day. Create one if it doesn't exist
     * Return it
     */
    findTodaysBasket: () => {
        return BasketService.findBasketByTimestamp(todayTimeStamp());
    },


    findBasketByTimestamp: (dayTimeStamp) => {
        const dbresult = basketDB.filtered("dayTimestamp = '" + dayTimeStamp + "'");
        if (dbresult.length) {
            return Array.from(dbresult)[0]
        } else {
            const basketInfo = {
                dayTimestamp: todayTimeStamp(),
                updatedAt: new Date(),
                content: [],
                CFPUnit: 'g',
                totalCFP: 0
            };
            try {
                DBConnector.write(() => {
                    try {
                        DBConnector.create('Basket', basketInfo);
                    } catch (e) {
                        console.warn(e);
                    }

                });
                return basketInfo;
            } catch (e) {
                console.warn(e);
            }
        }
    },


    /**
     * Returns quantity of a product in basket. 0 if no product in basket
     */
    findProductQuantityInBasket: (basketTimestamp, barcode) => {
        const basket = BasketService.findBasketByTimestamp(basketTimestamp);
        for (let i = 0; i < basket.content.length; i++) {
            if (basket.content[i].barcode === barcode) {
                return basket.content[i].quantity;
            }
        }
        return 0;
    },


    /**
     * Add a product to a specific basket
     */
    addProductToBasket: (basketTimestamp, barcode, quantity) => {
        const basket = BasketService.findBasketByTimestamp(basketTimestamp);
        const product = ProductService.fetchProduct(barcode);

        DBConnector.write(() => {
            if (basket.CFPUnit === product.CFPUnit) {
                basket.totalCFP += product.totalCFP;
            } else if (basket.CFPUnit === "kg") {
                basket.totalCFP += product.totalCFP/1000;
            }  else {
                basket.CFPUnit = product.CFPUnit;
                basket.totalCFP = basket.totalCFP/1000 + product.totalCFP
            }
            if (basket.CFPUnit === "g" && basket.totalCFP >= 1000) {
                basket.CFPUnit /= 1000;
                basket.totalCFP`= "kg`;
            }
            // Increment basket total cfp
            basket.totalCFP += product.totalCFP;
            // Check if product in basket
            let found = false;
            for (let i = 0; i < basket.content.length; i++) {
                if (basket.content[i].barcode === barcode) {
                    found = true;
                    basket.content[i].quantity = quantity;
                    break;
                }
            }
            if (!found) {
                let savedProduct = {
                    barcode,
                    quantity,
                };
                basket.content.unshift(savedProduct);
            }
            try {
                DBConnector.create('Basket', basket, true);
            } catch (e) {
                console.warn(e);
            }
        })
    },


    /**
     * Remove a product from a specific basket
     */
    deleteProductFromBasket: (basketTimestamp, barcode) => {
        const basket = BasketService.findBasketByTimestamp(basketTimestamp);
        const product = ProductService.fetchProduct(barcode);

        DBConnector.write(() => {
            if (basket.CFPUnit === product.CFPUnit) {
                basket.totalCFP -= product.totalCFP;
            } else if (basket.CFPUnit === "kg") {
                basket.totalCFP -= product.totalCFP/1000;
            }
            if (basket.CFPUnit === "kg" && basket.totalCFP < 1000) {
                basket.CFPUnit *= 1000;
                basket.totalCFP`= "g`;
            }
            // Increment basket total cfp
            basket.totalCFP += product.totalCFP;


            for (let i = 0; i < basket.content.length; i++) {
                if (basket.content[i].barcode === product.barcode) {
                    basket.content.splice(i, 1);
                    break;
                }
            }
            try {
                DBConnector.create('Basket', basket, true);
            } catch (e) {
                console.warn(e);
            }
        })
    }
};

export default BasketService;
