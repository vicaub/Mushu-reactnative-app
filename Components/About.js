'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {mainColor} from "../Navigation/HeaderStyle";

class AboutScreen extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>Qui sommes-nous ?</Text>
                <Text style={styles.defaultText}>
                    Nous sommes une équipe de trois étudiants de CentraleSupélec. Nous avons décidé
                    de réaliser ce projet
                </Text>

                <Text style={styles.titleText}>
                    Comment calcule-ton l'empreinte carbone ?
                </Text>
                <Text style={styles.defaultText}>
                    Cette application calcule l'empreinte carbone à partir des ingrédients des produits que vous scannez
                    avec la caméra de votre téléphone
                </Text>

                <Text style={styles.titleText}>
                    Une question ?
                </Text>
                <Text style={styles.defaultText}>
                    Pour tout commentaire ou suggestion, veuillez nous contacter : feedback.mushu@gmail.com
                </Text>

                <Text style={styles.titleText}/>
                <Text style={styles.copyrightText}>
                    © Copyright 2019 Team Mushu
                </Text>
            </View>
        );
    }
}

export default AboutScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 18,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        // color: '#000000',
        color:'#00C378',
        textAlign: 'left'
    },
    defaultText: {
        marginLeft: 5,
        marginRight: 5,
    },
    copyrightText: {
        marginLeft: 5,
        marginRight: 5,
        fontWeight: 'bold',
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

});
