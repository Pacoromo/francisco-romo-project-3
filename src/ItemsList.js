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
    const [newItemInput, setNewItemInput] = useState("");

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

    //Take care of the update new item input logic
    const handleInputChange = (e) => {
        setNewItemInput(e.target.value);
    };

    //Submit the value to firebase
    const handleFormSubmit = (e) => {
        e.preventDefault();
        //New item variable
        const newItem = {
            name: newItemInput,
            qty: 1,
            state: false,
        };
        //Push the information to firebase
        const database = getDatabase(firebaseConfig);
        const databaseRef = ref(database, props.userNode + "/items");
        push(databaseRef, newItem);
        setNewItemInput("");
    };

    return (
        <section className="items-section">
            <div className="form-container">
                <h2 className="items-list-heading">Hi {name}! This are your items:</h2>
                <form action="submit" className="add-item-form">
                    <label htmlFor="newItem">Add a new item to your list</label>
                    <input
                        className="new-item-input"
                        type="text"
                        id="newItem"
                        onChange={handleInputChange}
                        value={newItemInput}
                    />
                    <button
                        className="new-item-btn"
                        onClick={handleFormSubmit}
                        disabled={newItemInput === "" ? true : false}
                    >
                        Add Item
                    </button>
                </form>
            </div>

            <div className="list-container">
                <ol className="items-list">
                    <ItemLi items={items} userNode={props.userNode} />
                </ol>
            </div>
        </section>
    );
}

export default ItemsList;
