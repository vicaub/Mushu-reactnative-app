import Realm from 'realm';


class User extends Realm.Object {
}

User.schema = {
    name: 'User',
    primaryKey: 'username',
    properties: {
        username: 'string',
        name: 'string',
        birthDate: 'date?',
        gender: 'string?',
        updatedAt: 'date?',
    },
};

class Equivalent extends Realm.Object {
}

Equivalent.schema = {
    name: 'Equivalent',
    properties: {
        value: 'float',
        text: 'string'
    },
};

class Product extends Realm.Object {
}

Product.schema = {
    name: 'Product',
    primaryKey: 'barcode',
    properties: {
        barcode: 'string',
        name: 'string?',
        updatedAt: 'date',
        nbScans: 'int',
        imageUrl: 'string?',
        CFPDensity: 'float',
        totalCFP: 'float',
        CFPUnit: 'string',
        weight: 'float',
        weightUnit: 'string',
        equivalent: {type: 'data', optional: true}
    },
};

class ProductBasket extends Realm.Object {
}

ProductBasket.schema = {
    name: 'ProductBasket',
    properties: {
        barcode: 'string',
        quantity: 'int',
        totalCFP: 'float?',
        CFPUnit: 'string?'
    },
};


class Basket extends Realm.Object {
}

Basket.schema = {
    name: 'Basket',
    primaryKey: 'dayTimestamp',
    properties: {
        dayTimestamp: 'int',
        updatedAt: 'date',
        content: {type: 'list', objectType: 'ProductBasket', default: []},
    },
};


// incrémenter schemaVersion à chaque modification des tables

export default new Realm({schema: [User, Product, ProductBasket, Basket, Equivalent], schemaVersion: 25});
