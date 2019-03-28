import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
} from 'react-native';
import Pie from './Charts/Pie';
import Theme from './Theme';


class ProductStat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            activeKey: undefined,
            data: {},
        };
        // this._fetchData();
    }

    // componentDidMount() {
    //     this.willFocus = this.props.navigation.addListener(
    //         'willFocus',
    //         () => {
    //             this._fetchData();
    //         }
    //     );
    // }
    componentDidMount(): void {
        this._fetchData();
    }


    _formatData(cfp, updatedWeight) {
        const data = {
            'keys': [],
            'values': []
        };
        Object.keys(cfp).forEach((category) => {
            data.keys.push(category);
            data.values.push(cfp[category].cfp * updatedWeight);
        });
        return data
    }

    _getCFP(ingredient) {
        const CFPs = {};
        if (ingredient && ingredient.children) {
            ingredient.children.forEach((child) => {
                if (!child.children) {
                    if (!CFPs[child.match.category]) {
                        CFPs[child.match.category] = {
                            cfp: 0,
                            ingredients: new Set()
                        }
                    }
                    CFPs[child.match.category].cfp += child.match.cfp * child.percent / 100;
                    CFPs[child.match.category].ingredients.add(child.name)
                } else {
                    const childCFPs = this._getCFP(child);
                    Object.keys(childCFPs).forEach((category) => {
                        if (!CFPs[category]) {
                            CFPs[category] = {
                                cfp: 0,
                                ingredients: new Set()
                            }
                        }
                        CFPs[category].cfp += childCFPs[category].cfp * child.percent / 100;
                        childCFPs[category].ingredients.forEach(ingredient => {
                            CFPs[category].ingredients.add(ingredient)
                        })
                    })
                }
            });
        }
        return CFPs
    }

    _fetchData() {
        let ingredients = this.props.ingredients;
        if (typeof ingredients == "string") {
            ingredients = JSON.parse(ingredients)
        }
        const weight = this.props.weight;
        const weightUnit = this.props.weightUnit;

        const cfp = this._getCFP(ingredients);

        let updatedWeight = weight;
        if (weightUnit === "cl") {
            updatedWeight /= 100
        }

        const data = this._formatData(cfp, updatedWeight);
        this.setState({cfp: cfp, data: data});
    }

    // componentWillUnmount() {
    //     this.willFocus.remove();
    // }

    _onPieItemSelected(newIndex, newKey) {
        this.setState({
            activeIndex: newIndex,
            activeKey: newKey,
        });
    }

    _displayIngredientDetails(activeKey, cfp) {
        if (activeKey) {
            return (
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailsTitle}>Ingrédients de la catégorie « {activeKey} » :</Text>
                    <Text>{Array.from(cfp[activeKey].ingredients).join("\n")}</Text>
                </View>
            );
        } else {
            return;
        }
    }


    _displayStats() {
        const {cfp, data, activeKey} = this.state;

        let weightUnit = this.props.weightUnit;
        weightUnit === "l" ? weightUnit = "kg" : null;
        weightUnit === "ml" ? weightUnit = "g" : null;
        weightUnit === "cl" ? weightUnit = "kg" : null;

        if (data.keys && data.keys.length) {
            return (
                <View style={styles.container}>
                    <View style={styles.pieContainer}>
                        <Text style={styles.chartTitle}>Répartition de l'empreinte carbone du produit</Text>
                        <Pie
                            pieWidth={200}
                            pieHeight={200}
                            colors={Theme.colors}
                            data={data}
                            weightUnit={weightUnit}
                            onItemSelected={(newIndex, key) => this._onPieItemSelected(newIndex, key)}
                            selectedSliceLabel={activeKey}
                        />
                        {/*<Text style={styles.helper}>Psst... Sélectionnez une catégorie pour voir les détails !</Text>*/}

                    </View>

                    {this._displayIngredientDetails(activeKey, cfp)}
                </View>
            );
        } else {
            return (<View/>);
        }
    }

    render() {
        return (
            <ScrollView>
                {this._displayStats()}
            </ScrollView>
        );
    }
}

export default ProductStat;

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    pieContainer: {
        backgroundColor: 'whitesmoke',
    },
    oupsContainer: {
        marginTop: 150,
    },
    chartTitle: {
        paddingTop: 15,
        textAlign: 'center',
        paddingBottom: 5,
        paddingLeft: 5,
        fontSize: 18,
        backgroundColor: 'white',
        // color: 'grey',
        fontWeight: 'bold',
    },
    nbStat: {
        textAlign: 'center',
        backgroundColor: 'white',
    },
    bigNumber: {
        fontSize: 30,
    },
    helper: {
        fontSize: 10,
        marginBottom: 5,
        color: 'grey',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    detailsContainer: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    detailsTitle: {
        fontSize: 15,
        marginBottom: 5,
        // backgroundColor: 'white',
        // color: 'grey',
        fontWeight: 'bold',
    }
});