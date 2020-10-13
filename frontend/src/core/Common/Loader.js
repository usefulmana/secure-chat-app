import React, { useState, useEffect } from "react";
import './Loader.scss'

const Loader = ({ loading }) => {
    return loading && (
        <div className="loader-cont row JCC AIC">
            <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export default Loader