import * as actionTypes from "../actions/actionTypes";

const initialState = {
  closed: null,
  untied: null,
  opened: null,
  prizes: [],
  closedWaiting: false,
  untiedWaiting: false,
  openedWaiting: false,
  prizesWaiting: false,
  connectError: false,
  closedError: false,
  untiedError: false,
  openedError: false,
  prizesError: false,
  generalError: false,
  untieWaiting: false,
  openWaiting: false,
  untieError: false,
  openError: false,
  manageBagsMsg: ""
};

const startViewUpdate = (state, action) => {

  return {
    ...state,
    closedWaiting: true,
    untiedWaiting: true,
    openedWaiting: true,
    prizesWaiting: true,
    connectError: false,
    closedError: false,
    untiedError: false,
    openedError: false,
    prizesError: false,
    generalError: false,
    manageBagsMsg: ""
  };
};

const updateClosed = (state, action) => {

  return {
    ...state,
    closed: action.closed,
    closedWaiting: false
  };
};

const updateUntied = (state, action) => {

  return {
    ...state,
    untied: action.untied,
    untiedWaiting: false
  };
};

const updateOpened = (state, action) => {

  return {
    ...state,
    opened: action.opened,
    openedWaiting: false
  };
};

const updatePrizes = (state, action) => {

  return {
    ...state,
    prizes: [...action.prizes],
    prizesWaiting: false
  };
};

const noConnection = (state, action) => {

  return {
    ...state,
    closedWaiting: false,
    untiedWaiting: false,
    openedWaiting: false,
    prizesWaiting: false,
    untieWaiting: false,
    openWaiting: false,
    connectError: true,
    manageBagsMsg: "Not connected.  To connect, log in to Metamask."
  };
};

const closedError = (state, action) => {

  return {
    ...state,
    closedWaiting: false,
    closedError: true
  };
};

const untiedError = (state, action) => {

  return {
    ...state,
    untiedWaiting: false,
    untiedError: true
  };
};

const openedError = (state, action) => {

  return {
    ...state,
    openedWaiting: false,
    openedError: true
  };
};

const prizesError = (state, action) => {

  return {
    ...state,
    prizesWaiting: false,
    prizesError: true
  };
};

const generalError = (state, action) => {

  return {
    ...state,
    closedWaiting: false,
    untiedWaiting: false,
    openedWaiting: false,
    prizesWaiting: false,
    untieWaiting: false,
    openWaiting: false,
    generalError: true
  };
};

const startUntieBag = (state, action) => {

  return {
    ...state,
    untieWaiting: true,
    connectError: false,
    untieError: false,
    manageBagsMsg: ""
  };
};

const startOpenBag = (state, action) => {

  return {
    ...state,
    openWaiting: true,
    connectError: false,
    openError: false,
    manageBagsMsg: ""
  };
};

const untieBagSuccess = (state, action) => {

  return {
    ...state,
    untieWaiting: false,
    manageBagsMsg: "Untie Lucky Bag transaction successfully sent and pending..."
  };
};

const openBagSuccess = (state, action) => {

  return {
    ...state,
    openWaiting: false,
    manageBagsMsg: "Open Lucky Bag transaction successfully sent and pending..."
  };
};

const untieBagFail = (state, action) => {

  return {
    ...state,
    untieWaiting: false,
    untieError: true,
    manageBagsMsg: "Untie Lucky Bag transaction failed.  See browser console for details."
  };
};

const openBagFail = (state, action) => {

  return {
    ...state,
    openWaiting: false,
    openError: true,
    manageBagsMsg: "Open Lucky Bag transaction failed.  See browser console for details."
  };
};

const noBagsToUntie = (state, action) => {

  return {
    ...state,
    untieWaiting: false,
    manageBagsMsg: "No closed Lucky Bags available to untie."
  };
};

const noBagsToOpen = (state, action) => {

  return {
    ...state,
    openWaiting: false,
    manageBagsMsg: "No untied Lucky Bags available to open.  Try untying a Lucky Bag first."
  };
};

const reducer = (state = initialState, action) => {

  switch (action.type) {

    case actionTypes.START_VIEW_UPDATE: return startViewUpdate(state, action);
    case actionTypes.UPDATE_CLOSED: return updateClosed(state, action);
    case actionTypes.UPDATE_UNTIED: return updateUntied(state, action);
    case actionTypes.UPDATE_OPENED: return updateOpened(state, action);
    case actionTypes.UPDATE_PRIZES: return updatePrizes(state, action);
    case actionTypes.NO_CONNECTION: return noConnection(state, action);
    case actionTypes.CLOSED_ERROR: return closedError(state, action);
    case actionTypes.UNTIED_ERROR: return untiedError(state, action);
    case actionTypes.OPENED_ERROR: return openedError(state, action);
    case actionTypes.PRIZES_ERROR: return prizesError(state, action);
    case actionTypes.GENERAL_ERROR: return generalError(state, action);
    case actionTypes.START_UNTIE_BAG: return startUntieBag(state, action);
    case actionTypes.START_OPEN_BAG: return startOpenBag(state, action);
    case actionTypes.UNTIE_BAG_SUCCESS: return untieBagSuccess(state, action);
    case actionTypes.OPEN_BAG_SUCCESS: return openBagSuccess(state, action);
    case actionTypes.UNTIE_BAG_FAIL: return untieBagFail(state, action);
    case actionTypes.OPEN_BAG_FAIL: return openBagFail(state, action);
    case actionTypes.NO_BAGS_TO_UNTIE: return noBagsToUntie(state, action);
    case actionTypes.NO_BAGS_TO_OPEN: return noBagsToOpen(state, action);
    default: return state;
  }
};

export default reducer;
