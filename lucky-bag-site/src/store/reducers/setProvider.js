import * as actionTypes from "../actions/actionTypes";

const initialState = {
  providerIsSet: false,
  luckyBagDrawContract: null,
  luckyBagTokenContract: null,
  gasPrice: 5000000000,
  defaultAccount: null,
  connectionWaiting: false,
  connectionError: false,
  mmInstalled: false
};

const setProviderStart = (state, action) => {

  return {
    ...state,
    connectionWaiting: true,
    connectionError: false,
    mmInstalled: false
  };
};

const mmInstalled = (state, action) => {

  return {
    ...state,
    mmInstalled: true
  };
};

const setProviderSuccess = (state, action) => {

  return {
    ...state,
    providerIsSet: true,
    luckyBagDrawContract: action.luckyBagDrawContract,
    luckyBagTokenContract: action.luckyBagTokenContract,
    gasPrice: 5000000000,
    defaultAccount: action.account,
    connectionWaiting: false,
    connectionError: false
  };
};

const setProviderFail = (state, action) => {

  return {
    ...state,
    providerIsSet: false,
    connectionWaiting: false,
    connectionError: true
  };
};

const reducer = (state = initialState, action) => {

  switch (action.type) {

    case actionTypes.SET_PROVIDER_START: return setProviderStart(state, action);
    case actionTypes.MM_INSTALLED: return mmInstalled(state, action);
    case actionTypes.SET_PROVIDER_SUCCESS: return setProviderSuccess(state, action);
    case actionTypes.SET_PROVIDER_FAIL: return setProviderFail(state, action);
    default: return state;
  }
};

export default reducer;
