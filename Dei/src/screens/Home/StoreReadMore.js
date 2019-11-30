import React, { Component } from 'react';
import {
    Text,
    Image,
    View,
    StyleSheet
} from 'react-native';
import {
    DEIRegularText,
    DEIBoldText,
    getProductImage,
  } from '../../components';
import Icon from 'react-native-vector-icons/EvilIcons';
import Micon from 'react-native-vector-icons/MaterialIcons';
import { Divider } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Colors, ApplicationStyles, Fonts, Images, Metrics } from '../../themes';
import CartBadge from '../../components/CartBadge';
class StoreReadMore extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const ReadmoreData = navigation.getParam('ReadmoreData', {});
        this.state = {
            moredata:ReadmoreData.Merchant,
            moretitle: 'U Starts Supermarket'
        };
      }
    static navigationOptions = ({ navigation }) => ({
        title: 'U Starts Supermarket',
        headerRight: (
          <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={ApplicationStyles.navigation.tabIconContainer}>
            <Image
              style={ApplicationStyles.navigation.actionImage}
              source={Images.cart.icon}
            />
            <CartBadge style={{position: 'absolute', left: 15, top: 10}}/>
          </TouchableOpacity>
        )
    });
    
    render() {
        console.log('22222222222222', this.state.moredata)
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: '80%' }}>
                    <ScrollView>
                        <View>
                        <TouchableOpacity
                            style={{backgroundColor: Colors.grey}}
                            onPress={() =>
                            this.props.navigation.navigate('ProductPreview', {
                                url: getProductImage(this.state.product)
                            })
                            }
                        >
                            <Image
                            source={{ uri: this.state.moredata.banner_url }}
                            style={{ width: Metrics.screenWidth, height: 150, resizeMode: 'contain' }}
                            />
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: 20, marginTop: 30 }}>
                            <DEIBoldText
                            title={this.state.moretitle}
                            style={{ fontSize: 20, color: Colors.primary }}
                            />
                            <View style={{flexDirection:'row'}}>
                                <View style={{marginTop: 12, fontWeight:"bold"}}>
                                    <Icon name="clock" size={20} color={Colors.green} />
                                </View>
                                <DEIRegularText title={"10:00-21:00"} style={styles.belowPrice} />
                            </View>
                            <View style={{flexDirection:'row', marginTop: 10}}>
                                <View>
                                    <Micon name="location-on" size={20} color={Colors.darkerGrey} />
                                </View>
                                <View style={{flexDirection:'column', marginLeft:5}}>
                                    <DEIRegularText title={"# "+this.state.moredata.address} style={Colors.darkerGrey} />
                                    <DEIRegularText title={"Kitchener Complex"} style={Colors.darkerGrey} />
                                    <DEIRegularText title={this.state.moredata.country+ " , "+this.state.moredata.postal_code} style={Colors.darkerGrey} />
                                    <DEIRegularText title={this.state.moredata.city} style={Colors.darkerGrey} />
                                </View>
                            </View>
                            <Divider style={styles.divider}/>
                            <View style={styles.productDescContainer}>
                                <DEIBoldText title={"Our Story"} style={{color: Colors.black, fontSize: 15, marginBottom: 10}}/>
                                <DEIRegularText style={{lineHeight: 24, color: Colors.darkerGrey}} title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ultrices, mi feugiat blandit dictum, urna dui pharetra mi, laoreet pretium magna magna sit amet purus. Maecenas fringilla nibh in mi sollicitudin, eu efficitur felis gravida. Curabitur eu tempus nulla. Etiam ipsum nisl, sollicitudin ac hendrerit vel, venenatis in sapien. Vivamus iaculis ex ante, at malesuada ante imperdiet et. Etiam hendrerit commodo nibh, vitae tincidunt justo mollis vel. Ut in porttitor nunc."/>
                            </View>
                        </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: Colors.white },
    image: { width: Metrics.screenWidth, height: 200, resizeMode: 'contain' },
    footer: { height: 100, backgroundColor: Colors.grey, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    nameContainer: {
      marginHorizontal: 20,
      marginTop: 30
    },
    name: { fontSize: 20, color: Colors.primary },
    description: { color: Colors.darkerGrey, marginTop: 5 },
    price: { fontSize: 25, color: Colors.accent, marginTop: 10, fontWeight: 'bold' },
    belowPrice: { color: Colors.green, marginTop: 10 },
    divider: {marginTop: 50},
    productDescContainer: {marginTop: 20},
  });

export default StoreReadMore;