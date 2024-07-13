import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState, useRef } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart"

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [loader, setLoader] = useState(false);
  const [products, setProducts] = useState([])
  const [notFound, setNotFound] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const {enqueueSnackbar} = useSnackbar();


  const [cartItems, setCartItems] = useState([]);
  const isLogin = localStorage.getItem("token")

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    let URL = `${config.endpoint}/products`;
   
    try {
      const response = await axios(URL, { timeout: 3000 });

      if (response.status === 200) {
        const data = await response.data;
        setProducts(data)
        //console.log("PRODUCTS DEBUG:: ",data)
        //return data;
      }

    }
    catch (error) {
      console.log("Fetch failed", error)
    }

  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setNotFound(false);
    setLoader(true);
    let URL = `${config.endpoint}/products/search?value=${text}`
    try {
      const response = await axios(URL);

      if (response.status === 200) {
        const data = await response.data;
        //console.log("RESPONSE DATA::", data);
        setProducts(data);
        setLoader(false);
      }

    }
    catch (error) {
      let message = error.message;
      setLoader(false);
      if (message.includes("404")) {
        //console.log("Products not found::",error.message)
        setNotFound(true);
      }
    }

  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  //  const debounce =(fn, delay)=>{
  //   let timeout;
  //   return function bouncedFunction(...args){
  //     const later = () => {
  //       clearTimeout(timeout);
  //      fn(...args);
  //     };

  //     clearTimeout(timeout);
  //     timeout = setTimeout(later, delay);
  //   } 
  //}

const debounceSearch = (event, debounceTimeout) => {
  let searchKeywords = event.target.value;
  /*
  return function bouncedFunction(...args){
    const later = () => {
      clearTimeout(timeout);
      performSearch(...args);
    };
 
    clearTimeout(timeout);
    timeout = setTimeout(later, debounceTimeout);
  }*/
  if(debounceTimeout){
    clearTimeout(debounceTimeout);
  }
  const timer = setTimeout(() => performSearch(searchKeywords), 1000);
  setTimerId(timer);
};

 /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
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
  const fetchCart = async (token) => {
   // console.log(token)
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let URL = `${config.endpoint}/cart`
      //console.log(URL)
      const response = await axios.get(URL,{
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
     // console.log(response, "INitial fetch")
      const data = await response.data
      setCartItems(data)
    } catch (e) {
      
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
        //console.log(e)
      }
      
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let foundIndex = items.findIndex((item)=> item.productId === productId)
    //console.log(foundIndex, "isItemInCart")
    if(foundIndex>=0)
          return true
    return false 
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    cartItems,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
   // console.log(qty, "cart event")
   // whaen user not logged in
    if(!token){
      enqueueSnackbar("Login to add an item to the Cart", {variant:"error"})
      return 
    }
    // //if user cart is empty
    // if(cartItems.length ===0 ){
    //    let  newItemList = {
    //       productId: productId,
    //       qty : qty
    //     }
    //     console.log("here::")
    //    //setCartItems([newItemList])
    //    await addToCartAPICall(newItemList)
    //    return
    //   }
    // if item in cart but not allowed to alter quantity
    if(isItemInCart(cartItems, productId) && options.preventDuplicate){
      enqueueSnackbar("Item already in cart.Use the cart sidebar to update quantity or remove item.", {variant:"warning"})
       return 
    }
    // when adding new item to cart
    if(!isItemInCart(cartItems, productId) &&  options.preventDuplicate){
      let  newItemList = {
        productId: productId,
        qty : qty
      }
      //console.log("here::")
     //setCartItems([newItemList])
     await addToCartAPICall(newItemList)
     return
    }
    // if cart quantity is alter and item in cart   
    if (isItemInCart(cartItems, productId) && !options.preventDuplicate){
      //if cart item quantity zero remove it from cart by updating with new
      if(qty <= 0){
         
          //let updatedCart = cartItems.filter((item)=>item.productId !== productId)
          //setCartItems(newItemList)
          let updatedCart= {
            productId: productId,
            qty : qty
          }
          console.log(updatedCart, "last qty")
          await addToCartAPICall(updatedCart)
          return
      }
        let updatedItem = {
          productId: productId,
          qty : qty
        }
        // setCartItems((prev)=>prev.map((item)=> {
        //   if(item.productId === productId){
        //     item.qty= qty
        //   }
        //   return item;
        //   }) );
        await addToCartAPICall(updatedItem)
    }
      //console.log(newItemList)
  };
//follow up API
const addToCartAPICall = async (newItem)=>{
  const URL = `${config.endpoint}/cart`
  //console.log(newItem, "ALtering")
try{
   await axios.post(URL, JSON.stringify(newItem),
  {
    headers:{
      Authorization: `Bearer ${isLogin}`, 
      'Content-type': 'application/json',        
    },
  })
  await fetchCart(isLogin)
  // enqueueSnackbar("Product added to cart", { variant: "success" });
}
catch(error){
 // console.log(error)
  if (error.response && error.response.status >= 400) {
    // Handle errors based on status code or error object (if present)
    if (error.response.status === 404) {
      enqueueSnackbar("Product doesn't exist", { variant: "error" });
    } else {
      enqueueSnackbar("Failed to add product to cart", { variant: "error" });
    }
  } else {
    // Handle other unexpected errors
    enqueueSnackbar("An error occurred", { variant: "error" });
  }
}
}
// // perform api call for cart when cartaItems changes
// useEffect(()=>{
//  // console.log(cartItems, "Updated cart")
// },[cartItems])

useEffect(() => {
  setNotFound(false);
  setLoader(true);
 Promise.allSettled([
  performAPICall(),
  fetchCart(isLogin)
 ]).then(()=>{setLoader(false)}).catch(()=>{setNotFound(true)})
}, []);

return (
  <div>
    <Header >
      {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      <TextField
        className="search-desktop"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={(event) => (debounceSearch(event, timerId))}
        placeholder="Search for items/categories"
        name="search"
      />
    </Header>

    {/* Search view for mobiles */}
    <TextField
      className="search-mobile"
      size="small"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search color="primary" />
          </InputAdornment>
        ),
      }}
      onChange={(event) => (debounceSearch(event, timerId))}
      placeholder="Search for items/categories"
      name="search"
    />
    <Grid container>
      <Grid item className="product-grid" md={isLogin? 9:12} sm={12}>
        <Box className="hero">
          <p className="hero-heading">
            India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
            to your door step
          </p>
        </Box>
        {loader ?
          <Box className="loader">
            <CircularProgress />
            <span>Loading Products...</span>
          </Box> :
          notFound ?
            <Box className="not-found">
              <SentimentDissatisfied />
              <span>No products found</span>
            </Box> :
            <Grid container spacing={2} className="grid-container" >
              {products.map((product) => (
                <Grid item container xs={12} md={4} sm={6} lg={3} key={product._id}>
                  <ProductCard product={product}  products={products} handleAddToCart ={addToCart} cartItems = {cartItems}/>
                </Grid>
              ))}
            </Grid>}
      </Grid>
      <Grid item md={3} sm={12} >
       {
        isLogin && !loader &&
        <Box className= "cart-container">
          <Cart products= {products} cartItems ={cartItems} handleQuantity={addToCart}/>
       </Box>
       }
      </Grid>
    </Grid>
    <Footer />
  </div>
);
};
export default Products;
