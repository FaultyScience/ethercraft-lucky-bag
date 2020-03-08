import React from "react";

import ethercraftLogo from "../../assets/images/ETHERCRAFT.png";
import classes from "./Logo.module.css";

const logo = () => (
  <a href="/"><img src={ethercraftLogo} alt="logo" className={classes.logoImg} /></a>
);

export default logo;
