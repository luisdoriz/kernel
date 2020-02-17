import React, { useState } from 'react';
import { Col, Row, Button, Select } from 'antd';

import Context from '../../Context';
import interruptions from '../../constants/interruptions';
import roundRobin from '../../helpers/roundRobin';
import fifo from '../../helpers/fifo';
import scheduelings from '../../constants/scheduelings';
import srt from '../../helpers/srt';

const { Option } = Select;


const CpuView = () => {
  const [interruption, setInterruption] = useState(undefined)
  return (
    <Context.Consumer>
      {
        ({
          actualTime,
          running,
          processes,
          setActualTime,
          originalQuantum,
          setQuantum,
          ready,
          setProcesses,
          quantum,
          setRunning,
          setReady,
          setFinished,
          finished,
          schedueling,
          blocked,
          setBlocked,
        }) => {
          const executeInstruction = () => {
            setActualTime(actualTime + 1);
            if ((schedueling === scheduelings.RR && quantum - 1 === 0) && running[0].remainingCpu - 1 !== 0) {
              setQuantum(originalQuantum);
              if (ready.length) {
                const runningProcess = running[0];
                runningProcess.assignedCpu = runningProcess.assignedCpu + 1;
                runningProcess.remainingCpu = runningProcess.remainingCpu - 1;
                let columns = {};
                if (schedueling === scheduelings.RR) {
                  columns = roundRobin(processes, runningProcess, ready);
                } else if (schedueling === scheduelings.FIFO) {
                  columns = fifo(processes, runningProcess, ready);
                } else if (schedueling === scheduelings.SRT) {
                  columns = srt(processes, runningProcess, ready);
                } else if (schedueling === scheduelings.HRRN) {
                  columns = srt(processes, runningProcess, ready);
                }
                const { newReady, newRunning, newProcesses } = columns;
                console.log(newReady)
                setProcesses(newProcesses)
                setRunning(newRunning);
                setReady(newReady);
              }
            } else if (running[0].remainingCpu - 1 === 0) {
              setQuantum(originalQuantum)
              const updatedProcess = running[0];
              updatedProcess.assignedCpu = updatedProcess.assignedCpu + 1;
              updatedProcess.remainingCpu = updatedProcess.remainingCpu - 1;
              updatedProcess.status = 4;
              setFinished([...finished, updatedProcess]);
              const updatedProcesses = processes;
              if (ready.length) {
                const newReady = ready;
                const newRunningProcess = newReady.shift();
                setReady(newReady);
                newRunningProcess.status = 1;
                setRunning([newRunningProcess]);
                updatedProcesses[newRunningProcess.name - 1] = newRunningProcess;
              } else {
                setRunning([])
              }
              updatedProcesses[updatedProcess.name - 1] = updatedProcess;
              setProcesses(updatedProcesses);
            } else {
              const updatedProcess = running[0];
              updatedProcess.assignedCpu = updatedProcess.assignedCpu + 1;
              setQuantum(quantum - 1)
              updatedProcess.remainingCpu = updatedProcess.remainingCpu - 1;
              setRunning([updatedProcess]);
              const updatedProcesses = processes;
              updatedProcesses[updatedProcess.name - 1] = updatedProcess;
              setProcesses(updatedProcesses);
            }
          };

          const interruptionTrigger = (e) => {
            setInterruption(e);
            setQuantum(originalQuantum)
            if (e === interruptions.SVCIOR) {
              const process = running[0];
              process.status = 2;
              const newReady = ready;
              const newRunning = ready.shift();
              const newProcesses = processes;
              newProcesses[process.name - 1].status = 2;
              newProcesses[newRunning.name - 1].status = 1;
              const newBlocked = blocked;
              newBlocked.push(process);
              setProcesses(newProcesses);
              setReady(newReady);
              setRunning([newRunning]);
              setBlocked(newBlocked);
            } else if (e === interruptions.SVCNT || e === interruptions.PF) {
              const process = running[0];
              process.status = 4;
              const newReady = ready;
              const newRunning = ready.shift();
              const newProcesses = processes;
              newProcesses[process.name - 1].status = 4;
              newProcesses[newRunning.name - 1].status = 1;
              const newFinished = finished;
              newFinished.push(process);
              setProcesses(newProcesses);
              setReady(newReady);
              setRunning([newRunning]);
              setFinished(newFinished);
            } else if (e === interruptions.SVCDR || e === interruptions.EEQ) {
              const process = running[0];
              process.status = 3;
              const newReady = ready;
              const newRunning = ready.shift();
              const newProcesses = processes;
              newProcesses[process.name - 1].status = 3;
              newProcesses[newRunning.name - 1].status = 1;
              ready.push(process);
              setProcesses(newProcesses);
              setReady(newReady);
              setRunning([newRunning]);
            } else if (e === interruptions.IOD) {
              const process = running[0];
              process.status = 3;
              const newReady = ready;
              const newBlocked = blocked;
              const newRunning = ready.shift();
              const newProcesses = processes;
              newProcesses[process.name - 1].status = 3;
              newProcesses[newRunning.name - 1].status = 1;
              ready.push(process);
              ready.push(newBlocked.shift());
              setProcesses(newProcesses);
              setReady(newReady);
              setRunning([newRunning]);
              setBlocked(newBlocked);
            }
          }
          return (
            <Row type="flex" style={{ marginTop: 20 }} justify="center" align="middle">
              <Col span={22} className="core-container" >
                <Row>
                  <Col span={8}>
                    <Row>
                      <h3>Tiempo actual: {actualTime}</h3>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row>
                      <Col span={12}>
                        <Button
                          type="primary"
                          disabled={!running.length}
                          onClick={() => executeInstruction()}
                        >
                          Ejecutar Instruccion
                          </Button>
                      </Col>
                      <Col span={12}>
                        <Button type="primary">Ejecutar Pagina</Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row>
                      <Col span={8}>
                        <h3>Interrupción</h3>
                      </Col>
                      <Col span={16}>
                        <Select
                          style={{ width: '100%' }}
                          placeholder="Interupciónes"
                          onChange={(e) => interruptionTrigger(e)}
                          value={interruption}
                        >
                          {Object.values(interruptions).map((interruption) => (
                            <Option value={interruption}>
                              {interruption}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          )
        }
      }
    </Context.Consumer>
  )
}

export default CpuView
