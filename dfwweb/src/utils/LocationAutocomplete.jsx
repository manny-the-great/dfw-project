import React, { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMapContext } from "./GoogleMapProvider";

const LocationAutocomplete = ({
    placeholder = "Enter location",
    value,
    onChange
}) => {
    const [autocomplete, setAutocomplete] = useState(null);
    const { isLoaded, loadError } = useGoogleMapContext();

    const handlePlaceChanged = () => {
        if (!autocomplete) return;

        const place = autocomplete.getPlace();
        const selectedLocation = place.formatted_address || "";
        const lat = place.geometry?.location?.lat() || null;
        const lng = place.geometry?.location?.lng() || null;

        onChange({
            location: selectedLocation,
            latitude: lat,
            longitude: lng
        });
    };

    const handleInputChange = (e) => {
        const text = e.target.value;

        // Manual text delete / typing
        onChange({
            location: text,
            latitude: null,
            longitude: null
        });
    };

    if (!isLoaded) return <p>Loading Maps...</p>;
    if (loadError) return <p>Map cannot be loaded right now.</p>;

    // return (
    //     <Autocomplete
    //         onLoad={setAutocomplete}
    //         onPlaceChanged={handlePlaceChanged}
    //     >
    //         <input
    //             type="text"
    //             placeholder={placeholder}
    //             value={value}
    //             onChange={handleInputChange}
    //             className="w-full border border-gray-300 px-4 py-2 outline-none text-sm rounded"
    //         />
    //     </Autocomplete>
    // );
    return (
        <Autocomplete
            onLoad={setAutocomplete}
            onPlaceChanged={handlePlaceChanged}
        >
            <div className="w-full">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleInputChange}
                    className="w-full  px-4 py-2 outline-none text-sm rounded"
                />
            </div>
        </Autocomplete>
    );

};

export default LocationAutocomplete;




// import React, { useState } from "react";
// import { Autocomplete } from "@react-google-maps/api";
// import { useGoogleMapContext } from "./GoogleMapProvider";

// const LocationAutocomplete = ({
//     address,
//     setAddress,
//     setLatLng,
//     onLocationSelect,
// }) => {
//     const [autocomplete, setAutocomplete] = useState(null);
//     const { isLoaded, loadError } = useGoogleMapContext();

//     const handlePlaceChanged = () => {
//         if (autocomplete) {
//             const place = autocomplete.getPlace();
//             const selectedLocation = place.formatted_address;
//             const lat = place.geometry.location.lat();
//             const lng = place.geometry.location.lng();

//             if (onLocationSelect) {
//                 onLocationSelect({ address: selectedLocation, lat, lng });
//             }

//             setAddress(selectedLocation);
//             setLatLng({ lat, lng });
//         }
//     };

//     const handleInputChange = (e) => {
//         setAddress(e.target.value);
//         setLatLng({ lat: null, lng: null });
//     };

//     if (!isLoaded) return <p>Loading Maps...</p>;
//     if (loadError) return <p>Map cannot be loaded right now.</p>;

//     return (
//         <Autocomplete
//             onLoad={(auto) => setAutocomplete(auto)}
//             onPlaceChanged={handlePlaceChanged}
//         >
//             <input
//                 type="text"
//                 placeholder="Enter your address"
//                 value={address}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 px-4 py-2 outline-none text-sm rounded"
//             />
//         </Autocomplete>
//     );
// };

// export default LocationAutocomplete;