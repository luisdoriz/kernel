const roundRobin = (processes, process, ready, ) => {
  const newProcesses = processes;
  process.status = 3;
  const newRunningProcess = ready.shift();
  newRunningProcess.status = 1;
  const newRunning = [newRunningProcess];
  const newReady = ready;
  newReady.push(process);
  newProcesses[process.name - 1].status = 3;
  return {
    newReady,
    newRunning,
    newProcesses,
  };
};

export default roundRobin;