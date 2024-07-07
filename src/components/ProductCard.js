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

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        height="120"
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
        >
          {" "}
          <AddShoppingCartOutlined /> Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
