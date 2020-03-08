import * as actionTypes from "./actionTypes";

const createPromise = (obj) => {

  return new Promise((resolve, reject) => {

    obj.resolve = () => resolve(true);
    obj.reject = (error) => reject(error);
  });
};

export const startViewUpdate = () => {
  return { type: actionTypes.START_VIEW_UPDATE };
};

export const noConnection = () => {
  return { type: actionTypes.NO_CONNECTION };
};

export const updateClosed = closed => {

  return {
    type: actionTypes.UPDATE_CLOSED,
    closed: closed
  };
};

export const updateUntied = untied => {

  return {
    type: actionTypes.UPDATE_UNTIED,
    untied: untied
  };
};

export const updateOpened = opened => {

  return {
    type: actionTypes.UPDATE_OPENED,
    opened: opened
  };
};

export const updatePrizes = prizes => {

  return {
    type: actionTypes.UPDATE_PRIZES,
    prizes: prizes
  };
};

export const closedError = error => {
  return { type: actionTypes.CLOSED_ERROR };
};

export const untiedError = error => {
  return { type: actionTypes.UNTIED_ERROR };
};

export const openedError = error => {
  return { type: actionTypes.OPENED_ERROR };
};

export const prizesError = error => {
  return { type: actionTypes.PRIZES_ERROR };
};

export const generalError = error => {

  console.log(error);
  return { type: actionTypes.GENERAL_ERROR };
};

export const processClosed = (txInput, txObj, fulfillPromiseClosed) => {

  return dispatch => {

    let closed = txInput.luckyBagTokenContract.methods
                 .balanceOf(txInput.defaultAccount)
                 .call(txObj);

    closed.then(res => {

      dispatch(updateClosed(res));
      fulfillPromiseClosed.resolve();
    })
    .catch(error => {

      dispatch(closedError(error));
      fulfillPromiseClosed.reject(error);
    });
  };
};

export const processUntied = (txInput, txObj, fulfillPromiseUntied) => {

  return dispatch => {

    let untied = txInput.luckyBagDrawContract.methods
                 .currentUntiedBagCount(txInput.defaultAccount)
                 .call(txObj);

    untied.then(res => {

      dispatch(updateUntied(res));
      fulfillPromiseUntied.resolve();
    })
    .catch(error => {

      dispatch(untiedError(error));
      fulfillPromiseUntied.reject(error);
    });
  };
};

export const processOpened = (txInput, txObj, fulfillPromiseOpened) => {

  return dispatch => {

    let opened = txInput.luckyBagDrawContract.methods
                 .openedBagCount(txInput.defaultAccount)
                 .call(txObj);

    opened.then(res => {

      dispatch(updateOpened(res));
      fulfillPromiseOpened.resolve();
    })
    .catch(error => {

      dispatch(openedError(error));
      fulfillPromiseOpened.reject(error);
    });
  };
};

export const processPrizes = (txInput, txObj, fulfillPromisePrizes) => {

  return dispatch => {

    let prizesLength = txInput.luckyBagDrawContract.methods
                       .getPrizeRecordLength(txInput.defaultAccount)
                       .call(txObj);

    prizesLength.then(async len => {

      let prizes = [];

      for (let i = 0; i < len; i++) {

        try {

          let prizeRecord = await txInput.luckyBagDrawContract.methods
                                  .prizeRecord(txInput.defaultAccount,
                                               i)
                                  .call(txObj);

          prizes.push(prizeRecord);

        } catch(error) {

          dispatch(prizesError(error));
          fulfillPromisePrizes.reject(error);
          return;
        }
      }

      dispatch(updatePrizes(prizes));
      fulfillPromisePrizes.resolve();
    })
    .catch(error => {

      dispatch(prizesError(error));
      fulfillPromisePrizes.reject(error);
      return;
    });
  };
};

export const updateBags = (providerIsSet, waiting, txInput) => {

  return dispatch => {

    if (waiting) { return; }
    console.log("updateBags() triggered");
    dispatch(startViewUpdate());

    if (!providerIsSet) {

      dispatch(noConnection());
      return;
    }

    const defaultTxObj = {
      from: txInput.defaultAccount,
      gasPrice: txInput.gasPrice
    };

    let fulfillPromiseClosed = {};
    let fulfillPromiseUntied = {};
    let fulfillPromiseOpened = {};
    let fulfillPromisePrizes = {};

    let resultClosed = createPromise(fulfillPromiseClosed);
    let resultUntied = createPromise(fulfillPromiseUntied);
    let resultOpened = createPromise(fulfillPromiseOpened);
    let resultPrizes = createPromise(fulfillPromisePrizes);

    let allResults = Promise.all([resultClosed,
                                  resultUntied,
                                  resultOpened,
                                  resultPrizes]);

    dispatch(processClosed(txInput, defaultTxObj, fulfillPromiseClosed));
    dispatch(processUntied(txInput, defaultTxObj, fulfillPromiseUntied));
    dispatch(processOpened(txInput, defaultTxObj, fulfillPromiseOpened));
    dispatch(processPrizes(txInput, defaultTxObj, fulfillPromisePrizes));

    return allResults;
  };
};

export const startUntieBag = () => {
  return { type: actionTypes.START_UNTIE_BAG };
};

export const startOpenBag = () => {
  return { type: actionTypes.START_OPEN_BAG };
};

export const untieBagSuccess = () => {

  console.log("Untie Lucky Bag transaction successfully sent and pending...");
  return { type: actionTypes.UNTIE_BAG_SUCCESS };
};

export const openBagSuccess = () => {

  console.log("Open Lucky Bag transaction successfully sent and pending...");
  return { type: actionTypes.OPEN_BAG_SUCCESS };
};

export const untieBagFail = error => {

  console.log(error);
  return { type: actionTypes.UNTIE_BAG_FAIL };
};

export const openBagFail = error => {

  console.log(error);
  return { type: actionTypes.OPEN_BAG_FAIL };
};

export const processUntieBag = (txInput, txObj) => {

  return async dispatch => {

    try {
      await txInput.luckyBagDrawContract.methods.primeRNG().send(txObj);
    } catch(error) {

      dispatch(untieBagFail(error));
      return;
    }

    let untieBag = txInput.luckyBagDrawContract.methods.untieBag().send(txObj);

    untieBag.then(
      res => { dispatch(untieBagSuccess()); },
      error => { dispatch(untieBagFail(error)); }
    );
  };
};

export const processOpenBag = (txInput, txObj) => {

  return async dispatch => {

    try {

      await txInput.luckyBagDrawContract.methods.primeRNG().send(txObj);
      await txInput.luckyBagDrawContract.methods.primeRNG().send(txObj);
      await txInput.luckyBagDrawContract.methods.primeRNG().send(txObj);

    } catch(error) {

      dispatch(openBagFail(error));
      return;
    }

    let openBag = txInput.luckyBagDrawContract.methods.openBag().send(txObj);

    openBag.then(

      res => { dispatch(openBagSuccess()); },
      error => { dispatch(openBagFail(error)); }
    );
  };
};

export const noBagsToUntie = () => {
  return { type: actionTypes.NO_BAGS_TO_UNTIE };
};

export const noBagsToOpen = () => {
  return { type: actionTypes.NO_BAGS_TO_OPEN };
};

export const untieBag = (providerIsSet, waiting, txInput) => {

  return dispatch => {

    if (waiting) { return; }
    console.log("untieBag() triggered");
    dispatch(startUntieBag());

    if (!providerIsSet) {

      dispatch(noConnection());
      return;
    }

    const defaultTxObj = {
      from: txInput.defaultAccount,
      gasPrice: txInput.gasPrice
    };

    dispatch(processUntieBag(txInput, defaultTxObj));
  };
};

export const openBag = (providerIsSet, waiting, txInput) => {

  return dispatch => {

    if (waiting) { return; }
    console.log("openBag() triggered");
    dispatch(startOpenBag());

    if (!providerIsSet) {

      dispatch(noConnection());
      return;
    }

    const defaultTxObj = {
      from: txInput.defaultAccount,
      gasPrice: txInput.gasPrice
    };

    dispatch(processOpenBag(txInput, defaultTxObj));
  };
};
