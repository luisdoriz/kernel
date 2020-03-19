import React from 'react';

import Core from './components/views/Core';
import "antd/dist/antd.css";
import './App.css';
import Context from './Context';

const App = () => {
  return (
    <Context.Provider>
      <Core />
    </Context.Provider>
  );
}

export default App;
