import { useEffect, useState } from "react"

export default function Todos(){
    const [title,SetTitle] =useState("");
    const [desc,SetDesc] =useState("");
    const [todos,SetTodos] =useState([]);
    const [error,SetError] =useState("");
    const [success,SetSuccess] =useState("");
    const [editId, SetEditId] = useState(-1);
    const apiUrl = "http://localhost:8000/";

    //Edit
    const[editTitle, SetEditTitle] = useState("");
    const[editDesc, SetEditDesc] = useState("");

     const handleSubmit = () => {
    SetError("");
    SetSuccess("");

    if (title.trim() !== '' && desc.trim() !== '') {
        fetch(apiUrl + "todos", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, desc })
        })
        .then(async (res) => {
            if (res.ok) {
                SetTodos([...todos, { title, desc }])
                SetTitle("");
                SetDesc("");
                SetSuccess('Todo item added successfully');

                setTimeout(() => {
                    SetSuccess('');
                }, 3000);
            } else {
                SetError('Unable to create a todo item');
            }
        })
        .catch(() => {
            SetError('Server error');
        });

    } else {
        SetError("Please enter title and description");
    }
}

useEffect(() => {
    getItems();
}, [])
const getItems = () => {
    fetch(apiUrl+"todos")
    .then((res)=> res.json())
    .then((res) => {
        SetTodos(res)
    })
}

const handleUpdate = () => {


    SetError("");
    SetSuccess("");

    if (editTitle.trim() !== '' && editDesc.trim() !== '') {
        fetch(apiUrl + "todos/" + editId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: editTitle, desc: editDesc })
        })
        .then(async (res) => {
            if (res.ok) {
              const updatedTodos = todos.map((item)=>{
                    if(item._id === editId){
                        item.title = editTitle;
                        item.desc = editDesc;
                    }
                    return item;
                })
                SetTodos(updatedTodos)
                SetTitle("")
                SetDesc("")
                SetSuccess('Todo item updated successfully')

                setTimeout(() => {
                    SetSuccess('');
                }, 3000)
                SetEditId(-1)
            } else {
                SetError('Unable to update the todo item');
            }
        })
        .catch(() => {
            SetError('Server error');
        });

    } else {
        SetError("Please enter title and description");
    }
}
const handleEdit = (item) => {
    SetEditId(item._id); 
    SetEditTitle(item.title); 
    SetEditDesc(item.desc)
}
const handleEditCancel = () => {
   
    SetEditId(-1);
}
   const handleDelete = (id) => {
        if (window.confirm('Are you sure want to delete?')) {
            fetch(apiUrl+'todos/'+id, {
                method: "DELETE"
            })
            .then(() => {
               const updatedTodos = todos.filter((item) => item._id !== id)
               SetTodos(updatedTodos)
            })
        }
    }




    return <>
    <div className="row p-3 bg-success text-white mt-3 text-center">
        <h1>Todos Project with MERN Stack</h1>
    </div>
    <div className="row p-3">
        <h2>Add a new todo</h2>
        {success && <p className="text-success">{success}</p>}
        <div className="form-group d-flex gap-2">

            <input className="form-control"  type="text" onChange= {(e)=>SetTitle(e.target.value) } placeholder="Enter a new todo..." value={title} />
            <input className="form-control"  type="text" onChange= {(e)=>SetDesc(e.target.value) } placeholder="Enter a new todo..." value={desc} />
            <button className="btn btn-primary " onClick={handleSubmit}>
                Add
            </button>
        </div>
{error && <p className="text-danger">{error}</p>}

    </div>
    <div className="row mt-3">
        <h3> Tasks</h3>
        <div className="col-md-6">
        <ul className="list-group ">
            {
              todos.map((item) =>
            <li className="list-group-item d-flex justify-content-between align-items-center my-2"> 
                <div className="d-flex flex-column me-2">
                    {
                       editId=== -1 || editId!== item._id ? <>
                <span className="fw-bold">{item.title}</span>
                <span >{item.desc}</span>
                       </>  :
                       <>
                      <div className="form-group d-flex gap-2">

                            <input className="form-control"  type="text" onChange= {(e)=>SetEditTitle(e.target.value) } placeholder="Enter a new todo..." value={editTitle} />
                            <input className="form-control"  type="text" onChange= {(e)=>SetEditDesc(e.target.value) } placeholder="Enter a new todo..." value={editDesc} />
                        </div>  </>
                    }
           
                </div>
                 <div className="d-flex gap-2">
               
                {editId===-1 || editId!== item._id ?
                <button className="btn btn-success btn-sm float-end me-2" onClick={() => handleEdit(item)}>Edit</button>:<button onClick={handleUpdate}>Update</button>
                } 
                { editId===-1 || editId!== item._id ?<button className="btn btn-danger btn-sm float-end" onClick={() => handleDelete(item._id)}>Delete</button> :
                <button className="btn btn-warning btn-sm float-end" onClick={handleEditCancel}>Cancel</button>}
                </div>
                </li>
                )  
            }
        </ul></div>
    </div>
    </>
}