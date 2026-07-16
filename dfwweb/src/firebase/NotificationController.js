
import { messaging, getToken, onMessage } from "./firebase";
const VAPIDKEY = "BNj8br976ilfzFohwWfHwvik9k5vewYi9I33AEBcauOkRbjHE6c61ZlbUiObR1rJXn3rJOiDFSmnameTMmiW_mY";
export const requestForToken = () => {
    return getToken(messaging, { vapidKey: VAPIDKEY })
        .then((currentToken) => {
            if (currentToken) {
                // console.log("Current token for client:", currentToken);
                return currentToken;
            } else {
                // console.log("No registration token available. Request permission to generate one.");
            }
        })

        .catch((err) => {
            // console.log("An error occurred while retrieving token. ", err);
        });
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            // console.log("Message received. ", payload);
            const { title, message } = payload.data || {};
            if ("Notification" in window && Notification.permission === "granted") {
                const notification = new Notification(title || "DFWerrands", {
                    body: message || "You have a new notification",
                    icon: `https://app.dfwerrands.com/assets/favicon.png`,
                });
                notification.onclick = () => {
                    resolve({ ...payload, click: true });
                };
            }
        });
    });




export const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission !== "granted") {
        try {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                // console.log("Notification permission denied");
            }
        } catch (error) {
            // console.log("Error requesting notification permission:", error);
        }
    }
};