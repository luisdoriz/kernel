import React from 'react'
import { Col, Row, notification } from 'antd';

import Context from '../../Context';


const FileInput = () => (
  <Context.Consumer>
    {
      ({ setProcesses, setPageNumber, setActualTime, setProcessesCount, quantum }) => {
        const setFields = ({ pageNumber, actualTime, processesCount }) => {
          setPageNumber(pageNumber);
          setActualTime(actualTime);
          setProcessesCount(processesCount);
        }

        const mapProcesses = (rows) => {
          const processes = [];
          let process = {};
          let counter = 1;
          while (rows.length) {
            const firstRow = rows.shift().split(',');
            const secondRow = rows.shift().split(',')[0];
            process.name = counter;
            counter = counter + 1;
            process.assignedCpu = 0;
            process.remainingQuantum = quantum;
            process.pageNumber = Number(secondRow);
            process.entryTime = Number(firstRow[0]);
            process.entryTimeReady = Number(firstRow[0]);
            process.entryTimeBlocked = Number(firstRow[0]);
            process.remainingCpu = Number(firstRow[1]);
            process.status = Number(firstRow[2]);
            process.pages = [];
            for (let i = 0; i < secondRow; i++) {
              const page = rows.shift().split(',');
              let newPage = {};
              newPage.pageNumber = i;
              newPage.residence = Number(page[0]);
              newPage.entry = Number(page[1]);
              newPage.lastAccess = Number(page[2]);
              newPage.access = Number(page[3]);
              newPage.read = Number(page[4]);
              newPage.write = Number(page[5]);
              newPage.nur = `${newPage.read}${newPage.write}`;
              process.pages.push(newPage);
            }
            processes.push(process);
            process = {};
          }
          setProcesses(processes);
          notification.success({
            message: '¡Listo!',
            description: 'Se ha procesado con exito.',
          });
        }

        const showFile = () => {
          if (window.File && window.FileReader && window.FileList && window.Blob) {
            var file = document.querySelector('input[type=file]').files[0];
            var reader = new FileReader()

            var textFile = /text.*/;

            if (file.type.match(textFile)) {
              reader.onload = function (event) {
                const rows = event.target.result.split(/\r?\n|\r/g);
                const firstRow = rows.shift().split(',');
                const secondtRow = rows.shift().split(',');
                mapProcesses(rows);
                const pageNumber = Number(firstRow[0]);
                const actualTime = Number(firstRow[1]);
                const processesCount = Number(secondtRow[0]);
                setFields({ pageNumber, actualTime, processesCount, });
              }
            } else {
              console.log('err')
            }
            reader.readAsText(file);
          } else {
            alert("Your browser is too old to support HTML5 File API");
          }
        }

        return (
          <Row type="flex" style={{ height: '100%' }} justify="center" align="middle">
            <Col span={12} >
              <h1 style={{ fontSize: 100 }}>Simulación de Kernel</h1>
              <h2 style={{ textAlign: 'right' }}>Luis Doriz #510681</h2>
              <h2 style={{ textAlign: 'right' }}>Daniel Ramirez #506861</h2>
              <h1 style={{ fontSize: 60 }}>Ingrese archivo .txt</h1>
              <input style={{ borderRadius: 5, fontSize: 20 }} type="file" onChange={showFile} />
            </Col>
          </Row>
        );
      }
    }
  </Context.Consumer>
);

export default FileInput;

