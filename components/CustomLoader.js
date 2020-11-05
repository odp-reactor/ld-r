import React from 'react';
import Loader from 'react-loader-spinner';

const CustomLoader = props => (
    <Loader
        type="RevolvingDot"
        color="#2185d0"
        height={100}
        width={100}
    ></Loader>
);

export default CustomLoader;
