import {
    FETCH_PROPERTIES_REQUEST,
    FETCH_PROPERTIES_SUCCESS,
    FETCH_PROPERTIES_FAILURE
  } from '../actions/properties';
  
  const initialState = {
    loading: false,
    properties: [],
    totalProperties: 0,
    error: ''
  };
  
  const propertiesReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_PROPERTIES_REQUEST:
        return {
          ...state,
          loading: true
        };
      case FETCH_PROPERTIES_SUCCESS:
        return {
          loading: false,
          properties: action.payload.properties,
          totalProperties: action.payload.totalProperties,
          error: ''
        };
      case FETCH_PROPERTIES_FAILURE:
        return {
          loading: false,
          properties: [],
          error: action.payload
        };
      default:
        return state;
    }
  };
  
  export default propertiesReducer;
  