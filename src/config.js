export const BASE_URL = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    //development
    const URL = process.env.REACT_APP_DEVELOPMENT_URL;
    return URL;
  } else {
    // production code
    const URL = process.env.REACT_APP_PRODUCTION_URL;
    return URL;
  }
};
