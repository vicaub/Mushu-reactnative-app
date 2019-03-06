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


    _getData(ingredient) {
        let data =   {
            'keys': [],
            'values': []
        };
        ingredient.children.forEach((child) => {
            if (!child.children) {
                if (!data.keys.includes(child.match.category)) {
                    data.keys.push(child.match.category);
                    data.values.push(child.match.cfp);
                } else {
                    data.values[data.keys.indexOf(child.match.category)] += child.match.cfp;
                }
            } else {
                const newData = this._getData(child);
                newData.keys.forEach((element, index, array) => {
                    if (data.keys.indexOf(element)) {
                        data.values[data.keys.indexOf(element)] += newData.values[index];
                    } else {
                        data.keys.push(element);
                        data.values.push(newData.values[index]);
                    }
                })
            }
        });
        return data
    }

    _fetchData() {
        const ingredients = this.props.ingredients;
        const data = this._getData(ingredients);
        console.warn(data);
        this.setState({data: data})

    }

    // componentWillUnmount() {
    //     this.willFocus.remove();
    // }



    _displayStats() {
        const data = this.state.data;
        console.warn(data);
        if (data.keys && data.keys.length) {
            return (
                <View style={styles.container}>
                    {/* Statistics */}
                    {/* Pie Chart */}
                    <Text style={styles.chartTitle}>Distribution du dernier panier</Text>
                    <Pie
                        pieWidth={200}
                        pieHeight={200}
                        colors={Theme.colors}
                        data={data}
                        // selectedSliceLabel={activeKey}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.oupsContainer}>
                    <OupsScreen
                        message="Vous n'avez pas encore de panier... Créez-en un pour obtenir votre analyse diététique !"/>
                </View>
            );
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
        marginTop: 21,
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