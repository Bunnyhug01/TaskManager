import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";


export default function SearchForm({ tasks = [], filterTasks = [], setFilterTasks }) {
  
  const handleSearch = (e) => {
    const searchedTasks = tasks.filter(t => {
      return t.name.toString().toLowerCase().startsWith(e.target.value.toLowerCase())
    });

    filterTasks = searchedTasks;
    setFilterTasks(filterTasks);
  }

  return (
    <Form onSubmit={null}>
        <InputGroup className="mb-4">
            <FormControl placeholder="Search Task"
                onChange={handleSearch}
            />
        </InputGroup>
    </Form>
  )
}
