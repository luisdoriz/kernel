import React, { useState, useContext } from 'react';
import { Col, Row, Button, Select } from 'antd';

import Context from '../../Context';
import interruptions from '../../constants/interruptions';
import scheduelings from '../../constants/scheduelings';
import memoryAlgorithms from '../../constants/memoryAlgorithms';
import sort from '../../helpers/sort';

const { Option } = Select;


const CpuView = () => {
  const {
    actualTime,
    processes,
    setActualTime,
    originalQuantum,
    setQuantum,
    setProcesses,
    quantum,
    schedueling,
    memoryAlgorithm,
    pageNumber,
  } = useContext(Context.Consumer)
  const [interruption, setInterruption] = useState(undefined)

  const executeInstruction = (newProcesses) => {
    const running = newProcesses.filter(process => process.status === 1)[0];
    const nextRunning = sort[schedueling](newProcesses, actualTime)[0];
    if (running) {
      if (schedueling === scheduelings.RR) {
        if (quantum - 1 === 0 && running.remainingCpu - 1 !== 0) {
          if (nextRunning) {
            newProcesses[running.name - 1].status = 3;
            newProcesses[running.name - 1].entryTimeReady = actualTime;
            newProcesses[nextRunning.name - 1].status = 1;
          }
          setQuantum(originalQuantum);
        } else {
          setQuantum(quantum - 1);
          newProcesses[running.name - 1].remainingCpu = running.remainingCpu - 1;
        }
        if (running.remainingCpu === 0) {
          newProcesses[running.name - 1].status = 4;
          if (nextRunning) {
            newProcesses[nextRunning.name - 1].status = 1;
          }
          setQuantum(originalQuantum);
        }
      } else {
        newProcesses[running.name - 1].remainingCpu = running.remainingCpu - 1;
        if (running.remainingCpu === 0) {
          newProcesses[running.name - 1].status = 4;
          if (nextRunning) {
            newProcesses[nextRunning.name - 1].status = 1;
          }
        }
      }
      setProcesses(newProcesses);
      setActualTime(actualTime + 1);
    }
  }
  const interruptionTrigger = (e) => {
    const newProcesses = processes;
    const running = newProcesses.filter(process => process.status === 1)[0];
    const nextRunning = sort[schedueling](newProcesses, actualTime)[0];
    const newTime = actualTime + 1;
    if (e === interruptions.SVCIOR) {
      if (nextRunning) {
        newProcesses[nextRunning.name - 1].status = 1;
      }
      newProcesses[running.name - 1].status = 2;
      newProcesses[running.name - 1].entryTimeBlocked = newTime;
    } else if (e === interruptions.PF || e === interruptions.SVCNT) {
      if (nextRunning) {
        newProcesses[nextRunning.name - 1].status = 1;
      }
      newProcesses[running.name - 1].status = 4;
    } else if (e === interruptions.SVCDR || e === interruptions.EEQ) {
      if (nextRunning) {
        newProcesses[running.name - 1].status = 3;
        newProcesses[running.name - 1].entryTimeReady = newTime;
        newProcesses[nextRunning.name - 1].status = 1;
      }
    } else if (e === interruptions.IOD) {
      const nextReady = sort.block(processes)[0];
      if (nextRunning) {
        newProcesses[running.name - 1].status = 3;
        newProcesses[nextRunning.name - 1].status = 1;
        newProcesses[running.name - 1].entryTimeReady = newTime;
      }
      if (nextReady) {
        newProcesses[nextReady.name - 1].status = 3;
        newProcesses[nextReady.name - 1].entryTimeReady = newTime;
      }
    }
    setInterruption(e);
    setProcesses(newProcesses);
    setActualTime(newTime)
  }
  const executePage = (page) => {
    const newProcesses = [...processes];
    const running = newProcesses.filter(process => process.status === 1)[0];
    let activePages;
    running.pages.forEach(element => {
      if (element.residence) {
        ++activePages
      }
    });
    if (pageNumber === activePages) {
      if (memoryAlgorithms.FIFO === memoryAlgorithm) {
        const newPage = running.pages.sort((a, b) => a.entry - b.entry)[0];
        running.pages[newPage.pageNumber].residence = 0;
      } else if (memoryAlgorithms.LRU === memoryAlgorithm) {
        const newPage = running.pages.sort((a, b) => a.lastAccess - b.lastAccess)[0];
        running.pages[newPage.pageNumber].residence = 0;
      } else if (memoryAlgorithms.LFU === memoryAlgorithm) {
        const newPage = running.pages.sort((a, b) => a.access - b.access)[0];
        running.pages[newPage.pageNumber].residence = 0;
      } else if (memoryAlgorithms.NUR === memoryAlgorithm) {
        const criteria = {
          '00': 1,
          '10': 2,
          '01': 3,
          '11': 4,
        }
        const newPage = running.pages.sort((a, b) => criteria[a.nur] - criteria[b.nur])[0];
        running.pages[newPage.pageNumber].residence = 0;
      }
    }

    running.pages[page].residence = 1;
    running.pages[page].lastAccess = actualTime;
    running.pages[page].access = running.pages[page].access + 1;
    running.pages[page].read = 1;
    running.pages[page].nur = `${running.pages[page].read}${running.pages[page].write}`;
    newProcesses[running.name - 1] = running;
    setProcesses(newProcesses);

  }
  return (
    <Row type="flex" style={{ marginTop: 20 }} justify="center" align="middle">
      <Col span={22} className="core-container" >
        <Row justify="space-between">
          <Col span={6}>
            <Row>
              <h3>Tiempo actual: {actualTime}</h3>
            </Row>
          </Col>
          <Col span={10}>
            <Row justify="space-around" >
              <Col span={12}>
                <Button
                  type="primary"
                  // disabled={!processes.filter(process => process.status === 1).length}
                  onClick={() => executeInstruction(processes)}
                >
                  Ejecutar Instruccion
                          </Button>
              </Col>
              <Col span={12}>
                <Select
                  style={{ width: '100%' }}
                  onChange={(e) => executePage(e)}
                  placeholder="Ejecutar pagina"
                >
                  {processes.filter(process => process.status === 1)[0].pages.map((page) => (
                    <Option value={page.pageNumber}>
                      {page.pageNumber}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
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
};

export default CpuView
