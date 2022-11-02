// import { useState } from "react";
import mylogo from "./my-logo.svg"


function Footer() {
  return (
    <footer>
        <p>Created by <span className="sr-only">Paco Romo</span><a href="https://pacoromo.ca"><img src={mylogo} alt="paco Romo logo" /></a> </p>
    </footer>
  )
}

export default Footer