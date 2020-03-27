import React, { useContext } from 'react';
import { Col, Row, Select, Button, Table } from 'antd';

import Context from '../../Context';
import Column from '../Column';
import memoryAlgorithms from '../../constants/memoryAlgorithms';

const { Option } = Select;

const MemoryView = () => {
  const {
    processes,
    memoryAlgorithm,
    setMemoryAlgorithm,
    setProcesses,
    setActualTime,
    actualTime,
  } = useContext(Context.Consumer)
  const columns = [
    {
      title: 'pag',
      dataIndex: 'pageNumber',
      key: 'pageNumber',
    },
    {
      title: 'r',
      dataIndex: 'residence',
      key: 'residence',
    },
    {
      title: 'llegada',
      dataIndex: 'entry',
      key: 'entry',
    },
    {
      title: 'ult acceso',
      dataIndex: 'lastAccess',
      key: 'lastAccess',
    },
    {
      title: 'accesos',
      dataIndex: 'access',
      key: 'access',
    },
    {
      title: 'NUR',
      dataIndex: 'nur',
      key: 'nur',
    },
  ];

  const running = processes.filter(process => process.status === 1)[0];
  const resetBits = () => {
    const newProcesses = [...processes];
    newProcesses[running.name -1].pages = running.pages.map((page) => {
      page.write = 0;
      page.read = 0;
      page.nur = '00';
      return page;
    })
    setActualTime(actualTime +1);
    setProcesses(newProcesses);
  }
  return (
    <Row type="flex" style={{ marginTop: 20 }} justify="center" align="middle">
      <Col span={22} className="core-container" >
        <h1>CPU</h1>
        <Row type="flex" justify="space-between">
          <Column height={250} span={16}>
            {running && <Table dataSource={running.pages} columns={columns} />}
          </Column>
          <Column height={150} name="Memoria" span={6}>
            <Col>
              <Select style={{ width: '100%' }} value={memoryAlgorithm} onChange={setMemoryAlgorithm}>
                {Object.values(memoryAlgorithms).map((algorithm) => (
                  <Option value={algorithm}>
                    {algorithm}
                  </Option>
                ))}
              </Select>
              <Button style={{ margin: 5 }} type="primary" onClick={() => resetBits()}>reset</Button>

            </Col>
          </Column>
        </Row>
      </Col>
    </Row>
  )
};

export default MemoryView;
