import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Button } from "react-native";
import { Text, Left, Right, ListItem, Thumbnail, Body } from "native-base";
import { connect } from "react-redux";
import * as actions from "../../../Redux/Actions/cartActions";
import axios from "axios";
import Toast from "react-native-toast-message";
import AuthGlobal from "../../../Context/store/AuthGlobal";
var { width, height } = Dimensions.get("window");
const Confirm = (props) => {
  const context = useContext(AuthGlobal);
  const confirm = props.route.params;
  const finalOrder = props.route.params;

  // Add this
  const [productUpdate, setProductUpdate] = useState();

  useEffect(() => {
    if (finalOrder) {
      getProducts(finalOrder);
    }
    return () => {
      setProductUpdate();
    };
  }, [props]);

  const getProducts = (x) => {
    console.warn(props.route.params);
    //console.warn(x.order.order);
    const order = x.order.order;
    var products = [];
    if (order) {
      order.orderItems.forEach((cart) => {
        console.warn(cart.product.id);
        axios
          .get(
            `https://easybuy0.herokuapp.com/api/v1/products/${cart.product.id}`
          )
          .then((data) => {
            products.push(data.data);
            setProductUpdate(products);
          })
          .catch((e) => {
            console.log(e);
          });
      });
    }
  };

  const confirmOrder = () => {
    // console.warn(confirm.order.order.orderItems);
    // console.warn(context.stateUser.user.userid);
    let shippingAddress1 = confirm.order.order.shippingAddress1;
    const shippingAddress2 = confirm.order.order.shippingAddress2;
    const city = confirm.order.order.city;
    const zip = confirm.order.order.zip;
    const country = confirm.order.order.country;
    const phone = confirm.order.order.phone;
    const user = context.stateUser.user.userid;

    let arr = [];

    for (let i = 0; i < confirm.order.order.orderItems.length; i++) {
      arr.push({
        quantity: confirm.order.order.orderItems[i].quantity,
        product: confirm.order.order.orderItems[i].product.id,
      });
      // console.warn(confirm.order.order.orderItems[i].quantity);
      // console.warn(confirm.order.order.orderItems[i].product.id);
    }

    //  console.warn(finalOrder.order.order);
    const order = finalOrder.order.order;

    const body = {
      orderItems: arr,
      shippingAddress1,
      shippingAddress2,
      city,
      zip: 78,
      country,
      phone,
      user,
    };
    console.warn(body);
    axios
      .post(`https://easybuy0.herokuapp.com/api/v1/orders`, body)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order Completed",
            text2: "",
          });
          setTimeout(() => {
            props.clearCart();
            props.navigation.navigate("Cart");
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Confirm Order</Text>
      </View>
      {props.route.params ? (
        <View style={{ borderWidth: 1, borderColor: "orange" }}>
          <Text style={styles.title}>Shipping to:</Text>
          <View style={{ padding: 8 }}>
            <Text>Address: {confirm.order.order.shippingAddress1}</Text>
            <Text>Address2: {confirm.order.order.shippingAddress2}</Text>
            <Text>City: {confirm.order.order.city}</Text>
            <Text>Zip Code: {confirm.order.order.zip}</Text>
            <Text>Country: {confirm.order.order.country}</Text>
          </View>
          <Text style={styles.title}>Items:</Text>
          {confirm.order.order.orderItems.map((x) => {
            return (
              <ListItem style={styles.listItem} key={x.product.name} avatar>
                <Left>
                  <Thumbnail source={{ uri: x.product.image }} />
                </Left>
                <Body style={styles.body}>
                  <Left>
                    <Text>{x.product.name}</Text>
                  </Left>
                  <Right>
                    <Text>$ {x.product.price}</Text>
                  </Right>
                </Body>
              </ListItem>
            );
          })}
        </View>
      ) : null}
      <View style={{ alignItems: "center", margin: 20 }}>
        <Button title={"Place order"} onPress={confirmOrder} />
      </View>
    </ScrollView>
  );
};

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.titleContainer}>
//         <Text style={{ fontSize: 20, fontWeight: "bold" }}>Confirm Order</Text>
//         {props.route.params ? (
//           <View style={{ borderWidth: 1, borderColor: "orange" }}>
//             <Text style={styles.title}>Shipping to:</Text>
//             <View style={{ padding: 8 }}>
//               <Text>Address: {finalOrder.order.order.shippingAddress1}</Text>
//               <Text>Address2: {finalOrder.order.order.shippingAddress2}</Text>
//               <Text>City: {finalOrder.order.order.city}</Text>
//               <Text>Zip Code: {finalOrder.order.order.zip}</Text>
//               <Text>Country: {finalOrder.order.order.country}</Text>
//             </View>
//             <Text style={styles.title}>Items:</Text>
//             {/* CHANGE THIS */}
//             {productUpdate && (
//               <>
//                 {productUpdate.map((x) => {
//                   return (
//                     <ListItem style={styles.listItem} key={x.name} avatar>
//                       <Left>
//                         <Thumbnail source={{ uri: x.image }} />
//                       </Left>
//                       <Body style={styles.body}>
//                         <Left>
//                           <Text>{x.name}</Text>
//                         </Left>
//                         <Right>
//                           <Text>$ {x.price}</Text>
//                         </Right>
//                       </Body>
//                     </ListItem>
//                   );
//                 })}
//               </>
//             )}
//           </View>
//         ) : null}
//         <View style={{ alignItems: "center", margin: 20 }}>
//           <Button title={"Place order"} onPress={confirmOrder} />
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};

const styles = StyleSheet.create({
  container: {
    height: height,
    padding: 8,
    alignContent: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  title: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    width: width / 1.2,
  },
  body: {
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
  },
});

export default connect(null, mapDispatchToProps)(Confirm);
