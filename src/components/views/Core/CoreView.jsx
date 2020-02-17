import React from 'react'

import Context from '../../../Context';
import Upload from '../../Upload';
import Processes from '../../Processes';
import Cpu from '../../Cpu';
import Header from '../../Header';

const CoreView = () => (
  <Context.Consumer>
    {
      ({ processes }) => {
        if (!processes.length) {
          return (
            <Upload />
          )
        }
        return (
          <>
            <Header />
            <Processes />
            <Cpu />
          </>
        );
      }
    }
  </Context.Consumer>
);

export default CoreView;
