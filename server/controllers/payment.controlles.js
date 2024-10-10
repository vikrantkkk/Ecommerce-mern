const Order = require("../models/order.model");
const Coupon = require("../models/coupon.model");
const { stripe } = require("../lib/stripe");

exports.createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array is required" });
    }
    let totalAmount = 0;
    const linesItem = products.map((product) => {
      //stripe want to send money in this format
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            imag: product.image,
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });
    let coupon = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
      const session = await stripe.checkout.sessions.create({
        paymen_method_types: ["card"],
        liens_item: linesItem,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
        discount: coupon
          ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
          : [],
        metadate: {
          userId: req.user._id.toString(),
          couponCode: couponCode || "",
          prouducts: JSON.stringify(
            products.map((p) => ({
              id: p._id.toString(),
              quantity: p.quantity,
              price: p.price,
            }))
          ),
        },
      });
      if (totalAmount >= 20000) {
        await createNewCoupon(req.user._id);
      }
      res.status(200).json({ id: session });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: session.metadata.couponCode },
          { isActive: false }
        );
      }
      //createa new order
      const products = jsom.parse(session.metadata.products);
      const newOrder = await Order.create({
        user: session.metadata.userId,
        products: products.map((p) => ({
          product: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
      });
      res.status(201).json({
        sucess: true,
        message: "Order created successfully",
        orderId: newOrder._id,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
    metadata: { userId },
  });
  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndUpdate({ userId }, { isActive: false });
  const newCoupon = await Coupon.create({
    code:
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
    discountPercentage: 10,
    expirationDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 30),
    userId: userId,
  });
  return newCoupon;
}
