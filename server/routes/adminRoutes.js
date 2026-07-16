const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/authMiddleware');
const authController = require('../controllers/adminControllers/authController');
const cmsController = require('../controllers/adminControllers/cmsController');
const serviceController = require('../controllers/adminControllers/serviceController');
const userController = require('../controllers/adminControllers/userController');
const contactUsController = require('../controllers/adminControllers/contactUsController');
const orderController = require('../controllers/adminControllers/orderController');
const ratingController = require('../controllers/adminControllers/ratingController');
const transactionController = require('../controllers/adminControllers/transactionContoller');
const dashboardController = require('../controllers/adminControllers/dashboardController');
const notificationController = require('../controllers/adminControllers/notificationController');
const deliveryChargesController=require('../controllers/adminControllers/deliveryChargesController');

//dashboard
router.get('/dashboard_data', auth, dashboardController.dashboard_data);
router.get('/getMonthlyUserStats', auth, dashboardController.getMonthlyUserStats);
// //admin
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/adminProfile/:id', auth, authController.adminProfile);
router.put('/updateProfile/:id', auth, authController.updateProfile);
router.put('/updatePassword/:id', auth, authController.updatePassword);
router.get('/wallet_details', auth, authController.wallet_details);

//user
router.get('/user_list', auth, userController.user_list);
router.get('/view_user/:id', auth, userController.view_user);
router.put('/toggle_status/:id', auth, userController.toggle_status);
router.post('/add_sub_admin', auth, userController.add_sub_admin);
router.put('/edit_sub_admin/:id', auth, userController.edit_sub_admin);
router.delete('/delete_sub_admin/:id', auth, userController.delete_sub_admin);
// //order
router.get('/order_list', auth, orderController.order_list);
router.get('/view_order/:id', auth, orderController.view_order);
router.put('/update_order_status/:id', auth, orderController.update_order_status);
router.put('/update_order_location', auth, orderController.update_order_location);
//transaction
router.get('/get_transaction_list', auth, transactionController.get_transaction_list);

// //ratings
router.get('/get_rating_list', auth, ratingController.get_rating_list);
router.get('/view_rating/:id', auth, ratingController.view_rating);
router.post('/add_ratings', auth, ratingController.add_ratings);
router.put('/edit_ratings', auth, ratingController.edit_ratings);
router.delete('/delete_rating/:id', auth, ratingController.delete_dummy_rating)
//service-service-type
router.post('/add_service', auth, serviceController.add_service)
router.get('/service_list', auth, serviceController.service_list);
router.get('/view_service/:id', auth, serviceController.view_service);
router.put('/edit_service', auth, serviceController.edit_service);
router.delete('/delete_service/:id', auth, serviceController.delete_service);
router.post('/add_service_type', auth, serviceController.add_service_type)
router.get('/service_type_list', auth, serviceController.service_type_list);
router.put('/edit_service_type', auth, serviceController.edit_service_type);
router.delete('/delete_service_type/:id', auth, serviceController.delete_service_type);


//delivery charges
router.get('/get_deliveryFee', auth, deliveryChargesController.get_deliveryFee);
router.put('/update_deliveryFee', auth, deliveryChargesController.update_deliveryFee);

//customer support
router.get('/contactUs_list', auth, contactUsController.contactUs_list);
router.get('/view_contactUs/:id', auth, contactUsController.view_contactUs);
router.delete('/delete_contactUs/:id', auth, contactUsController.delete_contactUs);
//cms 
router.get('/getCms/:type', auth, cmsController.getCms);
router.put('/updateCms', auth, cmsController.updateCms);
router.post('/addCms', cmsController.addCms)

router.post('/sendNotification', auth, notificationController.sendNotification);

module.exports = router;