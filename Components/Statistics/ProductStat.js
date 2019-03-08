import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,
} from 'react-native';
import Pie from './Charts/Pie';
import Theme from './Theme';
import OupsScreen from '../Common/Oups';


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



    _formatData(cfp, weight) {
        const data = {
            'keys': [],
            'values': []
        };
        Object.keys(cfp).forEach((category) => {
            data.keys.push(category);
            data.values.push(cfp[category] * weight);
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
                        childCFPs[category] *= child.percent / 100;
                    })
                }
            });
        }
        return CFPs
    }

    _fetchData() {
        const ingredients = this.props.ingredients;
        const weight = this.props.weight;
        const cfp = this._getCFP(ingredients);
        const data = this._formatData(cfp, weight);
        this.setState({data: data})
    }

    // componentWillUnmount() {
    //     this.willFocus.remove();
    // }


    _displayStats() {
        const data = this.state.data;
        const cfpUnit = this.props.weightUnit;
        if (data.keys && data.keys.length) {
            return (
                <View style={styles.container}>
                    <Text style={styles.chartTitle}>Répartition de l'empreinte carbone du produit</Text>
                    <Pie
                        pieWidth={200}
                        pieHeight={200}
                        colors={Theme.colors}
                        data={data}
                        cfpUnit={cfpUnit}
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