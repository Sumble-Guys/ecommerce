const connectDB = require("./config/database");
const app = require("./app");
const AllProduct = require("./models/AllProduct");
const all_products = require("./data/all_products");
const startAppointmentCron = require("./jobs/appointmentCron");

connectDB();

const updatedProducts = all_products.map((p) => ({
  producerid: p.producerID,
  imgUrl: p.imgURL,
  producername: p.name,
  name: p.productName,
  info: p.info,
  price: p.price,
  category: p.category,
}));

(async function seedProducts() {
  for (const updatedProduct of updatedProducts) {
    try {
      const existing = await AllProduct.findOne({ name: updatedProduct.name });
      if (!existing) {
        const newProduct = new AllProduct(updatedProduct);
        await newProduct.save();
      }
    } catch (err) {
      console.error(err);
    }
  }
})();

startAppointmentCron();

const PORT = process.env.PORT || 9002;
app.listen(PORT, () => {
  console.log(`BE started at port ${PORT}`);
});
