import React from 'react';
import './snackbar.scss';

const Snackbar = (props) => (<div className={props.show ? 'show': ''} id="snackbar">{props.children}</div>)

export default Snackbar;
