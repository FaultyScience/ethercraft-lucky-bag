import React, { Component } from "react";

import classes from "./Transactions.module.css";
import Spinner from "../../components/Spinner/Spinner";
import successImg from "../../assets/images/success.png";
import failImg from "../../assets/images/fail.jpg";

class Transactions extends Component {

  createTx = (key, date, text, success) => {

    let src;

    if (success === "success") {
      src = successImg;
    } else if (success === "fail") {
      src = failImg;
    }

    let txEl = <img className={classes.TxImg} src={src} alt="tx_image" />;

    if (success === "pending") {
      // txEl = <Spinner />;
      txEl = null;
    }

    return (

      <div key={key}>
        <p>{date}: {text}</p>
        {txEl}
      </div>
    );
  }

  render() {

    let transaction1 = this.createTx(1,
                                     "2018-12-28 01:15:32 UTC",
                                     "Untie bag transaction failed",
                                     "fail");
    let transaction2 = this.createTx(2,
                                     "2018-12-28 01:17:01 UTC",
                                     "Untie bag transaction succeeded",
                                     "success");
    let transaction3 = this.createTx(3,
                                     "2018-12-28 01:17:58 UTC",
                                     "Open bag transaction failed",
                                     "fail");
    let transaction4 = this.createTx(4,
                                     "2019-01-30 15:00:32 UTC",
                                     "Untie bag transaction pending...",
                                     "pending");

    let transactions = (

        <div>
          {[transaction1, transaction2, transaction3, transaction4]}
        </div>
      );

    return (

      <div className={classes.Transactions}>
        <h1>Transactions</h1>
        {transactions}
      </div>
    );
  }
}

export default Transactions;
