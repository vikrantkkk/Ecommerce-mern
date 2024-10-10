const Product = require("../models/product.model");
const redis = require("../lib/redis");
const cloudinary = require("../lib/cloudnary");

exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getFeaturedProduct = async (req, res) => {
  try {
    const isFeaturedProduct = await redis.get("isFeaturedProduct");
    if (!isFeaturedProduct) {
      // .lean() is gonna return a plain javascript object instead of a mongodb document
      // which is good for performance
      const featuredProducts = await Product.find({ isFeatured: true }).lean();
      await redis.set("isFeaturedProduct", JSON.stringify(featuredProducts));
      return res.status(200).json({ featuredProducts });
    }
    const featuredProducts = JSON.parse(isFeaturedProduct);
    res.status(200).json({ featuredProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createProduct = async (res, req) => {
  try {
    const { name, discription, price, category, image } = req.body;
    if (!(name && discription && price && category && image)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let cloudinary = null;
    if (image) {
      cloudinary = await cloudinary.uplaoder.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      discription,
      price,
      category,
      image: cloudinary ? cloudinary.secure_url : null,
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: "Product id is required" });
    }
    const product = await Product.findById(productId);
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRecommendedProduct = async (req, res) => {
  try {
    const recemmendedProduct = await Product.aggregate([
      { $sample: 4 },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
        },
      },
    ]);
    res.status(200).json({ recemmendedProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const categoryProduct = await Product.find({ categoryId });
    res.status(200).json({ categoryProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updateProduct = await product.save();
      await updateFeaturedProductCache();
      res
        .status(200)
        .json({ message: "Product updated successfully", updateProduct });
    } else {
      res.status(400).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function updateFeaturedProductCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("isFeaturedProduct", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log(error);
  }
}
