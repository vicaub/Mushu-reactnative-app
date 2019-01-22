import React, {Component} from 'react';
import {StyleSheet, Platform, View, Text, FlatList, TouchableOpacity} from 'react-native';
// import baskets from '../Helper/basketData'
import ProductItem from './ProductItem'
import BasketService from "../Services/BasketService";
import ProductService from "../Services/ProductService";

class BasketDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            basketObject: this.props.navigation.getParam('basketObject'),
        };
    }

    /**
     * Get basket from DB and update state
     */
    // componentDidMount() {
    //     this.setState({basket: BasketDetails._getBasketFromId(this.state.basketId)});
    // }

    /**
     * return basket object from basket id in bdd
     */
    // static _getBasketFromId(basketId) {
    //     for (let i = 0; i < baskets.length; i++) {
    //         if (baskets[i].id === basketId) {
    //             return baskets[i];
    //         }
    //     }
    // }

    _navigateToProduct(code, cartCounter) {
        this.props.navigation.navigate("Product", {barcode: code, fromBasket: true, cartCounter});
    }

    render() {
        if (this.state.basketObject.content.length > 0) {
            return (
                <View style={styles.mainContainer}>
                    <FlatList
                        data={this.state.basketObject.content}
                        keyExtractor={(item) => item.barcode.toString()}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => this._navigateToProduct(item.barcode, item.quantity)}>
                                <ProductItem product={ProductService.fetchProduct(item.barcode)} cartCounter={item.quantity}/>
                            </TouchableOpacity>)}
                    />
                </View>
            );
        } else {
            // TODO: if it takes some time to get basket from DB, display loading
            return null;
        }
    }
}

export default BasketDetails;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: 20
    },
});