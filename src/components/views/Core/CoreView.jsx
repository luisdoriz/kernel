import React, { useContext } from 'react'

import Context from '../../../Context';
import Upload from '../../Upload';
import Processes from '../../Processes';
import Cpu from '../../Cpu';
import Header from '../../Header';
import Memory from '../../Memory';

const CoreView = () => {
  const { processes } = useContext(Context.Consumer)
  if (!processes.length) {
    return (
      <Upload />
    )
  }
  console.log(processes)
  return (
    <div style={{ padding: 50 }}>
      <div className="header" >
        <Header />
      </div>
      <Processes />
      <Cpu />
      <Memory />
    </div>
  );
}
export default CoreView;
