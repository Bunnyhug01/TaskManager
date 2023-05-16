import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import SearchForm from './components/SearchForm';
import Navbar from './components/Navbar';
import axios from 'axios';
import './App.css'


function App() {
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [filterTasks, setFilterTasks] = useState([]);

  useEffect(() => {
    axios.get("/api/tasks/")
      .then((res) => {
        setTasks(res.data)
        setFilterTasks(res.data)
      }).catch(() => {
        alert("Something went wrong");
      })
  }, [])


  useEffect(() => {
    axios.get("/api/subtasks/")
      .then((res) => {
        setSubTasks(res.data)
      }).catch(() => {
        alert("Something went wrong");
      })
  }, [])


  return (
    <div>
      <Navbar />
      <div class='content'>
        <Container>
          <SearchForm tasks={tasks} filterTasks={filterTasks} setFilterTasks={setFilterTasks} />
          <TaskList tasks={tasks} filterTasks={filterTasks} setTasks={setTasks} setFilterTasks={setFilterTasks} subTasks={subTasks} setSubTasks={setSubTasks}  /> <br/>
          <TaskForm tasks={tasks} setTasks={setTasks} setFilterTasks={setFilterTasks} subTasks={subTasks} setSubTasks={setSubTasks} />
        </Container>
      </div>
    </div>
  );
}

export default App;
