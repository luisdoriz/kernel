import React, { createContext, useState } from 'react';

import scheduelings from './constants/scheduelings';
import memoryAlgorithms from './constants/memoryAlgorithms';

const Context = createContext();

const Provider = ({ children }) => {
  const [processes, setProcesses] = useState([]);
  const [originalQuantum, setOriginalQuantum] = useState(5);
  const [schedueling, setSchedueling] = useState(scheduelings.RR);
  const [quantum, setQuantum] = useState(originalQuantum);
  const [pageNumber, setPageNumber] = useState(undefined);
  const [actualTime, setActualTime] = useState(undefined);
  const [blockCounter, setBlockCounter] = useState(0);
  const [processCount, setProcessesCount] = useState(undefined);
  const [memoryAlgorithm, setMemoryAlgorithm] = useState(memoryAlgorithms.FIFO);

  const value = {
    processes,
    setProcesses: (newProcesses) => setProcesses(newProcesses),
    pageNumber,
    setPageNumber: (newPageNumber) => setPageNumber(newPageNumber),
    actualTime,
    setActualTime: (newActualTime) => setActualTime(newActualTime),
    processCount,
    setProcessesCount: (newProcessCount) => setProcessesCount(newProcessCount),
    quantum,
    setQuantum: (newQuantum) => setQuantum(newQuantum),
    originalQuantum,
    setOriginalQuantum: (newOriginalQuantum) => setOriginalQuantum(newOriginalQuantum),
    schedueling,
    setSchedueling: (newSchedueling) => setSchedueling(newSchedueling),
    blockCounter,
    setBlockCounter: (count) => setBlockCounter(count),
    memoryAlgorithm,
    setMemoryAlgorithm: (memoryAlgorithm) => setMemoryAlgorithm(memoryAlgorithm),
  }
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export default {
  Provider,
  Consumer: Context,
};
