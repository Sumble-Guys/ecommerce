/**
 * Maps each JIRA ticket (KAN-79..KAN-123) to the list of file paths (relative to repo root) that implement that feature.
 * Derived from ticket title/description and codebase structure.
 * Shared base files (app, server, routes index) are included in every ticket so each branch is runnable.
 */
const path = require('path');

const BASE_FILES = [
  'backend/app.js',
  'backend/server.js',
  'backend/config/database.js',
  'backend/routes/index.js',
  'package.json',
];

const TICKET_FILES = {
  79: ['backend/controllers/authController.js', 'backend/routes/authRoutes.js', 'frontend/views/register.ejs', 'frontend/public/css/register.css', 'frontend/public/js/register.js'],
  80: ['backend/controllers/authController.js', 'backend/routes/authRoutes.js', 'frontend/views/login.ejs', 'frontend/views/img.ejs', 'frontend/public/css/login.css', 'frontend/public/js/login.js'],
  81: ['backend/routes/index.js'],
  82: ['backend/controllers/productController.js', 'backend/routes/productRoutes.js', 'frontend/views/ecommerce.ejs', 'frontend/public/css/ecommerce.css', 'frontend/public/js/ecommerce.js'],
  83: ['backend/controllers/productController.js', 'backend/routes/productRoutes.js', 'frontend/views/displayproduct.ejs', 'frontend/public/css/displayproduct.css'],
  84: ['backend/controllers/productController.js', 'backend/routes/productRoutes.js', 'frontend/views/ecommerce.ejs', 'frontend/public/js/ecommerce.js'],
  85: ['backend/controllers/productController.js', 'backend/routes/productRoutes.js', 'frontend/views/ecommerce.ejs', 'frontend/public/js/ecommerce.js'],
  86: ['backend/controllers/productController.js', 'backend/routes/productRoutes.js', 'frontend/views/ecommerce.ejs', 'frontend/public/js/ecommerce.js'],
  87: ['backend/controllers/productController.js', 'backend/routes/productRoutes.js', 'frontend/views/producer.ejs', 'frontend/public/css/producer.css'],
  88: ['backend/controllers/productController.js', 'backend/routes/userRoutes.js', 'frontend/views/registerlink.ejs', 'frontend/views/addnewproductuser.ejs', 'frontend/public/css/addnewproductuser.css'],
  89: ['backend/controllers/cartController.js', 'backend/routes/cartRoutes.js', 'frontend/views/cart.ejs', 'frontend/public/css/cart.css', 'frontend/public/js/cart.js'],
  90: ['backend/controllers/cartController.js', 'backend/routes/cartRoutes.js', 'frontend/views/cart.ejs', 'frontend/public/js/cart.js'],
  91: ['backend/controllers/cartController.js', 'backend/routes/cartRoutes.js', 'frontend/views/cart.ejs', 'frontend/public/js/cart.js'],
  92: ['backend/controllers/cartController.js', 'backend/routes/cartRoutes.js', 'frontend/views/cart.ejs', 'frontend/public/js/cart.js'],
  93: ['backend/controllers/cartController.js', 'backend/routes/cartRoutes.js', 'frontend/views/cart.ejs', 'frontend/views/thankyou.ejs', 'frontend/public/js/cart.js'],
  94: ['backend/controllers/cartController.js', 'backend/routes/cartRoutes.js', 'frontend/views/thankyou.ejs', 'frontend/public/css/thankyou.css', 'frontend/public/js/thankyou.js'],
  95: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/admin.ejs', 'frontend/public/css/admin.css', 'frontend/public/js/admin.js'],
  96: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/addnewproduct.ejs', 'frontend/public/css/addnewproduct.css'],
  97: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/addnewproduct.ejs', 'frontend/public/css/addnewproduct.css'],
  98: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/products.ejs', 'frontend/public/css/products.css'],
  99: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/update.ejs', 'frontend/public/css/update.css'],
  100: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/update.ejs', 'frontend/public/css/update.css'],
  101: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/delete.ejs', 'frontend/public/css/delete.css'],
  102: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/delete.ejs'],
  103: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/admin.ejs'],
  104: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/customers.ejs', 'frontend/public/css/customers.css'],
  105: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/totalorders.ejs', 'frontend/public/css/totalorders.css'],
  106: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/orders.ejs', 'frontend/public/css/orders.css'],
  107: ['backend/controllers/adminController.js', 'backend/routes/adminRoutes.js', 'frontend/views/favourites.ejs', 'frontend/public/css/favourites.css'],
  108: ['backend/controllers/userController.js', 'backend/routes/userRoutes.js', 'frontend/views/userdashboard.ejs', 'frontend/public/css/userdashboard.css', 'frontend/public/js/userdashboard.js'],
  109: ['backend/controllers/userController.js', 'backend/routes/userRoutes.js', 'frontend/views/userorders.ejs', 'frontend/public/css/userorders.css'],
  110: ['backend/controllers/userController.js', 'backend/routes/userRoutes.js', 'frontend/views/registerlink.ejs', 'frontend/views/addnewproductuser.ejs', 'frontend/public/css/addnewproductuser.css'],
  111: ['backend/controllers/userController.js', 'backend/routes/userRoutes.js', 'frontend/views/productstats.ejs', 'frontend/public/css/productstats.css'],
  112: ['backend/controllers/appointmentController.js', 'backend/routes/userRoutes.js', 'frontend/views/userappointments.ejs', 'frontend/public/css/userappointments.css'],
  113: ['backend/controllers/userController.js', 'backend/routes/index.js', 'frontend/views/address.ejs', 'frontend/public/css/address.css', 'frontend/public/js/address.js'],
  114: ['backend/controllers/appointmentController.js', 'backend/routes/appointmentRoutes.js', 'frontend/views/producer.ejs'],
  115: ['backend/jobs/appointmentCron.js', 'backend/models/Appointment.js'],
  116: ['backend/controllers/producerController.js', 'backend/routes/producerRoutes.js', 'frontend/views/producerNotifications.ejs'],
  117: ['backend/controllers/producerController.js', 'backend/routes/producerRoutes.js', 'backend/models/Producer.js'],
  118: ['backend/controllers/producerController.js', 'backend/routes/producerRoutes.js', 'frontend/views/addnewproductuser.ejs'],
  119: ['backend/controllers/wishlistController.js', 'backend/routes/wishlistRoutes.js', 'frontend/views/ecommerce.ejs', 'frontend/views/wishlist.ejs', 'frontend/public/css/wishlist.css'],
  120: ['backend/controllers/wishlistController.js', 'backend/routes/wishlistRoutes.js', 'frontend/views/wishlist.ejs', 'frontend/public/css/wishlist.css'],
  121: ['backend/controllers/wishlistController.js', 'backend/routes/wishlistRoutes.js', 'frontend/views/wishlist.ejs', 'frontend/public/css/wishlist.css'],
  122: ['backend/controllers/locationController.js', 'frontend/views/location.ejs', 'frontend/public/css/location.css', 'frontend/public/js/location.js'],
  123: ['backend/data/all_products.js', 'backend/server.js'],
};

function getFilesForTicket(jiraKey) {
  const num = parseInt(jiraKey.replace('KAN-', ''), 10);
  const list = TICKET_FILES[num];
  if (!list) return BASE_FILES;
  const combined = [...BASE_FILES, ...list];
  return [...new Set(combined)];
}

module.exports = { getFilesForTicket, BASE_FILES, TICKET_FILES };
