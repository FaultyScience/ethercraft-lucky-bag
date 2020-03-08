import React, { Component } from "react";

import * as messages from "../../store/messages";
import classes from "./Controls.module.css";

class Controls extends Component {

  createTxInput = () => {

    return {
      luckyBagDrawContract: this.props.luckyBagDrawContract,
      luckyBagTokenContract: this.props.luckyBagTokenContract,
      gasPrice: this.props.gasPrice,
      defaultAccount: this.props.defaultAccount
    };
  }

  viewBagsHandler = () => {

    if (this.props.waiting) { return; }

    let txInput = null;

    if (!this.props.providerIsSet) {

      setTimeout(() => {

        if (this.props.connectionWaiting) {
          this.props.onSetProviderFail(messages.CONNECT_ERROR_MSG);
        }
      }, 15000);

      this.props.onSetProvider().then(() => {

        txInput = this.createTxInput();

        try {

          let updateBags = this.props.onUpdateBags(this.props.providerIsSet,
                                                   this.props.waiting,
                                                   txInput);

          updateBags.then(null,
                          error => { console.log("Error has been logged."); });

        } catch(error) {
          this.props.onGeneralUpdateError(error);
        }

      })
      .catch(error => {

        console.log(error);
        this.props.onNoConnection();
      });

    } else {

      txInput = this.createTxInput();

      try {

        let updateBags = this.props.onUpdateBags(this.props.providerIsSet,
                                                 this.props.waiting,
                                                 txInput);

        updateBags.then(null,
                        error => { console.log("Error has been logged."); });

      } catch(error) {
        this.props.onGeneralUpdateError(error);
      }
    }
  }

  untieBag = () => {

    let txInput = this.createTxInput();

    let bagResult = this.props.onUpdateBags(this.props.providerIsSet,
                                            this.props.waiting,
                                            txInput);

    bagResult.then(() => {

      if (this.props.closed > 0) {

        this.props.onUntieBag(this.props.providerIsSet,
                              this.props.waiting,
                              txInput);
      } else {
        this.props.onNoBagsToUntie();
      }
    })
    .catch(error => {
      this.props.onGeneralUpdateError(error);
    });
  }

  untieBagHandler = () => {

    if (this.props.waiting) { return; }

    if (!this.props.providerIsSet) {

      setTimeout(() => {

        if (this.props.connectionWaiting) {
          this.props.onSetProviderFail(messages.CONNECT_ERROR_MSG);
        }
      }, 15000);

      this.props.onSetProvider().then(() => {
        this.untieBag();
      })
      .catch(error => {

        console.log(error);
        this.props.onNoConnection();
      });

    } else {
      this.untieBag();
    }
  }

  openBag = () => {

    let txInput = this.createTxInput();

    let bagResult = this.props.onUpdateBags(this.props.providerIsSet,
                                            this.props.waiting,
                                            txInput);

    bagResult.then(() => {

      if (this.props.untied > 0) {

        this.props.onOpenBag(this.props.providerIsSet,
                             this.props.waiting,
                             txInput);
      } else {
        this.props.onNoBagsToOpen();
      }
    })
    .catch(error => {
      this.props.onGeneralUpdateError(error);
    });
  }

  openBagHandler = () => {

    if (this.props.waiting) { return; }

    if (!this.props.providerIsSet) {

      setTimeout(() => {

        if (this.props.connectionWaiting) {
          this.props.onSetProviderFail(messages.CONNECT_ERROR_MSG);
        }
      }, 15000);

      this.props.onSetProvider().then(() => {
        this.openBag();
      })
      .catch(error => {

        console.log(error);
        this.props.onNoConnection();
      });

    } else {
      this.openBag();
    }
  }

  render() {

    return (

      <div className={classes.Controls}>
        <button onClick={this.viewBagsHandler}>View</button>
        <button onClick={this.untieBagHandler}>Untie Bag</button>
        <button onClick={this.openBagHandler}>Open Bag</button>
      </div>
    );
  }
}

export default Controls;
