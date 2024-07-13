import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, products, handleAddToCart, cartItems  }) => {
 // console.log(handleAddToCart)
  const token =  localStorage.getItem("token")
  return (
    <Card className="card">
      <CardMedia
        height="170"
        component="img"
        image={product.image}
        title={product.name}
      />
      <CardContent className= "card-content">
        
          {/* <>
           <Typography gutterBottom variant="subtitle1" component="div">
          {product.name}
        </Typography>
        <Typography variant="h6" color="text.primary">
          ${product.cost}
        </Typography>
          </> */}
        <div> {product.name}</div>
       <p  style={{fontSize: "1rem"}}><strong>${product.cost}</strong></p>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions sx={{}}>
        <Button
          sx={{ backgroundColor: "#4caf80" }}
          fullWidth
          variant="contained"
          className = "card-button"
          onClick={()=>{
            
            let productId = product._id
            let qty = 1
            let options = { preventDuplicate: true }
            handleAddToCart(token,cartItems,products, productId, qty, options  )}}
        >
          {" "}
          <AddShoppingCartOutlined /> Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
