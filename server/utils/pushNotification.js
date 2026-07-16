
const admin = require('firebase-admin');
const path = require('path');

admin.initializeApp({
    credential: admin.credential.cert(path.join(__dirname, 'dfwerrand-firebase-adminsdk-fbsvc-9b66a94482.json')),
});

// Function to send FCM Web Push Notification for Web (Browser)
async function sendWebPushNotification(deviceToken, notification_data) {
    try {

        const message = {
            // notification: {
            //     title: 'DFWerrands',
            //     body: notification_data.message,
            // },
            data: {
                senderId: notification_data?.senderId?.toString() || '',
                senderName: notification_data?.senderName?.toString() || '',
                senderImage: notification_data?.senderImage?.toString() || '',
                receiverId: notification_data?.receiverId?.toString() || '',
                type: notification_data?.type?.toString() || '',
                title: notification_data?.title || 'DFWerrands',
                message: notification_data?.message || '',
            },
            token: deviceToken,
        };

        const response = await admin.messaging().send(message);
        return response;
    } catch (error) {
        console.log("Error sending web push notification:", error);
        return null;
    }
}

async function pushNotification(deviceToken, notification_data) {
    await sendWebPushNotification(deviceToken, notification_data);  // Web Browser (FCM Web Push)
}

module.exports = {
    pushNotification,
};
