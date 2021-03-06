import React, { Component } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import ProductItem from './ProductItem';
import OupsScreen from './Common/Oups';
import ProductService from '../Services/ProductService';

class HistoryScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
        };
    }
    
    _searchInfo(code) {
        this.props.navigation.navigate("Product", {barcode: code, fromHistory: true, update : false});
    }

    componentDidMount() {
        this.willFocus = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.setState({
                    products : ProductService.findAll(),
                });
            }
        );
    }

    componentWillUnmount() {
        this.willFocus.remove();
    }

    render() {
        if (this.state.products && this.state.products.length > 0) {
            return (
                <View style={styles.mainContainer}>
                    <FlatList
                        data= {this.state.products}
                        keyExtractor={(item) => item.barcode}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={ () => this._searchInfo(parseInt(item.barcode))}>
                                <ProductItem product={item}/>
                            </TouchableOpacity>)}
                    />
                </View>
            );
        } else {
            return (
                <OupsScreen message="Vous n'avez pas encore scanné de produit ! Commencez par scanner un produit depuis l'écran d'accueil. Vous retrouverez tous vos scans ici !"/>
            );
        }
    }
}

export default HistoryScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: 20
    },
});