import axios from 'axios';
import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from "react-bootstrap/Form";
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { MdCheckBox, MdCheckBoxOutlineBlank, MdEdit, MdDelete } from 'react-icons/md';
import moment from 'moment';
import TaskProgressBar from './TaskProgressBar';
import Accordion from 'react-bootstrap/Accordion';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';
import '../themes/TaskList.css';


export default function TaskList({ tasks = [], filterTasks = [], setTasks, setFilterTasks, subTasks, setSubTasks }) {
  const [show, setShow] = useState(false);
  const [record, setRecord] = useState(null);
  const [subRecord, setSubRecord] = useState(subTasks);

  const [subTaskName, setSubTaskName] = useState("");
  const [subTaskDeadline, setsubTaskDeadline] = useState("");
  
  const [percentagePrev, setPercentagePrev] = useState(null);

  const handleClose = () => {
    setShow(false);
  }

  const handleDelete = (id) => {
    axios.delete(`/api/tasks/${id}/`)
      .then(() => {
        const newTasks = tasks.filter(t => {
          return t.id !== id
        });

        const newFilterTasks = filterTasks.filter(t => {
          return t.id !== id
        });
        
        setTasks(newTasks);
        setFilterTasks(newFilterTasks);
      }).catch(() => {
        alert("Something went wrong");
      })
  }

  const handleSubTaskSubmit = e => {
    e.preventDefault();
    if (!subTaskName) {
        alert("Please provide a valid value for a subtask");
        return;
    }

    axios.post("/api/subtasks/", {
        name: subTaskName,
        deadline: subTaskDeadline ? subTaskDeadline : null,
        task: record.id,

    })
    .then((res) => {
        setSubTaskName("");
        setsubTaskDeadline("");

        const { data } = res;
        setSubTasks([
            ...subTasks,
            data
        ])
    })
  }

  const handleSubTaskName = e => {
    setSubTaskName(e.target.value);
  }

  const handleSubTaskDeadline = e => {
    setsubTaskDeadline(e.target.value);
  }


  const handleDeleteSubTask = (id) => {
    axios.delete(`/api/subtasks/${id}/`)
      .then(() => {
        const newSubTasks = subTasks.filter(t => {
          return t.id !== id
        });
        
        setSubTasks(newSubTasks);
      }).catch(() => {
        alert("Something went wrong");
      })
  }

  const handleUpdate = async (id, value) => {
    return axios.patch(`/api/tasks/${id}/`, value)
      .then((res) => {
        const { data } = res;
        const newTasks = tasks.map(t => {
          if (t.id === id) {
            return data;
          }
          return t;
        })

        const newFilterTasks = filterTasks.map(t => {
          if (t.id === id) {
            return data;
          }
          return t;
        })

        setTasks(newTasks);
        setFilterTasks(newFilterTasks);
      }).catch(() => {
        alert("Something went wrong");
      })
  }

  const handleSubTaskUpdate = async (id, value) => {
    return axios.patch(`/api/subtasks/${id}/`, value)
      .then((res) => {
        const { data } = res;
        const newSubTasks = subTasks.map(t => {
          if (t.id === id) {
            return data;
          }
          return t;
        })

        setSubTasks(newSubTasks);
      }).catch(() => {
        alert("Something went wrong");
      })
  }

  const timeDifference = (t) => {

    const deadlineDateStr = moment(t.deadline).format('YYYY-MM-DD HH:mm:ss');
    const deadlineDate = new Date(deadlineDateStr);
    const currentDate = Date.now();

    const differenceInMilliseconds = deadlineDate - currentDate;

    const diffInSec = differenceInMilliseconds / 1000;
    const diffInMin = diffInSec / 60;
    const diffInHrs = diffInMin / 60;
    const diffInDays = diffInHrs / 24;


    return diffInDays;
  }

  const renderListGroupItem = (t) => {

    const filteredSubTasks = subTasks.filter(subTasks => subTasks.task === t.id);

    const diffInDays = timeDifference(t);

    let recordStyle = "d-flex justify-content-center";
    if (diffInDays <= 1){
      recordStyle = "d-flex justify-content-center text-danger";
    }

    if (t.completed === true){
      recordStyle = "d-flex justify-content-center text-success";
    }

    return <Accordion>
       <Accordion.Item key={t.id} eventKey='0'>
        <Accordion.Header>
          <div class='block' className={recordStyle}>
            <span style={{
              cursor: "pointer"
              }} onClick={() => {

                if (t.completionPercentage !== 100){
                  setPercentagePrev(t.completionPercentage);
                }

                let complete = t.completionPercentage !== 100 ? 100 : percentagePrev;

                handleUpdate(t.id, {
                  completed: !t.completed,
                  completionPercentage: complete
                })
              }}>
                {t.completed === true ? <MdCheckBox />
                : <MdCheckBoxOutlineBlank />}
            </span>
            <span class='text'>
              <div>{t.name} { t.deadline ? 'Deadline: ' + moment(t.deadline).format('YYYY-MM-DD HH:mm') : ""}</div>
              <div class='progressBar'>
                <TaskProgressBar completionPercentage={t.completionPercentage} />
              </div>
            </span>
          </div>
          <div className={recordStyle} style={{
              position: 'absolute',
              right: '25px',
              width: 'auto',
              padding: '20px',
            }}>
            <MdEdit style={{
              cursor: "pointer",
              marginLeft: "40px",
              marginRight: "5px",
            }} onClick={() => {
              setRecord(t);
              setSubTasks(subTasks);
              setShow(true);
            }} />
            <MdDelete style={{
              cursor: "pointer"
            }} onClick={() => {
              handleDelete(t.id);
            }} />
          </div>
        </Accordion.Header>
        <AccordionBody>
          {t.description ? t.description : ""}<br/><br/>
          {filteredSubTasks.length !== 0 ? <Accordion>
            <AccordionItem eventKey='0'>
              <AccordionHeader>Subtasks</AccordionHeader>
              <AccordionBody>
                {filteredSubTasks.map(renderSubtasks)}
              </AccordionBody>
            </AccordionItem>
          </Accordion> : ""}
        </AccordionBody>
      </Accordion.Item>
    </Accordion>
  }

  const renderSubtasks = (t) => {

    const filteredRecord = filterTasks.filter(filterTasks => filterTasks.id === t.task);

    const diffInDays = timeDifference(t);

    const subTaskPercentageValue = Math.round(100 / (subTasks.filter(subTasks => subTasks.task === filteredRecord[0].id).length + 1));

    let subTaskStyle = "";

    if (diffInDays <= 1){
      subTaskStyle = "text-danger";
    }

    if (t.completed === true){
      subTaskStyle = "text-success";
    }

    return (
      <Form.Group className="mb-3" controlId="SubTasks">
        <Form.Group className={subTaskStyle}>
          <Form.Label>
            Subtask
            <span style={{
                marginLeft: "5px",
                cursor: "pointer"
              }} onClick={() => {
                
                if (filteredRecord[0].completionPercentage !== 100){
                  handleSubTaskUpdate(t.id, {
                    completed: !t.completed,
                  })
                }

                if (t.completed === true && filteredRecord[0].completed === false){
                  handleUpdate(filteredRecord[0].id, {
                    completionPercentage: filteredRecord[0].completionPercentage - subTaskPercentageValue,
                  })
                }
                else if (filteredRecord[0].completed === false){
                  handleUpdate(filteredRecord[0].id, {
                    completionPercentage: filteredRecord[0].completionPercentage + subTaskPercentageValue,
                  })
                }
              }}>
                {t.completed === true ? <MdCheckBox />
                : <MdCheckBoxOutlineBlank />}
              </span>
            <MdDelete style={{
              cursor: "pointer",
              marginLeft: '5px',
            }} onClick={() => {
              handleDeleteSubTask(t.id);
            }} />
          </Form.Label>
        </Form.Group>
        <Form.Group className={subTaskStyle}>
          <FormControl className={subTaskStyle} placeholder="Enter subtask" value={subRecord ? t.name : ""}
            onChange={handleSubTaskNameChange} />
          { t.deadline ? <Form.Label>Subtask Deadline</Form.Label> : ""}
          { t.deadline ? <FormControl className={subTaskStyle} type="datetime-local" placeholder="Enter deadline" value={subRecord ? moment(t.deadline).format('YYYY-MM-DD HH:mm:ss') : ""}
           onChange={handleSubTaskDeadlineChange} /> : ""}
        </Form.Group>
      </Form.Group>
    );
  }


  const handleNameChange = (e) => {
    setRecord({
      ...record,
      name: e.target.value
    })
  }

  const handleDescriptionChange = (e) => {
    setRecord({
      ...record,
      description: e.target.value
    })
  }

  const handleDeadlineChange = (e) => {
    setRecord({
      ...record,
      deadline: e.target.value
    })
  }

  const handleSubTaskNameChange = (e) => {
    setSubRecord({
      ...subRecord,
      name: e.target.value
    })
  }

  const handleSubTaskDeadlineChange = (e) => {
    setSubRecord({
      ...subRecord,
      deadline: e.target.value
    })
  }

  const handleSaveChanges = async () => {
    await handleUpdate(record.id, { name: record.name, description: record.description, deadline: record.deadline });
    if (subRecord.length !== 0){
      await handleSubTaskUpdate(subRecord.id, { name: subRecord.name, deadline: subRecord.deadline });
    }
    handleClose();
  }

  const completedTasks = filterTasks.filter(t => t.completed === true);
  const incompleteTasks = filterTasks.filter(t => t.completed === false);

  const filteredSubTasks = record ? subTasks.filter(subTasks => subTasks.task === record.id) : "";
  let searchedSubTasks = [];
  for (let i = 0; i < filterTasks.length; i++){
    for (let j = 0; j < subTasks.length; j++){
      if (filterTasks[i].id === subTasks[j].task){
        searchedSubTasks.push(subTasks[j]);
      }
    }
  }

  return ( <div>
    <div className="mb-2 mt-4">
      Incomplete Tasks ({incompleteTasks.length})
    </div>
    <ListGroup>
      {incompleteTasks.map(renderListGroupItem)}
    </ListGroup>
    <div className="mb-2 mt-4">
      Completed Tasks ({completedTasks.length})
    </div>
    <ListGroup>
      <s>
        {completedTasks.map(renderListGroupItem)}
      </s>
    </ListGroup>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form.Group className="mb-3" controlId="Title">
        <Form.Label>Task Title</Form.Label>
        <FormControl
         value={record ? record.name : ""}
         onChange={handleNameChange}
        />
        </Form.Group>
        <Form.Group className="mb-3" controlId="Description">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3}
           value={record ? record.description : ""}
           onChange={handleDescriptionChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="Deadline">
          <Form.Label>Deadline</Form.Label>
          <FormControl type="datetime-local" placeholder="Enter deadline"
           value={record ? moment(record.deadline).format('YYYY-MM-DD HH:mm:ss') : ""}
           onChange={handleDeadlineChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="SubTasks">
          <Form.Label>Subtask</Form.Label>
          <FormControl placeholder="Enter subtask" onChange={handleSubTaskName} value={subTaskName}  />
          <Form.Label>Subtask Deadline</Form.Label>
          <FormControl type="datetime-local" placeholder="Enter deadline" onChange={handleSubTaskDeadline} value={subTaskDeadline} /><br/>
          <Button variant="primary" onClick={handleSubTaskSubmit}>Add Subtask</Button>
        </Form.Group>
        {filteredSubTasks.length !== 0 && searchedSubTasks.length !== 0? <Accordion>
          <AccordionItem eventKey='0'>
            <AccordionHeader>Subtasks</AccordionHeader>
            <AccordionBody>
              {filteredSubTasks.map(renderSubtasks)}
            </AccordionBody>
          </AccordionItem>
        </Accordion> : ""}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="success" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
  );
}
