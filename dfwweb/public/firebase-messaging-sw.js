
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDDQI_V2PQKc8EZzbf6O8Fx2FFKxbWKBqs",
  authDomain: "dfwerrand.firebaseapp.com",
  projectId: "dfwerrand",
  storageBucket: "dfwerrand.firebasestorage.app",
  messagingSenderId: "3759593254",
  appId: "1:3759593254:web:67f2c027e0102d000dd3e7"
};



const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload?.data?.title || "DFWerrands";

  const notificationOptions = {
    body: payload.data.message,
    icon: `https://app.dfwerrands.com/assets/favicon.png`,
    data: {
      type: payload?.data?.type || "general_notification"
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('push', function (event) {
  // Prevent browser from showing default push notification (like "site updated")
  event.stopImmediatePropagation();
});


self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const type = event.notification?.data?.type;
  let redirectionUrl = "/notification";
  switch (type) {
    case "order_notification":
      redirectionUrl = "/current-order";
      break;
    default:
      redirectionUrl = "/notification";
  }
  event.waitUntil(clients.openWindow(redirectionUrl));
});