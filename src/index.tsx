import debug from 'debug';
import * as React from 'react';
import {render} from 'react-dom';
import App from './App';
import './styles/style.css';

if (process.env.NODE_ENV !== 'production') {
    debug.enable('* -engine* -socket* -RIE* *WARN* *ERROR*');
}

render(<App />, document.getElementById('root'));
