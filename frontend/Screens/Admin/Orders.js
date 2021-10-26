import React, { useState, useCallback } from "react";
import { View, FlatList, Text } from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import OrderCard from "../../Shared/OrderCard";
const Orders = (props) => {
  const [orderList, setOrderList] = useState();

  useFocusEffect(
    useCallback(() => {
      getOrders();
      return () => {
        setOrderList();
      };
    }, [])
  );

  const getOrders = () => {
    axios
      .get(`https://easybuy0.herokuapp.com/api/v1/orders`)
      .then((x) => {
        setOrderList(x.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <View>
      <FlatList
        data={orderList}
        renderItem={({ item }) => (
          <OrderCard navigation={props.navigation} {...item} editMode={true} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Orders;
