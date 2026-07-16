import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import { Store } from "./redux/store.js";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { GoogleMapProvider } from "./utils/GoogleMapProvider";
import { SocketProvider } from "./utils/SocketProvider"

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        // console.log("Service Worker registered:", registration.scope);
      })
      .catch((error) => {
        // console.log("Service Worker registration failed:", error);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleMapProvider>
      <BrowserRouter basename='/'>
        <Provider store={Store}>
          <SocketProvider>
            <App />
          </SocketProvider>
        </Provider>
      </BrowserRouter>
    </GoogleMapProvider>
  </StrictMode>
)
