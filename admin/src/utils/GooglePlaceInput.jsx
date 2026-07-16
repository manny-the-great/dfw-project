import React, { useRef, useEffect } from 'react';

const GooglePlaceInput = ({ value, onChange, countryCode }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (!window.google || !window.google.maps || !window.google.maps.places) return;

        const options = {};
        if (countryCode) {
            options.componentRestrictions = { country: countryCode };
        }

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, options);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;

            onChange({
                location: place.formatted_address,
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng()
            });
        });
    }, [countryCode, onChange]);

    return (
        <input
            ref={inputRef}
            type="text"
            placeholder="Enter your location"
            className="form-control"
            // defaultValue={value}
            value={value}
            onInput={(e) =>
                onChange({
                    location: e.target.value,
                    latitude: "",
                    longitude: ""
                })
            }
        />
    );
};

export default GooglePlaceInput;