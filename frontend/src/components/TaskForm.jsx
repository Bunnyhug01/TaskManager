import React, { useState } from "react";
import Button  from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import '../themes/TaskForm.css';


export default function TaskForm({ tasks, setTasks, setFilterTasks, subTasks, setSubTasks }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleNameChange = e => {
        setName(e.target.value);
    }

    const handleDescriptionChange = e => {
        setDescription(e.target.value);
    }

    const handleDeadlineChange = e => {
        setDeadline(e.target.value);
    }


    const handleSubmit = e => {
        e.preventDefault();
        if (!name) {
            alert("Please provide a valid value for a task");
            return;
        }

        axios.post("/api/tasks/", {
            name: name,
            description: description ? description : null,
            deadline: deadline ? deadline : null,


        })
        .then((res) => {
            setName("");
            setDescription("");
            setDeadline("");
            
            const { data } = res;
            setTasks([
                ...tasks,
                data
            ]);

            setFilterTasks([
                ...tasks,
                data
            ]);

        })
    }

    const addTask = (e) => {
        handleSubmit(e);
        handleClose();
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="Title">
                            <Form.Label>Task Title</Form.Label>
                            <FormControl placeholder="Enter title" onChange={handleNameChange} value={name} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="Description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} onChange={handleDescriptionChange} value={description} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="Deadline">
                            <Form.Label>Deadline</Form.Label>
                            <FormControl type="datetime-local" placeholder="Enter deadline" onChange={handleDeadlineChange} value={deadline} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="success" onClick={addTask}>
                        Add Task
                    </Button>
            </Modal.Footer>
            </Modal>
            <div class='button'>
                <Button variant="primary" onClick={handleShow}>
                    Create Task
                </Button>
            </div>
        </div>
    );
}