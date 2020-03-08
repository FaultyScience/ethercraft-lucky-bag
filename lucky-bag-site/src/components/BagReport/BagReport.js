import React from "react";

import * as messages from "../../store/messages";
import classes from "./BagReport.module.css";
import Spinner from "../Spinner/Spinner";

const bagReport = (props) => {

  const wrapJsx = (text, val) => {

    return (

      <div>
        <p>{text}:&nbsp;</p>
        {val}
      </div>
    );
  };

  let closed = props.closed === null ? "-" : props.closed;
  closed = props.closedWaiting ? <Spinner /> : closed;
  closed = props.closedError ? messages.SHORT_ERROR_MSG : closed;
  let untied = props.untied === null ? "-" : props.untied;
  untied = props.untiedWaiting ? <Spinner /> : untied;
  untied = props.untiedError ? messages.SHORT_ERROR_MSG : untied;
  let opened = props.opened === null ? "-" : props.opened;
  opened = props.openedWaiting ? <Spinner /> : opened;
  opened = props.openedError ? messages.SHORT_ERROR_MSG : opened;
  let prizesMsg = props.prizes.length === 0 ? "-" : "";
  prizesMsg = props.prizesWaiting ? <Spinner /> : prizesMsg;
  prizesMsg = props.prizesError ? messages.SHORT_ERROR_MSG : prizesMsg;

  let prizeList = (

    <ul>
      {props.prizes.map((prize, idx) => (
        <li key={idx}>{prize}</li>
      ))}
    </ul>
  );

  let closedEl = wrapJsx("Closed Bags", closed);
  let untiedEl = wrapJsx("Untied Bags", untied);
  let openedEl = wrapJsx("Opened Bags", opened);
  let prizesEl = wrapJsx("My Prizes", prizesMsg);

  return (

    <div className={classes.BagReport}>
      {closedEl}
      {untiedEl}
      {openedEl}
      {prizesEl}
      {prizeList}
    </div>
  );
};

export default bagReport;
