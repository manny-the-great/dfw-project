import React, { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GoogleMapContext = createContext();

export const GoogleMapProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  return (
    <GoogleMapContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapContext.Provider>
  );
};

export const useGoogleMapContext = () => useContext(GoogleMapContext);

