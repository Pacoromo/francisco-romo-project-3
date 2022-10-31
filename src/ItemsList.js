import firebaseConfig from "./firebase";
import { useState, useEffect } from "react";
import { getDatabase, onValue, ref, push } from "firebase/database";
import ItemLi from "./ItemLi";

function ItemsList(props) {
    console.log("The ItemsList Component just rendered!");
    //This state will track the items from our db
    const [items, setItems] = useState([]);

    //Track the user name from our dtabase
    const [name, setName] = useState("");

    //Track the new item input
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        //create a variable that will hold on to our database values
        const database = getDatabase(firebaseConfig);

        //create a variable that makes reference to our user
        const databaseRef = ref(database, props.userNode);

        //grabbing the information from our database
        onValue(databaseRef, (response) => {
            //Creating an array to store our data
            const newState = [];
            //store the returned data as variable
            const data = response.val();
            //Set the user name
            setName(data.name);
            //loop through the returned object
            for (const key in data.items) {
                newState.push({ key: key, item: data.items[key] });
            }
            setItems(newState);
        });
    }, [props.userNode]);

    //Take care of the update input logic
    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    //Submit the value to firebase
    const handleFormSubmit = (e) => {
        e.preventDefault();
        //New item variable
        const newItem = {
            name: userInput,
            qty: 1,
            state: false,
        };
        //Push the information to firebase
        const database = getDatabase(firebaseConfig);
        const databaseRef = ref(database, props.userNode + "/items");
        push(databaseRef, newItem);
        setUserInput("");
    };

    return (
        <div className="form-and-list-container">
            <h2 className="items-list-heading">{name} This are your items:</h2>
            <form action="submit" className="add-item-form">
                <label htmlFor="newItem">Add a new item to your list</label>
                <input
                    className="new-item-input"
                    type="text"
                    id="newItem"
                    onChange={handleInputChange}
                    value={userInput}
                />
                <button
                    className="new-item-btn"
                    onClick={handleFormSubmit}
                    disabled={userInput === "" ? true : false}
                >
                    Add Item
                </button>
            </form>
            <ol className="items-list">
                <ItemLi items={items} userNode={props.userNode} />
            </ol>
        </div>
    );
}

export default ItemsList;

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
