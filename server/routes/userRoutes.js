const express = require('express');
const router = express.Router();
const authController = require('../controllers/userControllers/authController');
const contactUsController = require('../controllers/userControllers/contactUsController');
const cmsController = require("../controllers/userControllers/cmsController");
const dashboardController = require("../controllers/userControllers/dashboardController");
const userController = require("../controllers/userControllers/userController");
const addressController = require("../controllers/userControllers/addressController");
const serviceController = require("../controllers/userControllers/serviceController");
const notificationController = require("../controllers/userControllers/notificationController");
const orderController = require("../controllers/userControllers/orderController");
const stripeController = require("../controllers/userControllers/stripeController");
const deliveryChargesController = require("../controllers/userControllers/deliveryChargesController");
const { auth } = require('../middlewares/authMiddleware');

//stripe
router.get("/card_list", auth, stripeController.card_list);
router.post("/add_card", auth, stripeController.add_card);
router.get("/active_card", auth, stripeController.active_card);
router.delete("/remove_card/:cardId", auth, stripeController.remove_card);
router.post("/set_default_card", auth, stripeController.set_default_card);
//auth
router.post("/sign_up", authController.signup);
router.post("/verify_otp", authController.verify_otp);
router.post("/resend_otp", authController.resendOTP);
router.post("/login", authController.login);

//
router.get("/admin_details", userController.admin_details);

//user
router.get("/profile_details/:id", userController.profile_details);
router.put("/edit_profile", auth, userController.edit_profile);
router.put("/logout", auth, userController.logout);
//service-service-type
router.get("/service_list", serviceController.service_list);
router.get("/service_type_list/:service_id", auth, serviceController.service_type_list);

//notifications
router.get('/notification_list', auth, notificationController.notification_list);
router.put('/markAllAsRead', auth, notificationController.markAllAsRead);
router.get('/unread_notification_count', auth, notificationController.unread_notification_count);
router.delete('/clear_all_notifications', auth, notificationController.clear_all_notifications);

//order
// router.post("/add_card", auth, orderController.add_card);
router.post("/create_order", auth, orderController.create_order);
router.get("/order_list", auth, orderController.order_list);
router.get("/order_details/:id", auth, orderController.order_details);

//address
router.get("/address_list", auth, addressController.address_list);
router.post("/add_address", auth, addressController.add_address);
router.put("/update_address", auth, addressController.update_address);
router.delete("/delete_address/:id", auth, addressController.delete_address);
router.get("/address_details/:id", auth, addressController.address_details);

//deliver-charges
router.get("/get_delivery_charges", auth, deliveryChargesController.get_delivery_charges);
//cms
router.get("/getCms/:type", cmsController.getCms);
router.get("/get_dashboard_content", dashboardController.get_dashboard_content);

//contact us
router.post("/contact_Us", contactUsController.contact_Us);

module.exports = router;