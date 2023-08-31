const express = require("express");
const connection = require("./config/db");
const Product = require("./models/product.model");
require("dotenv").config();
const cors = require("cors");
const ComboOffer = require("./models/comboOffer.model");
const Cart = require("./models/cart.model");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/getProduct", async (req, res) => {
  try {
    const allProducts = await Product.find();
    if (allProducts) return res.json(allProducts);
    else return res.send({ msg: "No Products available" });
  } catch (error) {
    return res.status(500).send({ error: "An error occurred" });
  }
});

app.post("/product", async (req, res) => {
  try {
    const data = req.body;

    let newProduct;
    if (data) {
      newProduct = new Product(data);
      await newProduct?.save();
      return res.send({ msg: "Success", data: newProduct });
    } else return res.send({ msg: "Please send some valid data" });
  } catch (error) {
    return res.send({ msg: "Catch Block", error });
  }
});

app.patch("/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.data;

    const updatedProduct = await Product.findByIdAndUpdate(productId, data, {
      new: true,
    });
    return res.send({ msg: "Success", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndRemove(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/getCombo", async (req, res) => {
  try {
    const comboOffersWithItems = await ComboOffer.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "comboItems",
          foreignField: "_id",
          as: "comboItemsInfo",
        },
      },
    ]);
    if (comboOffersWithItems) {
      return res.json(comboOffersWithItems);
    } else return res.send({ msg: "No Combo Available at this time" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/combo", async (req, res) => {
  try {
    const data = req.body;

    let newCombo;
    if (data) {
      newCombo = new ComboOffer(data);
      await newCombo?.save();
      return res.send({ msg: "Success", data: newCombo });
    } else return res.send({ msg: "Please send some valid data" });
  } catch (error) {
    return res.send({ msg: "Catch Block", error });
  }
});

app.patch("/combo/:id", async (req, res) => {
  try {
    const comboId = req.params.id;
    const data = req.body;

    const updatedCombo = await ComboOffer.findByIdAndUpdate(comboId, data, {
      new: true,
    });
    return res.send({ msg: "Success", data: updatedCombo });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.delete("/combo/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await ComboOffer.findByIdAndRemove(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/cart", async (req, res) => {
  try {
    const cartWithItems = await Cart.find()
      .populate({
        path: "cartProduct",
        model: "Product",
      })
      .populate({
        path: "cartCombo",
        model: "ComboOffer",
        populate: {
          path: "comboItems", // Assuming the field name is "comboItems"
          model: "Product",
        },
      });

    if (cartWithItems) {
      return res.json(cartWithItems);
    } else return res.send({ msg: "No Cart Data available" });
  } catch (error) {
    res.send({ msg: "Catch Block", error });
  }
});

app.post("/cartCheckAdd", async (req, res) => {
  const data = req.body;
  try {
    let cartWithItems = await Cart.find()
      .populate({
        path: "cartProduct",
        model: "Product",
      })
      .populate({
        path: "cartCombo",
        model: "ComboOffer",
        populate: {
          path: "comboItems", // Assuming the field name is "comboItems"
          model: "Product",
        },
      });

    let d;
    for (let i = 0; i < cartWithItems.length; i++) {
      if (cartWithItems[i].cartProduct?.name === data.name) {
        cartWithItems[i].quantity = Number(cartWithItems[i].quantity) + 1;
        await cartWithItems[i].save();
        d = await Cart.find()
          .populate({
            path: "cartProduct",
            model: "Product",
          })
          .populate({
            path: "cartCombo",
            model: "ComboOffer",
            populate: {
              path: "comboItems", // Assuming the field name is "comboItems"
              model: "Product",
            },
          });
      } else if (cartWithItems[i].cartCombo?.comboName === data.name) {
        cartWithItems[i].quantity = Number(cartWithItems[i].quantity) + 1;
        await cartWithItems[i].save();
        d = await Cart.find()
          .populate({
            path: "cartProduct",
            model: "Product",
          })
          .populate({
            path: "cartCombo",
            model: "ComboOffer",
            populate: {
              path: "comboItems", // Assuming the field name is "comboItems"
              model: "Product",
            },
          });
      }
    }

    if (d) {
      return res.send({ msg: "Quantity Added", data: d });
    } else return res.send({ msg: "No Cart data available" });
  } catch (error) {
    res.send({ msg: "Catch Block", error });
  }
});

app.post("/cartCheckReduce", async (req, res) => {
  const data = req.body;
  try {
    let cartWithItems = await Cart.find()
      .populate({
        path: "cartProduct",
        model: "Product",
      })
      .populate({
        path: "cartCombo",
        model: "ComboOffer",
        populate: {
          path: "comboItems", // Assuming the field name is "comboItems"
          model: "Product",
        },
      });

    let d;
    for (let i = 0; i < cartWithItems.length; i++) {
      if (cartWithItems[i].cartProduct?.name === data.name) {
        cartWithItems[i].quantity = Number(cartWithItems[i].quantity) - 1;
        await cartWithItems[i].save();
        d = await Cart.find()
          .populate({
            path: "cartProduct",
            model: "Product",
          })
          .populate({
            path: "cartCombo",
            model: "ComboOffer",
            populate: {
              path: "comboItems", // Assuming the field name is "comboItems"
              model: "Product",
            },
          });
      } else if (cartWithItems[i].cartCombo?.comboName === data.name) {
        cartWithItems[i].quantity = Number(cartWithItems[i].quantity) + 1;
        await cartWithItems[i].save();
        d = await Cart.find()
          .populate({
            path: "cartProduct",
            model: "Product",
          })
          .populate({
            path: "cartCombo",
            model: "ComboOffer",
            populate: {
              path: "comboItems", // Assuming the field name is "comboItems"
              model: "Product",
            },
          });
      }
    }

    if (d) {
      return res.send({ msg: "Quantity Reduced", data: d });
    } else return res.send({ msg: "No Cart data available" });
  } catch (error) {
    res.send({ msg: "Catch Block", error });
  }
});

app.post("/cart", async (req, res) => {
  try {
    const data = req.body;

    const newCart = new Cart(data);
    await newCart.save();
    res.send(newCart);
  } catch (error) {
    res.send({ msg: "Catch Block", error });
  }
});

app.delete("/cart/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedItem = await Cart.findByIdAndRemove(id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully", deletedItem });
  } catch (error) {
    res.send({ msg: "Catch Block", error });
  }
});

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("DB connected");
    console.log(`Server running at Port: ${process.env.port}`);
  } catch (error) {
    console.log(error);
  }
});
