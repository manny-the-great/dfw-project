import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMapContext } from "./GoogleMapProvider";
 
const containerStyle = {
  width: "100%",
  height: "400px",
};
 
const ViewMap = ({ lat, lng }) => {
  const { isLoaded, loadError } = useGoogleMapContext();
  const center = {
    lat: parseFloat(lat) || 0,
    lng: parseFloat(lng) || 0,
  };
 
  if (!isLoaded) return <div>Loading map...</div>;
  if (loadError) return <p>Map cannot be loaded right now.</p>;
 
  return (
    <GoogleMap
      key={`${center.lat}-${center.lng}`}
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
    >
      <Marker position={center} />
    </GoogleMap>
  );
};
 
export default ViewMap;

// import React, { useEffect, useState } from 'react';
// import { GoogleMap, Marker } from '@react-google-maps/api';
// import { useGoogleMaps } from './GoogleMapProvider';

// const containerStyle = {
//     width: '100%',
//     height: '400px'
// };

// const ViewMap = ({ lat, lng }) => {
//     const { isLoaded } = useGoogleMaps();
//     const [isDomReady, setIsDomReady] = useState(false);

//     useEffect(() => {
//         setIsDomReady(true);
//     }, []);

//     const center = {
//         lat: parseFloat(lat),
//         lng: parseFloat(lng)
//     };

//     const isValidCoords = !isNaN(center.lat) && !isNaN(center.lng);

//     if (!isDomReady || !isLoaded || !isValidCoords) {
//         return <div className="text-gray-500 text-sm">Loading map...</div>;
//     }

//     return (
//         <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
//             <Marker position={center} />
//         </GoogleMap>
//     );
// };

// export default ViewMap;




// import React from 'react';
// import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

// const containerStyle = {
//     width: '100%',
//     height: '400px'
// };

// const ViewMap = ({ lat, lng }) => {
//     const center = {
//         lat: parseFloat(lat) || 0,
//         lng: parseFloat(lng) || 0
//     };

//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
//     });

//     if (!isLoaded) return <div>Loading Map...</div>;

//     return (
//         <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={center}
//             zoom={14}
//         >
//             <Marker position={center} />
//         </GoogleMap>
//     );
// };

// export default ViewMap;
