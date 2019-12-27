class GoogleMaps {

    static autocompleteService = { current: null };
    static geocoder = { current: null };

    constructor() {
        if (!GoogleMaps.autocompleteService.current && window.google) {
            GoogleMaps.autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
        if (!GoogleMaps.geocoder.current && window.google) {
            GoogleMaps.geocoder.current = new window.google.maps.Geocoder();
        }
    }

    getPlacePredictions = (input, callback) => {
        if (!GoogleMaps.autocompleteService.current) {
            return undefined
        }
        GoogleMaps.autocompleteService.current.getPlacePredictions(input, callback);
    };


    geocode = (address) => {
        return new Promise((resolve, reject) => {
            if (!GoogleMaps.geocoder.current) {
                reject('geocoder undefined');
            }
            GoogleMaps.geocoder.current.geocode({ 'address': address }, (results, status) => {
                if (status === 'OK') {
                    resolve({
                        lat: results[0].geometry.location.lat(),
                        lon: results[0].geometry.location.lng()
                    });
                } else {
                    reject(`Geocode was not successful for the following reason: ${status}`);
                }
            });
        })
    };
}

export default GoogleMaps;