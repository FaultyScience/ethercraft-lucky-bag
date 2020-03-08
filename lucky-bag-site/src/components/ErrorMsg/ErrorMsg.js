import React from "react";

import classes from "./ErrorMsg.module.css";
import * as messages from "../../store/messages";

const errorMsg = (props) => {

  let msg = <p>&nbsp;</p>;

  if (props.connectionError) {

    if (props.mmInstalled) {
      msg = <p>{messages.CONNECT_ERROR_MSG}</p>;
    } else {

      msg = (

        <p>{messages.CONNECT_ERROR_MSG}
           You can install Metamask <a
                                      href="https://metamask.io/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >here</a>.</p>
      );
    }
  } else if (props.generalError) {
    msg = <p>{messages.TX_ERROR_MSG}</p>;
  } else if (props.manageBagsMsg !== "") {
    msg = <p>{props.manageBagsMsg}</p>;
  }

  return (

    <div className={classes.ErrorMsg}>
      {msg}
    </div>
  );
};

export default errorMsg;
