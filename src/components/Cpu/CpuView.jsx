import React from 'react';
import { Col, Row, Select, InputNumber } from 'antd';

import Context from '../../Context';
import Column from '../Column';
import scheduelings from '../../constants/scheduelings';

const { Option } = Select;

const CpuView = () => {
  return (
    <Context.Consumer>
      {
        ({
          running,
          actualTime,
          quantum,
          setOriginalQuantum,
          originalQuantum,
          schedueling,
          setSchedueling,
        }) => {
          const process = running[0];
          return (
            <Row type="flex" style={{ marginTop: 20 }} justify="center" align="middle">
              <Col span={22} className="core-container" >
                <h1>CPU</h1>
                <Row type="flex" justify="space-between">
                  <Column height={200} name="Schedueling" span={10}>
                    <Col>
                      {process ? (
                        <>
                          <h4>Nombre: {process.name}</h4>
                          <h4>Tpo llegada: {process.entryTime}</h4>
                          <h4>Cpu asignado: {process.assignedCpu}</h4>
                          <h4>Envejecimiento: {actualTime - process.entryTime - process.assignedCpu}</h4>
                          <h4>Cpu restante: {process.remainingCpu}</h4>
                          {schedueling === scheduelings.RR && <h4>Quantum Restante: {quantum}</h4>}
                        </>
                      ) : <h3>No hay nada corriendo</h3>}
                    </Col>
                  </Column>
                  <Column height={150} name="CPU" span={6}>
                    <Col>
                      <Select style={{ width: '100%' }} value={schedueling} onChange={setSchedueling}>
                        {Object.values(scheduelings).map((schedueling) => (
                          <Option value={schedueling}>
                            {schedueling}
                          </Option>
                        ))}
                      </Select>
                      <h4>Tam Quantum</h4>
                      <InputNumber min={1} value={originalQuantum} onChange={setOriginalQuantum} />
                    </Col>
                  </Column>
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
