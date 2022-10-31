import firebaseConfig from "./firebase";
import { useState, useEffect } from "react";
import {
    getDatabase,
    ref,
    update
} from "firebase/database";

function Checkbox(props) {
    console.log("The Checkbox Component just rendered!");

    //Set the state of the item
    const [activeBox, setActiveBox] = useState(props.state);

    //update the state of checkbox when database changes
    useEffect(() => {
        setActiveBox(props.state)
    }, [props.state])


    //Handle the state of chechbox;
    const handleStateOfItem = () => {
        const database = getDatabase(firebaseConfig);
        //create a variable that makes reference to our item status
        const databaseRef = ref(database, props.userNode + "/items/" + props.itemNode);
        //update the information from our database
        update(databaseRef, { state: !activeBox });
    };

    return (
        <div className="checkbox-container">
            <input
                type="checkbox"
                name={props.name}
                id={props.itemNode + "checkbox"}
                className="item-checkbox"
                onChange={handleStateOfItem}
                checked={activeBox}
            />
            <label htmlFor={props.itemNode + "checkbox"} className={`item-label ${activeBox ? "active" : ""}`}>
                {props.name}
            </label>
        </div>
    );
}

export default Checkbox;
