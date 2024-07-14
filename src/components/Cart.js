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
  if (!cartData) {
    return;
  }
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
  // const cartItemDetails = cartData.map((item)=>({
  //   ...item,
  //   ...productsData.find((product)=>product._id === item.productId)})
  //   )
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
  // console.log(items)

  const totlaCartValue = items.reduce((acc, item) => {
    acc += item.qty * item.cost;
    return acc;
  }, 0);
  //console.log(totlaCartValue)
  return totlaCartValue;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Size }
 *    Number of items in the cart + quantity
 *
 */

export const getTotalItems=(items)=>{
  let size = items.reduce((acc,item)=>acc +=item.qty,0)
  return size;
}

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
const ItemQuantity = ({ isReadOnly, value, handleAdd, handleDelete }) => {
  const token = localStorage.getItem("token");
  const handlerAdd = async () => {
    // console.log("updaet")
    // setTimeout(
    await handleAdd(token); //, 1000)
  };
  const handlerDelete = async () => {
    //setTimeout(
    await handleDelete(token); //, 1000)
  };
  useEffect(() => {
    return () => {
      clearTimeout();
    };
  });
  return (
    <Stack
      direction="row"
      alignItems="center"
      className="itemquantity-container"
    >
      {isReadOnly ? (
        <Box padding="0.5rem" data-testid="item-qty">Qty: {value}</Box>
      ) : (
        <>
          {" "}
          <IconButton
            color="primary"
            onClick={() => {
              handlerDelete();
            }}
          >
            <RemoveOutlined />
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
            {" "}
            <AddOutlined />
          </IconButton>
        </>
      )}
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
const Cart = ({
  isReadOnly,
  hasCheckoutButton,
  products,
  cartItems,
  handleQuantity,
}) => {
  //const [cartItemsDetails, setCartItemsDetails] = useState([]);
  let history = useHistory();

  // useEffect(() => {
  //   setCartItemsDetails(generateCartItemsFrom(cartItems, products));
  // }, [products, cartItems]);
  let dynamicRoute = (path) => {
    history.push(path);
  };
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
      <Box className="cart">
        {cartItems &&
          cartItems.map((item) => (
            <Box
              display="flex"
              alignItems="flex-start"
              padding="1rem"
              cla
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
                    isReadOnly={isReadOnly?"readOnly":""}
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
                    ${item.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        <Box className="cart-footer">
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
              ${getTotalCartValue(cartItems)}
            </Box>
          </Box>
          <Box display="flex" alignitmes="center" justifyContent="flex-end">
            {hasCheckoutButton && (
              <Button
                color="success"
                variant="contained"
                className="checkout-btn"
                sx={{backgroundColor: "#4caf80" }}
                onClick={() => {
                  dynamicRoute("/checkout");
                }}
              >
                <ShoppingCart />
                {"checkout".toUpperCase()}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      {isReadOnly &&
        <Box padding="0.5rem" className="cart">
          <div className="order-header">Order Details</div>
          <Box direction="col"
            alignItems="center">
            <Stack direction="row" justifyContent="space-between" className="order-details" >
              <div>Products</div>
              <div>{getTotalItems(cartItems)}</div>
            </Stack >
            <Stack direction="row" justifyContent="space-between" className="order-details">
              <div>SubTotal</div>
              <div>${getTotalCartValue(cartItems)}</div>
            </Stack>
            <Stack direction="row" justifyContent="space-between" className="order-details">
              <div>Shipping Charges</div>
              <div>$0</div>
            </Stack>
            <Stack direction="row" justifyContent="space-between" className="order-total">
              <div>Total</div>
              <div>${getTotalCartValue(cartItems)}</div>
            </Stack>

          </Box>
        </Box>}
    </>
  );
};

export default Cart;
