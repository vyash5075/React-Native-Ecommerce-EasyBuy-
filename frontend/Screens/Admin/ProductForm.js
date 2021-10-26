import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Item, Picker } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Error from "../../Shared/Error";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import SmartPicker from "react-native-smart-picker";
const ProductForm = (props) => {
  const [pickerValue, setPickerValue] = useState();
  const [brand, setBrand] = useState();
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [category, setCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState();
  const [err, setError] = useState();
  const [countInStock, setCountInStock] = useState();
  const [rating, setRating] = useState(0);
  const [isFeatured, setIsFeature] = useState(false);
  const [richDescription, setRichDescription] = useState("");
  const [numReviews, setNumReviews] = useState(0);
  const [item, setItem] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setMainImage(result.uri);
      setImage(result.uri);
    }
  };

  const addProduct = () => {
    if (
      name == "" ||
      brand == "" ||
      price == "" ||
      description == "" ||
      category == "" ||
      countInStock == ""
    ) {
      setError("Please fill in the form correctly");
    }

    var selectcategory = "";
    var categoryid = categories.filter((e) => {
      if (e.name === category) {
        console.log(e._id);

        selectcategory = e._id;
        return e;
      }
    });

    console.warn(selectcategory);

    let formData = new FormData();
    const newImageUri = "file:///" + image.split("file:/").join("");

    formData.append("image", {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split("/").pop(),
    });

    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", selectcategory);
    formData.append("countInStock", countInStock);
    formData.append("richDescription", richDescription);
    formData.append("rating", rating);
    formData.append("numReviews", numReviews);
    formData.append("isFeatured", isFeatured);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    if (item !== null) {
      console.warn("putcase");
      const final = {
        name,
        description,
        richDescription,
        brand,
        price,
        category: selectcategory,
        countInStock,
        rating,
        numReviews,
        isFeatured,
      };
      console.log(final);
      const putMethod = {
        method: "PUT", // Method itself
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(final),
      };

      fetch(
        `https://easybuy0.herokuapp.com/api/v1/products/${item.id}`,
        putMethod
      )
        .then((response) => response.json())
        .then((res) => {
          console.warn(res.status);
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Product successfuly updated",
              text2: "",
            });
            setTimeout(() => {
              props.navigation.navigate("Products");
            }, 500);
          }
        })
        .catch((error) => {
          console.warn(error, "-------");
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
      //   axios
      //     .put(
      //       `https://easybuy0.herokuapp.com/api/v1/products/${item.id}`,
      //       formData,
      //       config
      //     )
      //     .then((res) => {
      //       if (res.status == 200 || res.status == 201) {
      //         Toast.show({
      //           topOffset: 60,
      //           type: "success",
      //           text1: "Product successfuly updated",
      //           text2: "",
      //         });
      //         setTimeout(() => {
      //           props.navigation.navigate("Products");
      //         }, 500);
      //       }
      //     })
      //     .catch((error) => {
      //       console.warn(error, "-------");
      //       Toast.show({
      //         topOffset: 60,
      //         type: "error",
      //         text1: "Something went wrong",
      //         text2: "Please try again",
      //       });
      //     });
    } else {
      console.warn("post case");
      axios
        .post(
          `https://easybuy0.herokuapp.com/api/v1/products`,
          formData,
          config
        )
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Product added",
              text2: "",
            });
            setTimeout(() => {
              props.navigation.navigate("Products");
            }, 500);
          }
        })
        .catch((error) => {
          console.warn(error);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    }
  };
  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      setItem(props.route.params.item);
      setBrand(props.route.params.item.brand);
      setName(props.route.params.item.name);
      setPrice(props.route.params.item.price.toString());
      setDescription(props.route.params.item.description);
      setMainImage(props.route.params.item.image);
      setImage(props.route.params.item.image);
      setCategory(props.route.params.item.category._id);
      setCountInStock(props.route.params.item.countInStock.toString());
      setBrand(props.route.params.item.brand);
    }
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    //categories
    axios
      .get(`https://easybuy0.herokuapp.com/api/v1/categories`)
      .then((res) => setCategories(res.data))
      .catch((error) => alert("Error To Load Categories"));

    //Image Picker

    // Image Picker
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();

    return () => {
      setCategories([]);
    };
  }, []);

  return (
    <FormContainer title="Add Product">
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: mainImage }} />
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Icon style={{ color: "black", fontSize: 20 }} name="camera" />
        </TouchableOpacity>
      </View>
      <View style={styles.label}>
        <Text>Brand</Text>
      </View>
      <Input
        placeholder="Brand"
        name="brand"
        id="brand"
        value={brand}
        onChangeText={(text) => setBrand(text)}
      />

      <View style={styles.label}>
        <Text>Name</Text>
      </View>
      <Input
        placeholder="Name"
        name="Name"
        id="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <View style={styles.label}>
        <Text>Price</Text>
      </View>
      <Input
        placeholder="Price"
        name="Price"
        id="Price"
        value={price}
        keyboardType={"numeric"}
        onChangeText={(text) => setPrice(text)}
      />

      <View style={styles.label}>
        <Text>Stock</Text>
      </View>
      <Input
        placeholder="Stock"
        name="Stock"
        id="Stock"
        value={countInStock}
        keyboardType={"numeric"}
        onChangeText={(text) => setCountInStock(text)}
      />

      <View style={styles.label}>
        <Text>Description</Text>
      </View>
      <Input
        placeholder="Description"
        name="Description"
        id="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />

      <Item
        style={{
          marginTop: 20,
          marginBottom: 40,
          borderRadius: 20,
          width: "80%",
          borderBottomColor: "transparent",
        }}
      >
        <SmartPicker
          expanded="true"
          androidBoxStyle={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 10,
            borderColor: "orange",
          }}
          iosBoxStyle={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 10,
            borderColor: "orange",
          }}
          selectedValue={pickerValue}
          label="Select your Category"
          onValueChange={(e) => [setPickerValue(e), setCategory(e)]}
        >
          {categories.map((c) => {
            return <Picker.Item key={c.code} label={c.name} value={c.name} />;
          })}
        </SmartPicker>
      </Item>

      {err ? <Error message={err} /> : null}
      <View style={styles.buttonContainer}>
        <EasyButton large primary onPress={() => addProduct()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};
const styles = StyleSheet.create({
  label: {
    width: "80%",
    marginTop: 10,
  },
  buttonContainer: {
    width: "80%",
    marginBottom: 80,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 100,
    elevation: 20,
  },
});

export default ProductForm;
