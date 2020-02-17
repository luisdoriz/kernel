import React from 'react';
import { Col } from 'antd';

import './styles.css'

const ColumnView = ({ name, list, span, height, children }) => {
  return (
    <Col className="column" span={span} style={{ height: height + 62 }} >
      <div className={`column-header column-header-${name}`}><h1>{name}</h1></div>
      <div className="column-body" style={{ height }} >
        {children ? <div className="column-children">{children}</div>
          : list.map((listItem) => <div className="column-item"><h2>{listItem.name}</h2></div>)
        }
      </div>
    </Col>
  )
}

export default ColumnView;
