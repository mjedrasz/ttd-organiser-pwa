import { GoogleApiWrapper } from "google-maps-react";

const withMap = WrappedComponent => GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    language: 'en'
})(WrappedComponent);

export default withMap;