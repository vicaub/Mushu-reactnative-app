import React, {Component} from 'react';
import {StyleSheet, View, FlatList, TouchableOpacity, Text} from 'react-native';
import ProductItem from './ProductItem'
import BasketService from "../Services/BasketService";
import ProductService from "../Services/ProductService";
import {mainColor} from "../Navigation/HeaderStyle";
import {formatFloat} from "../Helper/stringParser";
import {getEquivFromCFP} from "../API/mushuBackend";


class BasketDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            basketId: this.props.navigation.getParam('basketId'),
        };
    }

    /**
     * Get basket from DB and update state
     */
    componentDidMount() {
        this.willFocus = this.props.navigation.addListener(
            'willFocus',
            () => {
                const basketObject = BasketService.findBasketByTimestamp(this.state.basketId);
                console.log(basketObject)
                getEquivFromCFP(basketObject.totalCFP, basketObject.CFPUnit).then((equiv) => {
                    console.log(equiv);
                    // productJson.equivalent = equiv;
                    this.setState({
                        equivalent: equiv,
                        isLoading: false,
                        basketObject
                    });
                }).catch((error) => {
                        console.warn(error);
                        this.setState({isConnected: false, isLoading: false})
                    }
                );
            }
        );


    }

    componentWillUnmount() {
        this.willFocus.remove();
    }

    _navigateToProduct(code, cartCounter) {
        this.props.navigation.navigate("Product", {barcode: code, basketTimestamp: this.state.basketId});
    }

    _pickEquivalent(){
        const equivalents = this.state.equivalent
        const rand_int = Math.floor(Math.random() * equivalents.length)
        return equivalents[rand_int].text
    }

    render() {
        if (this.state.basketObject && this.state.basketObject.content.length > 0) {
            return (
                <View style={styles.mainContainer}>
                    <View style={styles.header}>
                        <Text style={styles.cfpText}>Empreinte carbone : {formatFloat(this.state.basketObject.totalCFP)}{this.state.basketObject.CFPUnit} de Co2</Text>
                        <Text style={styles.equivalentText}>{this._pickEquivalent()}</Text>
                    </View>
                    <FlatList
                    data={this.state.basketObject.content}
                    keyExtractor={(item) => item.barcode.toString()}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => this._navigateToProduct(item.barcode, item.quantity)}>
                            <ProductItem product={ProductService.fetchProduct(item.barcode)}
                                         cartCounter={item.quantity}/>
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
    },
    cfpText: {
        marginTop:10,
        marginLeft:5,
        marginRight: 5,
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 18,
    },
    equivalentText: {
        marginLeft:5,
        marginRight: 5,
        marginBottom: 10,
        fontSize: 15,
    },
    header:{
        borderBottomWidth: 0.5,
        borderColor: '#d6d7da',
        marginBottom:10,
        backgroundColor:'#d6d7da',
    }
});