import React, { createContext, useState } from 'react';

import scheduelings from './constants/scheduelings';

const Context = createContext();

const Provider = ({ children }) => {
  const [processes, setProcesses] = useState([]);
  const [originalQuantum, setOriginalQuantum] = useState(5);
  const [schedueling, setSchedueling] = useState(scheduelings.RR);
  const [quantum, setQuantum] = useState(originalQuantum);
  const [pageNumber, setPageNumber] = useState(undefined);
  const [actualTime, setActualTime] = useState(undefined);
  const [processCount, setProcessesCount] = useState(undefined);
  const [ready, setReady] = useState([]);
  const [running, setRunning] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [finished, setFinished] = useState([]);
  const setColumns = (newProcesses) => {
    const newReady = [];
    const newRunning = [];
    const newBlocked = [];
    const newFinished = [];
    newProcesses.forEach((process) => {
      if (Number(process.status) === 3) {
        newReady.push(process);
      } else if (Number(process.status) === 1) {
        newRunning.push(process);
      } else if (Number(process.status) === 2) {
        newBlocked.push(process);
      } else {
        newFinished.push(process);
      }
    });
    setReady(newReady);
    setRunning(newRunning);
    setBlocked(newBlocked);
    setFinished(newFinished);
    setProcesses(newProcesses)
  };

  const value = {
    processes,
    setProcesses: (newProcesses) => setProcesses(newProcesses),
    setColumns: (newProcesses) => setColumns(newProcesses),
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
    ready,
    setReady: (newReady) => {
      let sortedReady = newReady;
      if (schedueling === scheduelings.FIFO) {
        sortedReady = ready.sort((a, b) => a.entryTime - b.entryTime);
      } else if (schedueling === scheduelings.SRT) {
        sortedReady = newReady.sort((a, b) => a.remainingCpu - b.remainingCpu);
      } else if (schedueling === scheduelings.HRRN) {
        sortedReady = ready.sort((a, b) => {
          b.aging = actualTime - b.entryTime - b.assignedCpu;
          a.aging = actualTime - a.entryTime - a.assignedCpu;
          return b.aging - a.aging;
        });
        console.log(sortedReady)
      }
      setReady(sortedReady);
    },
    running,
    setRunning: (newRunning) => setRunning(newRunning),
    blocked,
    setBlocked: (newBlocked) => setBlocked(newBlocked),
    finished,
    setFinished: (newFinished) => setFinished(newFinished),
    schedueling,
    setSchedueling: (newSchedueling) => {
      if (newSchedueling === scheduelings.FIFO) {
        const newReady = ready.sort((a, b) => a.entryTime - b.entryTime);
        setReady(newReady);
      } else if (newSchedueling === scheduelings.SRT) {
        const newReady = ready.sort((a, b) => a.remainingCpu - b.remainingCpu);
        setReady(newReady);
      } else if (newSchedueling === scheduelings.HRRN) {
        const newReady = ready.sort((a, b) => {
          b.aging = actualTime - b.entryTime - b.assignedCpu;
          a.aging = actualTime - a.entryTime - a.assignedCpu;
          return b.aging - a.aging;
        });
        console.log(newReady)
        setReady(newReady);
      }
      setSchedueling(newSchedueling)
    },
  }
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export default {
  Provider,
  Consumer: Context.Consumer,
};
