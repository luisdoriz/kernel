import React, { useState } from 'react'
import { Col, Row, InputNumber, Button } from 'antd';

import Context from '../../Context';
import Column from '../Column';
import sort from '../../helpers/sort';

import './styles.css';
import scheduelings from '../../constants/scheduelings';

const ProcessesView = () => {
  const [pageNumber, setPages] = useState(undefined);
  const [remainingCpu, setTime] = useState(undefined);
  return (
    <Context.Consumer>
      {
        ({
          processes,
          actualTime,
          setActualTime,
          quantum,
          schedueling,
          setProcesses,
        }) => {
          const columns = ['ready', 'running', 'blocked', 'finished'];
          const cols = {
            ready: sort[schedueling](processes, actualTime),
            running: processes.filter(process => process.status === 1),
            blocked: sort.block(processes),
            finished: processes.filter(process => process.status === 4),
          }
          const addProcess = (pageNumber, remainingCpu) => {
            const newProcesses = processes;
            const newProcess = {
              pageNumber,
              remainingCpu,
              name: processes[processes.length - 1].name + 1,
              entryTime: actualTime,
              assignedCpu: 0,
              remainingQuantum: quantum,
              status: 3,
            };
            if (!processes.filter(process => process.status === 1).length) {
              newProcess.status = 1;
            } else if (!cols.running.length) {
              newProcess.status = 1;
            } else if (schedueling === scheduelings.SRT
              && cols.running[0].remainingCpu > newProcess.remainingCpu) {
              newProcesses[cols.running[0].name - 1].status = 3
              newProcess.status = 1;
            } else if (schedueling === scheduelings.SRT
              && ((actualTime - cols.running[0].entryTime - cols.running[0].assignedCpu + cols.running[0].remainingCpu) / cols.running[0].remainingCpu)
              < ((actualTime - newProcess.entryTime - newProcess.assignedCpu + newProcess.remainingCpu) / newProcess.remainingCpu)) {
              newProcesses[cols.running[0].name - 1].status = 3
              newProcess.status = 1;
            }
            newProcesses.push(newProcess);
            setActualTime(actualTime + 1);
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
                  {columns.map((columnName) =>
                    <Column height={250} list={cols[columnName]} name={columnName} span={3} />
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
