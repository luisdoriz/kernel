import React from 'react'
import { Col, Row, Spin, Icon } from 'antd';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
export default function LoaderView() {
  return (
    <Row type="flex" style={{ height: '100%' }} justify="center" align="middle">
      <Col span={12} >
        <Spin indicator={antIcon} />;
        </Col>
    </Row>
  )
}
