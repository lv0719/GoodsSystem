import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils'

const user = storageUtils.getUser();
memoryUtils.user = user;
//读取local中存取的user,保存到内存中
ReactDOM.render(<App />,
  document.getElementById('root')
);
