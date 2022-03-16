import React, {useState, useEffect} from 'react'
import "./App.css";
import "../src/Todo.css";

//get data from loacal storage
const getLocalItems = () => {
    let list = localStorage.getItem('myLists');
    // console.log(list);
    if (list) {
        // console.log(JSON.parse(localStorage.getItem('myLists')));
        return JSON.parse(list);
    } else {
        return []
    }
};

const TodoList = () => {

    const [inputData, setInputData] = useState('');
    const [items, setItems] = useState(getLocalItems());
    const [toogleSubmit, setToggleSubmit] = useState(true);
    const [isEditItem, setIsEditItem] = useState(null);

    // Adding item 
    const addItem = () => {
        if (!inputData) {
            alert('please fill up data before adding list :smile:');
        }
        // for update item 
        else if (inputData && !toogleSubmit) {            
            setItems(
                items.map((elem) => {
                    if (elem.id === isEditItem) //here in isEditItem, I already passed id to it, check on editItem function and in this I set it as setIsEditItem(id), so that isEditItem receives id.. Its all for which element we choose to edit..
                    { 
                        return { ...elem, name:inputData };
                    }
                    return elem;
                })
            );
            setToggleSubmit(true);
            setInputData('');
            setIsEditItem(null);
        }
        else {
            const allInputData = { id: new Date().getTime().toString() , name:inputData}
            setItems([...items, allInputData]);
            setInputData('');
        }  
    }

    // delete item 
    const deleteItem = (id) => {
        console.log('deleted');
        const updatedItems = items.filter((elem) => {
            return elem.id !== id;
        })
        setItems(updatedItems);
    }

    // edit item 
    const editItem = (id) => {

        let newEditItem = items.find((elem) => {
            return elem.id === id;
        })
        setToggleSubmit(false);
        setInputData(newEditItem.name);
        setIsEditItem(id);

    }


    // remove all data from todo list
    const deleteAll = () => {
        setItems([]);
    }

    // add data to localStorage
    useEffect(() => {
        // localStorage.setItem('myName', 'Saransh');
        localStorage.setItem('myLists', JSON.stringify(items)); //In Local Storage, we only need to store strings, so we convert the array to a string through JSON.stringify()
    }, [items]);

    const postData = async (e) => {
        e.preventDefault();
        const res = await fetch("https://reacttodoapp-957a3-default-rtdb.firebaseio.com/reacttodolist.json",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                todoListName: items,
            })
        }) 
    }

    return (
       <>
            <div className="main-div">
                <div className="child-div">
                    <h1>ToDo List</h1>
                    <form action="">
                    <div className="addItems">
                        <input type="text" className="form-control" placeholder=" Add items....."
                            value={inputData }
                            onChange={(e) => setInputData(e.target.value)}
                        />
                        {/* toggle the submit btn with the edit btn  */}
                        { toogleSubmit ?  <i className="fa fa-plus fa-2x add-btn" title="Add item" onClick={() => addItem()}></i> :  <i className="far fa-edit add-btn" title="Update item" onClick={addItem}></i> }     
                    </div>

                    <div className="showItems">
                        {
                            items.map((elem) => {
                                return (
                                    <div className="eachItem" key={elem.id}>
                                        <h3> {elem.name} </h3>
                                        <div className='todo-btn'>
                                            <i className="far fa-edit add-btn" title="Edit item" onClick={() => editItem(elem.id)}></i>
                                            <i className="far fa-trash-alt add-btn" title="Delete item" onClick={() => deleteItem(elem.id)}></i>
                                        </div>    
                                    </div>
                                )
                            })
                        }  
                    </div>
                    <div className="showItems">
                        <button className="btn" target="_blank" onClick={postData}>SEND DATA</button>
                    </div>
                    </form>
                    <div className="showItems">
                        <button className="btn" target="_blank" onClick={deleteAll}>REMOVE ALL</button>
                    </div>
                </div>
         </div>   
      </>
    )
}

export default TodoList;