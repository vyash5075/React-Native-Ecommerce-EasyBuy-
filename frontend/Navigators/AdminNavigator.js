import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Orders from "../Screens/Admin/Orders";
import Products from "../Screens/Admin/Products";
import ProductForm from "../Screens/Admin/ProductForm";
import Categories from "../Screens/Admin/Categories";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={Products}
        options={{
          title: "Products",
        }}
      />

      <Stack.Screen
        name="Orders"
        component={Orders}
        options={{
          title: "Orders",
        }}
      />

      <Stack.Screen
        name="ProductForm"
        component={ProductForm}
        options={{
          title: "ProductForm",
        }}
      />
      <Stack.Screen
        name="Categories"
        component={Categories}
        options={{
          title: "Categories",
        }}
      />
    </Stack.Navigator>
  );
}

export default function CartNavigator() {
  return <MyStack />;
}
