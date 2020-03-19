const sort = {
  'Round Robin': (processes) => {
    const orderedProcesses = processes.filter(process => process.status === 3);
    return orderedProcesses.sort((a, b) => a.entryTimeReady - b.entryTimeReady)
  },
  FIFO: (processes) => {
    const orderedProcesses = processes.filter(process => process.status === 3);
    return orderedProcesses.sort((a, b) => a.entryTime - b.entryTime)
  },
  SRT: (processes) => {
    const orderedProcesses = processes.filter(process => process.status === 3);
    return orderedProcesses.sort((a, b) => a.remainingCpu - b.remainingCpu)
  },
  HRRN: (processes, actualTime) => {
    const orderedProcesses = processes.filter(process => process.status === 3);
    return orderedProcesses.sort((a, b) => {
      b.aging = actualTime - b.entryTime - b.assignedCpu;
          a.aging = actualTime - a.entryTime - a.assignedCpu;
          return ((b.aging+b.remainingCpu)/b.remainingCpu) - ((a.aging+a.remainingCpu)/a.remainingCpu);
    })
  },
  block: (processes) => {
    const orderedProcesses = processes.filter(process => process.status === 2);
    return orderedProcesses.sort((a, b) => a.entryTimeBlocked - b.entryTimeBlocked)
  }
};

export default sort;