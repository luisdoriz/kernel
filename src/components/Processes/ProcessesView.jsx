import React, { useState } from 'react'
import { Col, Row, InputNumber, Button } from 'antd';

import Context from '../../Context';
import Column from '../Column';

import './styles.css';

const ProcessesView = () => {
  const [pageNumber, setPages] = useState(undefined);
  const [remainingCpu, setTime] = useState(undefined);
  return (
    <Context.Consumer>
      {
        ({
          ready,
          running,
          blocked,
          finished,
          processes,
          actualTime,
          quantum,
          setRunning,
          setReady,
          setProcesses,
        }) => {
          const columns = { ready, running, blocked, finished };
          const addProcess = (pageNumber, remainingCpu) => {
            const newProcess = {
              pageNumber,
              remainingCpu,
              name: processes[processes.length - 1].name + 1,
              entryTime: actualTime,
              assignedCpu: 0,
              remainingQuantum: quantum,
              status: 3,
            };
            if (!running.length) {
              newProcess.status = 1;
              const newRunning = running;
              newRunning.push(newProcess);
              setRunning(newRunning);
            } else {
              const newReady = ready;
              newReady.push(newProcess);
              setReady(newReady);
            }
            const newProcesses = processes;
            newProcesses.push(newProcess);
            setProcesses(newProcesses);
          };
          const submitForm = () => {
            addProcess(pageNumber, remainingCpu);
            setPages(undefined);
            setTime(undefined);
          };
          return (
            <Row type="flex" style={{ marginTop: 20 }} justify="center" align="middle">
              <Col span={22} className="core-container" >
                <h1>Procesos</h1>
                <Row type="flex" justify="center">
                  <Column height={250} name="new" span={4}>
                    <Col>
                      <Row>
                        <h2>Paginas:</h2>
                        <InputNumber min={1} max={10} value={pageNumber} onChange={setPages} />
                        <h2>Ejecucion Total:</h2>
                        <InputNumber min={1} max={10} value={remainingCpu} onChange={setTime} />
                        <Button style={{ margin: 5 }} type="primary" onClick={() => submitForm()}>Agregar</Button>
                      </Row>
                    </Col>
                  </Column>
                  {Object.keys(columns).map((columnName) =>
                    <Column height={250} list={columns[columnName]} name={columnName} span={3} />
                  )}
                </Row>
              </Col>
            </Row>
          )
        }
      }
    </Context.Consumer>
  )
}

export default ProcessesView;
