import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { isConstructorDeclaration } from "typescript";
import "./Cart.css";

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

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  // console.log(cartData, productsData)
  // filter based on the cartData
  const cartItemDetails = cartData.reduce((acc, item) => {
    const product = productsData.find(
      (product) => product._id === item.productId
    );
    if (product) {
      // let latestData =JSON.stringify(JSON.parse(product))
      product.qty = item.qty;
      product.productId = item.productId;
      acc.push(product);
    }
    return acc;
  }, []);

  return cartItemDetails;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  console.log(items)

  const totlaCartValue = items.reduce((acc,item)=>{
        acc += item.qty*item.cost
        return acc
  }, 0)
  return totlaCartValue

};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  const token = localStorage.getItem("token");
  const handlerAdd = () => {
    // console.log("updaet")
    handleAdd(token);
  };
  const handlerDelete = () => {
    handleDelete(token);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      className="itemquantity-container"
    >
      <IconButton
        
        color="primary"
        onClick={() => {
          handlerDelete();
        }}
      >
        <RemoveOutlined className="alter-icon" />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton
      
        color="primary"
        onClick={() => {
          handlerAdd();
        }}
      >
        <AddOutlined className="alter-icon" />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * 
 * 
 category: "Fashion"
cost:50
image:"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/42d4d057-8704-4174-8d74-e5e9052677c6.png"
name:"UNIFACTOR Mens Running Shoes"
rating:5
_id:"BW0jAAeDJmlZCF8i"
 */
const Cart = ({ products, cartItems, handleQuantity }) => {
  const [cartItemsDetails, setCartItemsDetails] = useState([]);
  // let history = useHistory();

  useEffect(() => {
    setCartItemsDetails(generateCartItemsFrom(cartItems, products));
  }, [products, cartItems]);

  if (!cartItems.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      {cartItemsDetails &&
      isReadOnly?
        cartItemsDetails.map((item) => (
          <Box
            display="flex"
            alignItems="flex-start"
            padding="1rem"
            key={item.productId}
          >
            <Box className="image-container">
              <img
                src={item.image}
                alt={item.name}
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{item.name}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                className="modifier-box"
              >
                <ItemQuantity
                  value={item.qty}
                  handleAdd={async (token) => {
                    await handleQuantity(
                      token,
                      cartItems,
                      products,
                      item.productId,
                      item.qty + 1
                    );
                  }}
                  handleDelete={async (token) => {
                    await handleQuantity(
                      token,
                      cartItems,
                      products,
                      item.productId,
                      item.qty - 1
                    );
                  }}
                />
                <Box padding="0.5rem" fontWeight="700">
                  ${item.cost * item.qty}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      <Box className="cart" >
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(cartItemsDetails)}
          </Box>
        </Box>
       <Box display="flex" alignitmes="center" justifyContent="flex-end">
       {cartItemsDetails && 
        <Button color="success"  variant="contained" sx={{ margin: '1rem', backgroundColor: "#4caf80"}}
        onClick={()=>{}}>
          <ShoppingCart/>
          {"checkout".toUpperCase()}
        </Button>}
       </Box>
      </Box>
    </>
  );
};

export default Cart;
