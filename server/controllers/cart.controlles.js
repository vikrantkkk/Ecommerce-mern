const Product = require("../models/product.model");

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user;
    const existCartProduct = await user.cartItem.find(
      (item) => (item._id = productId)
    );
    if (existCartProduct) {
      existCartProduct.quantity += 1;
    } else {
      user.cartItem.push({ product: productId });
    }
    await user.save();
    res
      .status(201)
      .json({ message: "Cart created successfully" }, user.cartItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCartProducts = async (req, res) => {
    //todo we will disscuss laterF
  try {
    const products = await Product.find({ $in: req.user.cartItem });
    //add quantity for each item
    const cartItem = products.map((product) => {
      const item = req.user.cartItem.find(
        (item) => item.product === product._id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.status(200).json({ cartItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeAllfromCart = async (req, res) => {
  try {
    const productId = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItem = [];
    } else {
      user.cartItem = user.cartItem.filter((item) => item._id !== productId);
    }
    await user.save();
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const user = req.user;
    const quantity = req.body;
    const prouctId = req.params;
    const existingItem = user.cartItem.find((item) => item._id === prouctId);
    if (existingItem) {
      if ((quantity = 0)) {
        user.cartItem = user.cartItem.filter((item) => item._id !== prouctId);
        await user.save();
        res.status(200).json({ message: "Cart updated successfully" });
      }
      existingItem.quantity = quantity;
      await user.save();
      res.status(200).json({ message: "Cart updated successfully" });
    } else {
      res.status(400).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
