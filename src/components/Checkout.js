import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */



   // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
/**
 * @typedef {Object} Address - Data on added address
 *
 * @property {string} _id - Unique ID for the address
 * @property {string} address - Full address string
 */

/**
 * @typedef {Object} Addresses - Data on all added addresses
 *
 * @property {Array.<Address>} all - Data on all added addresses
 * @property {string} selected - Id of the currently selected address
 */

/**
 * @typedef {Object} NewAddress - Data on the new address being typed
 *
 * @property { Boolean } isAddingNewAddress - If a new address is being added
 * @property { String} value - Latest value of the address being typed
 */

// TODO: CRIO_TASK_MODULE_CHECKOUT - Should allow to type a new address in the text field and add the new address or cancel adding new address
/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { String } token
 *    Login token
 *
 * @param { NewAddress } newAddress
 *    Data on new address being added
 *
 * @param { Function } handleNewAddress
 *    Handler function to set the new address field to the latest typed value
 *
 * @param { Function } addAddress
 *    Handler function to make an API call to add the new address
 *
 * @returns { JSX.Element }
 *    JSX for the Add new address view
 *
 */
const AddNewAddressView = ({
  token,
  newAddress,
  handleNewAddress,
  addAddress,
}) => {
  const onAddressChange=(event)=>{
    //change the handleNewAddress
    handleNewAddress({isAddingNewAddress:true, value: event.target.value })
  }
  const onEventHandler=async (isAdd)=>{
   if(isAdd){
    //isAddnewAdress -false
    handleNewAddress((prev)=>{
      //trigger addnew adress api
      //console.log(prev.value, "New Adress")
      return {isAddingNewAddress:false, value: prev.value }
    })
    //console.log(newAddress, "New Adress")
     await addAddress(token, newAddress)
    return
   }
  handleNewAddress({isAddingNewAddress:false, value:""})
 }

  return (
    <Box display="flex" flexDirection="column">
      <TextField
        multiline
        minRows={4}
        placeholder="Enter your complete address"
        onChange={(event )=>{onAddressChange(event)}}
      />
      <Stack direction="row" my="1rem">
        <Button
          variant="contained"
          onClick={()=>{onEventHandler(true)}}
        >
          Add
        </Button>
        <Button
          variant="text"
          onClick ={()=>{onEventHandler(false)}}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

const Checkout = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });

  // Fetch the entire products list
  const getProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);

      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // Fetch cart data
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  /**
   * Fetch list of addresses for a user
   *
   * API Endpoint - "GET /user/addresses"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "_id": "",
   *          "address": "Test address\n12th street, Mumbai"
   *      },
   *      {
   *          "_id": "BW0jAAeDJmlZCF8i",
   *          "address": "New address \nKolam lane, Chennai"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const getAddresses = async (token) => {
    if (!token) return;
    //console.log("dsdasdasas")
    try {
      const response = await axios.get(`${config.endpoint}/user/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(response.data, "dsdasdasas")
      setAddresses({ ...addresses, all: response.data });
      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch addresses. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

    
 /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const addAddress = async (token, newAddress) => {
    //console.log(newAddress)
    try {
      // TODO: CRIO_TASK_MODULE_CHECKOUT - Add new address to the backend and display the latest list of addresses
      const response = await axios.post(`${config.endpoint}/user/addresses`,{address: newAddress.value},{
        headers:{
          Authorization: `Bearer ${token}`,
          'Content-Type':'application/json'
        }
      })
      if(response.status === 200){
        const data =await response.data
       // useState({ all: [], selected: "" });
        setAddresses(prev=>({
          selected: prev.selected, 
          all:data 
        }));
        setNewAddress({
          isAddingNewAddress: false,
          value: "",
        })
        return data
      }
    } catch (e) {
      setNewAddress({
        isAddingNewAddress: false,
        value: "",
      })
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not add this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  /**
   * Handler function to delete an address from the backend and display the latest list of addresses
   *
   * @param { String } token
   *    Login token
   *
   * @param { String } addressId
   *    Id value of the address to be deleted
   *
   * @returns { Array.<Address> }
   *    Latest list of addresses
   *
   * API Endpoint - "DELETE /user/addresses/:addressId"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *          "_id": "",
   *          "address": "Test address\n12th street, Mumbai"
   *      },
   *      {
   *          "_id": "BW0jAAeDJmlZCF8i",
   *          "address": "New address \nKolam lane, Chennai"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

  const deleteAddress = async (token, addressId) => {
    try {
      // TODO: CRIO_TASK_MODULE_CHECKOUT - Delete selected address from the backend and display the latest list of addresses
      const response = await axios.delete(`${config.endpoint}/user/addresses/${addressId}`, {
        headers:{
          Authorization: `Bearer ${token}`,
          Accept: 'application/json, text/plain, */*',
        }
      })
      if(response.status === 200){
        enqueueSnackbar("Address deleted", { variant: "success" });
        setAddresses((prev)=>(
          {all:response.data, selected:prev.selected}
        ))
      }
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_CHECKOUT - Validate request for checkout
  /**
   * Return if the request validation passed. If it fails, display appropriate warning message.
   *
   * Validation checks - show warning message with given text if any of these validation fails
   *
   *  1. Not enough balance available to checkout cart items
   *    "You do not have enough balance in your wallet for this purchase"
   *
   *  2. No addresses added for user
   *    "Please add a new address before proceeding."
   *
   *  3. No address selected for checkout
   *    "Please select one shipping address to proceed."
   *
   * @param { Array.<CartItem> } items
   *    Array of objects with complete data on products added to the cart
   *
   * @param { Addresses } addresses
   *    Contains data on array of addresses and selected address id
   *
   * @returns { Boolean }
   *    Whether validation passed or not
   *
   */
  const validateRequest = (items, addresses) => {
    let totalCartValue = getTotalCartValue(items);
    console.log(totalCartValue, "totaCartValue")
    let balance = localStorage.getItem("balance")
    let balanceAfterOrderWillBe =  balance-totalCartValue

    //"Please add a new address before proceeding."
    if(addresses.all.length === 0){
      enqueueSnackbar("Please add a new address before proceeding.", {variant:"info"})
      return false;
    }
    //"Please select one shipping address to proceed."
    if(!addresses.selected){
      enqueueSnackbar("Please select one shipping address to proceed.", {variant:"info"})
      return false;
    }
    //"You do not have enough balance in your wallet for this purchase"
    if (balanceAfterOrderWillBe <0){
      enqueueSnackbar("You do not have enough balance in your wallet for this purchase", {variant:"error"})
      return false;
    }
    //localStorage.setItem("balance", balanceAfterOrderWillBe)
    return {validation: true, totalCartValue: totalCartValue, balance: balanceAfterOrderWillBe};

  };

  // TODO: CRIO_TASK_MODULE_CHECKOUT
  /**
   * Handler function to perform checkout operation for items added to the cart for the selected address
   *
   * @param { String } token
   *    Login token
   *
   * @param { Array.<CartItem } items
   *    Array of objects with complete data on products added to the cart
   *
   * @param { Addresses } addresses
   *    Contains data on array of addresses and selected address id
   *
   * @returns { Boolean }
   *    If checkout operation was successful
   *
   * API endpoint - "POST /cart/checkout"
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *  "success": true
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *  "success": false,
   *  "message": "Wallet balance not sufficient to place order"
   * }
   *
   */
  const performCheckout = async (token, items, addresses) => {
     
    const cartValidationResults = validateRequest(items, addresses) 
    if(cartValidationResults.validation){
     try{
      const response = await axios.post(`${config.endpoint}/cart/checkout`,{addressId:addresses.selected},
      {
        headers:{
          Authorization: `Bearer ${token}`,
          'Content-Type':'application/json'
        }
      }
    )
    if(response.status === 200){
      localStorage.setItem("balance",cartValidationResults.balance )
      enqueueSnackbar("Order Placed Succesfully", {variant:"success"})
      history.push("/thanks")
      console.log(cartValidationResults.balance, "cartValidationResults.balance")
     
    }
     }
     catch(error){
      console.log(error)
      if(error.response.status >=400){
          enqueueSnackbar(error.message, {variant:"error"})
      }
      else{
        enqueueSnackbar("Internal server error", {variant:"error"})
      }
     }
      
    }
  };

  // TODO: CRIO_TASK_MODULE_CHECKOUT - Fetch addressses if logged in, otherwise show info message and redirect to Products page

  const isLogin =async (token)=>{
    if(token){
     await getAddresses(token)
      return 
    }
    enqueueSnackbar("You must be logged in to access checkout page", {variant:"error"})
    history.push("/products")
  }
  // Select handlerfro address
  const addressHandler = async (event, address)=>{

    //console.log(event.target.name, "Selected")
    if(event.target.name === "remove-address"){
      console.log("Trigger address delete for ", address._id)
       await deleteAddress(token, address._id)
       return
      }
      
      setAddresses(prev=>({...prev, selected:address._id}))
   
  }
  // Fetch products and cart data on page load
  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await getProducts();

      const cartData = await fetchCart(token);

      if (productsData && cartData) {
        const cartDetails = await generateCartItemsFrom(cartData, productsData);
        setItems(cartDetails);
      }
      
    };
    isLogin(token)
    onLoadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(()=>{

     // console.log(addresses, "updated")
  },[addresses])

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9} >
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
              {/* TODO: CRIO_TASK_MODULE_CHECKOUT - Display list of addresses and corresponding "Delete" buttons, if present, of which 1 can be selected */}
              {!addresses && <Typography my="1rem">
                 No addresses found for this account. Please add one to proceed
               </Typography>}
               { addresses && addresses.all.map(address=>
                <Stack key ={address._id} display="flex" direction="row" justifyContent="space-between" className={addresses.selected === address._id?"address-item selected" : "address-item not-selected"}
                onClick ={(event)=>addressHandler(event, address)}>
                    <Typography>{address.address}</Typography>
                    <Button sx={{color:"#6b9851"}} name="remove-address"><Delete/>Delete</Button>
                  </Stack>)}
            </Box>

            {/* TODO: CRIO_TASK_MODULE_CHECKOUT - Dislay either "Add new address" button or the <AddNewAddressView> component to edit the currently selected address */}
            {!newAddress.isAddingNewAddress &&<Button
                color="primary"
                variant="contained"
                id="add-new-btn"
                size="large"
                onClick={() => {
                  setNewAddress((currNewAddress) => ({
                    ...currNewAddress,
                    isAddingNewAddress: true,
                  }));
                }}
              >
                Add New Address
            </Button>}
            {newAddress.isAddingNewAddress &&<AddNewAddressView
                token={token}
                newAddress={newAddress}
                handleNewAddress={setNewAddress}
                addAddress={addAddress}
            />}

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography variant="h5">Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={()=>{ performCheckout(token, items, addresses)}}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly products={products} cartItems={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
