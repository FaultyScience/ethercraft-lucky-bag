import Web3 from "web3";

import * as actionTypes from "./actionTypes";
import LuckyBagToken from "../../contracts/LuckyBagToken.json";
import LuckyBagDraw from "../../contracts/LuckyBagDraw.json";

const LUCKY_BAG_TOKEN_ADDRESS = "0x2a3e12d9e577b67d675ed868d8c67a6b92bcbf1e";
const LUCKY_BAG_DRAW_ADDRESS = "0xbb32110ede4d6dcb100bc06cdadfe0c3aab20022";

export const setProviderStart = () => {
  return { type: actionTypes.SET_PROVIDER_START };
};

export const mmInstalled = () => {
  return { type: actionTypes.MM_INSTALLED };
};

export const setProviderSuccess = (
                                   account,
                                   luckyBagDrawContract,
                                   luckyBagTokenContract) => {

  console.log("Successfully connected.");
  console.log(account);

  return {
    type: actionTypes.SET_PROVIDER_SUCCESS,
    account: account,
    luckyBagDrawContract: luckyBagDrawContract,
    luckyBagTokenContract: luckyBagTokenContract
  };
};

export const setProviderFail = (error) => {

  if (error) { console.log(error); }
  return { type: actionTypes.SET_PROVIDER_FAIL };
};

export const setProvider = () => {

  return dispatch => {

    console.log("setProvider() triggered");
    dispatch(setProviderStart());

    let fulfillPromise = {};

    let result = new Promise((resolve, reject) => {

      fulfillPromise.resolve = () => resolve(true);
      fulfillPromise.reject = (error) => reject(error);
    });

    if (window.ethereum) {

      dispatch(mmInstalled());
      const web3Provider = new Web3(window.ethereum);

      const luckyBagDrawContract = new web3Provider.eth.Contract(
                                                    LuckyBagDraw.abi,
                                                    LUCKY_BAG_DRAW_ADDRESS);

      const luckyBagTokenContract = new web3Provider.eth.Contract(
                                                     LuckyBagToken.abi,
                                                     LUCKY_BAG_TOKEN_ADDRESS);

      window.ethereum.enable().then(account => {

        web3Provider.eth.defaultAccount = account[0];

        dispatch(setProviderSuccess(
                                    account[0],
                                    luckyBagDrawContract,
                                    luckyBagTokenContract));

        fulfillPromise.resolve();

      }).catch(error => {

        dispatch(setProviderFail());
        fulfillPromise.reject(error);
      });

    } else {

      dispatch(setProviderFail());
      fulfillPromise.reject("Metamask not detected.");
    }

    return result;
  };
};
