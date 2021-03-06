import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, Alert} from 'react-native';
import {getCFPFromBarcode, getEquivFromCFP, formatProductJson} from '../API/mushuBackend';
import OupsScreen from './Common/Oups';
import Loader from './Common/Loader';
import Icon from 'react-native-vector-icons/FontAwesome';
import NumericInput from 'react-native-numeric-input';
import Emoji from 'react-native-emoji';
import ProductService from '../Services/ProductService';
import BasketService from '../Services/BasketService';
import {todayTimeStamp} from '../Helper/basketHelper';
import {mainColor} from '../Navigation/HeaderStyle';
import {formatFloat} from "../Helper/stringParser";
import ProductStat from "./Statistics/ProductStat";


class ProductScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productInfo: undefined,
            isLoading: true,
            fromHistory: this.props.navigation.getParam('fromHistory'),
            fromBasket: !!this.props.navigation.getParam('basketTimestamp'),
            basketTimestamp: this.props.navigation.getParam('basketTimestamp') ? this.props.navigation.getParam('basketTimestamp') : todayTimeStamp(),
            quantityInBasket: 0,
            cartCounter: 1,
        };
    }

    componentDidMount() {
        const barcode = this.props.navigation.getParam('barcode');
        this.setState({quantityInBasket: BasketService.findProductQuantityInBasket(this.state.basketTimestamp, barcode)});
        // console.warn(barcode);
        const productInDB = ProductService.fetchProduct(barcode);
        const dateLimit = new Date();
        // dateLimit.setTime(dateLimit.getTime() - 1000 * 30);
        dateLimit.setTime(dateLimit.getTime() - 1000 * 60 * 60 * 1);
        // console.warn(productInDB);
        if (productInDB && new Date(productInDB.updatedAt) > dateLimit) {
            // using product in DB only if updated less than a day ago
            // console.warn("using product in db");
            if (this.props.navigation.getParam('fromCamera')) {
                ProductService.scan(barcode);
            }
            this.setState({
                productInfo: productInDB,
                isLoading: false
            });
        } else {
            // console.warn("getting new product from api");
            getCFPFromBarcode(barcode)
                .then(productJson => {
                    productJson = formatProductJson(productJson);
                    let cfpKilo = productJson.totalCFP;
                    if (productJson.CFPUnit === "g") {
                        cfpKilo /= 1000;
                    }
                    getEquivFromCFP(cfpKilo, "kg").then((equiv) => {
                        console.log(equiv);
                        productJson.equivalent = equiv;
                        this.setState({
                            productInfo: productJson,
                            isLoading: false
                        });
                        // if (this.props.navigation.getParam('update') && Object.keys(this.state.productInfo).length > 0) {
                        try {
                            ProductService.addOrUpdate(productJson, this.props.navigation.getParam('fromCamera'));
                        } catch (e) {
                            console.warn(e);
                        }
                        // }
                    }).catch((error) => {
                            console.warn(error);
                            this.setState({isLoading: false, errorMessage: error.errorMessage})
                        }
                    );
                })
                .catch((error) => {
                        console.warn(error);
                        this.setState({isLoading: false, errorMessage: error.errorMessage})
                    }
                );
        }

    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <Loader/>
            );
        }
    }


    _addProductToCart() {
        BasketService.addProductToBasket(this.state.basketTimestamp, this.state.productInfo.barcode, this.state.cartCounter);
        this.setState({quantityInBasket: this.state.cartCounter});
    }

    _removeProductFromCart() {
        BasketService.deleteProductFromBasket(this.state.basketTimestamp, this.state.productInfo.barcode);
        this.setState({quantityInBasket: 0, cartCounter: this.state.quantityInBasket});
    }

    /**
     * Generate JSX for adding product to cart or remove it from cart
     */
    _printBasketOptions() {
        if (!this.state.fromHistory) {
            if (this.state.quantityInBasket > 0) {
                return (
                    <View style={styles.borderTop}>
                        <Text style={{textAlign: "center", marginTop: 10}}>
                            Supprimer l'article du panier
                        </Text>
                        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: 20}}>{this.state.quantityInBasket}</Text>
                            <View style={styles.cartButton}>
                                <Icon.Button
                                    name="trash"
                                    size={50}
                                    color="#00C378"
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    onPress={() => {
                                        this._removeProductFromCart();
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                )
            } else {
                return (
                    <View style={styles.borderTop}>
                        <Text style={{textAlign: "center", marginTop: 10}}>
                            Ajoute cet article à ton panier d'aujourd'hui <Emoji name={"wink"}/>
                        </Text>
                        <View style={{flexDirection: "row", justifyContent: "center"}}>
                            <View style={[styles.cartButton, {marginTop: 12}]}>
                                <NumericInput
                                    minValue={1}
                                    initValue={this.state.cartCounter}
                                    onChange={value => this.setState({cartCounter: value})}
                                />
                            </View>
                            <View style={styles.cartButton}>
                                <Icon.Button
                                    name="cart-arrow-down"
                                    size={50}
                                    color="#00C378"
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    onPress={() => {
                                        this._addProductToCart();
                                    }
                                    }
                                />
                            </View>
                        </View>
                    </View>
                )
            }
        } else {
            return;
        }
    }

    _makeDayCFPAverage() {
        const {totalCFP, CFPUnit} = this.state.productInfo;
        let kgCFP = totalCFP;
        if (CFPUnit === "g") {
            kgCFP /= 1000
        }
        const dayAverage = kgCFP / 4 * 100

        return `Correspond à ${formatFloat(dayAverage)}% de l'empreinte carbone journalière générée par la consommation d'un français moyen`;
    }

    _displayProductInfo() {
        const {productInfo, isLoading, isConnected} = this.state;

        if (!isLoading) {
            if (productInfo && Object.keys(productInfo).length > 0) {
                return (
                    <ScrollView style={styles.scrollviewContainer}>
                        <View style={styles.headerContainer}>
                            <Image
                                style={styles.imageProduct}
                                source={productInfo.imageUrl ? {uri: productInfo.imageUrl} : require('../assets/images/No-images-placeholder.png')}
                            />
                            <View style={styles.headerDescription}>
                                <Text
                                    style={styles.productNameText}>{productInfo.name ? productInfo.name : "Nom inconnu"}</Text>
                                <Text style={styles.defaultText}>Quantité
                                    : {productInfo.weight} {productInfo.weightUnit}</Text>
                                <Text style={styles.descriptionText}>Code barre : {productInfo.barcode}</Text>
                            </View>
                        </View>

                        {/*<Text style={styles.titleText}>Catégories</Text>*/}

                        {/*<Text*/}
                        {/*style={styles.defaultText}>{product.categories ? product.categories : "Non renseigné"}*/}
                        {/*</Text>*/}

                        <Text style={styles.cfpText}>
                            Empreinte carbonne : {formatFloat(productInfo.totalCFP)} {productInfo.CFPUnit}
                        </Text>
                        <Text style={styles.densityText}>
                            Soit {formatFloat(productInfo.CFPDensity)} kg de carbone par kg de produit
                        </Text>

                        <Text style={styles.equivalentText}>{this._makeDayCFPAverage()}</Text>

                        {/*<Text style={styles.titleText}>Ingrédients</Text>*/}
                        {/*<Text style={styles.defaultText}>{productInfo.ingredients}</Text>*/}

                        <ProductStat
                            ingredients={productInfo.ingredients}
                            weight={productInfo.weight}
                            weightUnit={productInfo.weightUnit}/>

                        {this._printBasketOptions()}

                    </ScrollView>
                )
            } else {
                return (
                    <OupsScreen message={this.state.errorMessage? this.state.errorMessage : "Pas de connexion internet..."}/>
                );
            }
        }
    }


    render() {
        return (
            <View style={styles.mainContainer}>
                {this._displayLoading()}
                {this._displayProductInfo()}
            </View>
        )
    }
}

export default ProductScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    scrollviewContainer: {
        flex: 1,
        flexDirection: "column"
    },
    headerContainer: {
        flexDirection: "row",
    },
    imageProduct: {
        flex: 1,
        margin: 5,
        resizeMode: 'contain',
    },
    imageNutri: {
        height: 80,
        marginTop: 5,
        marginBottom: 10,
        resizeMode: "contain",
    },
    headerDescription: {
        flex: 1,
    },
    productNameText: {
        fontWeight: 'bold',
        fontSize: 20,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'left'
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 18,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        color: '#000000',
        textAlign: 'left'
    },
    descriptionText: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
    },
    defaultText: {
        marginLeft: 5,
        marginRight: 5,
    },
    cfpText: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 0,
        fontWeight: 'bold',
        color: mainColor,
        fontSize: 18,
        textAlign: 'center',
    },
    densityText: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        fontStyle: 'italic',
        fontSize: 12,
        textAlign: 'center',
    },
    equivalentText: {
        marginLeft: 7,
        marginRight: 7,
        marginTop: 10,
        marginBottom: 0,
        fontSize: 15,
    },
    cartButton: {
        marginLeft: 15,
        marginRight: 15,
    },
    borderTop: {
        borderTopColor: '#d8d8d8',
        borderTopWidth: 1,
        marginTop: 10
    }
});
