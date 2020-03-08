import React from "react";
import classes from "./Spinner.module.css";

const spinner = () => (

  <div className={classes["lds-spinner"]}>
    <div></div><div></div><div></div><div></div><div></div><div></div><div>
    </div><div></div><div></div><div></div><div></div><div></div>
  </div>
);

export default spinner;
