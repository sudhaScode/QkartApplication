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
        height="200"
        component="img"
        image={product.image}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="h5" color="text.primary">
          ${product.cost}
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions sx={{}}>
        <Button
          sx={{ backgroundColor: "#4caf50" }}
          fullWidth
          variant="contained"
        >
          {" "}
          <AddShoppingCartOutlined /> Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
