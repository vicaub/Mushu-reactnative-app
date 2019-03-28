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
            activeKey: '',
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
            data.values.push(cfp[category] * updatedWeight);
        });
        return data
    }

    _getCFP(ingredient) {
        const CFPs = {};
        if (ingredient && ingredient.children) {
            ingredient.children.forEach((child) => {
                if (!child.children) {
                    if (!CFPs[child.match.category]) {
                        CFPs[child.match.category] = 0
                    }
                    CFPs[child.match.category] += child.match.cfp * child.percent / 100;
                } else {
                    const childCFPs = this._getCFP(child);
                    Object.keys(childCFPs).forEach((category) => {
                        if (!CFPs[category]) {
                            CFPs[category] = 0
                        }
                        CFPs[category] += childCFPs[category] * child.percent / 100;
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
        this.setState({data: data})
    }

    // componentWillUnmount() {
    //     this.willFocus.remove();
    // }


    _displayStats() {
        const data = this.state.data;
        let weightUnit = this.props.weightUnit;
        weightUnit === "l"? weightUnit = "kg" : null;
        weightUnit === "ml"? weightUnit = "g" : null;
        weightUnit === "cl"? weightUnit = "kg" : null;

        if (data.keys && data.keys.length) {
            return (
                <View style={styles.container}>
                    <Text style={styles.chartTitle}>Répartition de l'empreinte carbone du produit</Text>
                    <Pie
                        pieWidth={200}
                        pieHeight={200}
                        colors={Theme.colors}
                        data={data}
                        weightUnit={weightUnit}
                        // selectedSliceLabel={activeKey}
                    />
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
        backgroundColor: 'whitesmoke',
        marginTop: 10,
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
        color: 'grey',
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
    }
});