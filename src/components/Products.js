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

const Products = () => {
  const [loader, setLoader] = useState(false);
  const [products, setProducts] = useState([])
  const [notFound, setNotFound] = useState(false);
  const [timerId, setTimerId] = useState(null);

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
    setNotFound(false);
    setLoader(true);
    try {
      const response = await axios(URL, { timeout: 3000 });

      if (response.status === 200) {
        setLoader(false)
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
  clearTimeout(debounceTimeout);
  const timer = setTimeout(() => performSearch(searchKeywords), 500);
  setTimerId(timer);
};
useEffect(() => {
  performAPICall();
}, []);

return (
  <div>
    <Header>
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
      <Grid item className="product-grid">
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
            <Grid container spacing={3} className="grid-container" >
              {products.map((product) => (
                <Grid item container xs={12} md={3} sm={6} lg={3} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>}
      </Grid>
    </Grid>
    <Footer />
  </div>
);
};
export default Products;
