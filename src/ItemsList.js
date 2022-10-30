import firebaseConfig from "./firebase";
import { useState, useEffect } from "react";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";




function ItemsList(props) {
    console.log("The ItemsList Component just rendered!");
    //This state will track the items from our db
    const [items, setItems] = useState([]);

    //Track the name on our dtabase
    const [name, setName] = useState("");

    //Track user inputs from the form
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        //create a variable that will hold on to our database values
        const database = getDatabase(firebaseConfig);

        //create a variable that makes reference to our user
        const databaseRef = ref(database, props.node);

        //grabbing the information from our database
        onValue(databaseRef, (response) => {
            //Creating an array to store our data
            const newState = [];

            //store the returned data as variable
            const data = response.val();
            //Set the user name
            setName(data.name)
            //loop through the returned object
            for (const key in data.items) {
                newState.push({ key: key, item: data.items[key] });
            }
            setItems(newState);
        });
    }, [props.node]);



    //Creating a function that takes care of the update input logic
    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    // //Creating a function that submits the value to firebase

    const handleFormSubmit = (e) => {
        e.preventDefault();
        //New item variable
        const newItem = {
            name: userInput,
            qty: 1,
            state: true
        }
        //Push the information to firebase
        const database = getDatabase(firebaseConfig);
        const databaseRef = ref(database, props.node + '/items');
        push(databaseRef, newItem);
        setUserInput("");
    };

    // //This will remove the book from the list

    // const handleRemoveItem = (bookId) => {
    //     const database = getDatabase(firebaseConfig);
    //     const databaseRef = ref(database, `/${bookId}`)
    //     remove(databaseRef);
    // };

    return (
        <div className="form-and-list-container">
            <p>{name} This are your items:</p>
            <form action="submit">
                <label htmlFor="newiTem">Add a new item to your list</label>
                <input
                    type="text"
                    id="newItem"
                    onChange={handleInputChange}
                    value={userInput}
                />
                <button onClick={handleFormSubmit}>Add Item</button>
            </form>
            <ol>
                {items.map((item) => {
                    const { key, name = item.item.name, qty = item.item.qty, state = item.item.state } = item
                    return (
                        <li key={key}>
                            <p>{name}</p>
                            <p>Qty: {qty}</p>
                            <p>{state.toString()}</p>
                        </li>
                    );
                })}

            </ol>
        </div>
    )
}

export default ItemsList


/** 
 * 
 * <form action="submit">
                <label htmlFor="newiTem">Add a book to your bookshelf</label>
                <input
                    type="text"
                    id="newItem"
                    onChange={handleInputChange}
                    value={userInput}
                />
                <button onClick={handleFormSubmit}>Add Item</button>
            </form>
            <ul>
                {items.map((book, index) => {
                    return (
                        <li key={props.node + index}>
                            <p>{book.name}</p>
                            {/* I want to be able to delete the book */
/*
<button onClick={() => { handleRemoveItem(book.key) }}>Remove</button>
</li>
);
})}

</ul>
* 
* 
* **/