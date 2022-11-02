import firebaseConfig from "./firebase";
import { useState, useEffect } from "react";
import { getDatabase, ref, update } from "firebase/database";

function Checkbox(props) {

    //Set the state of the item
    const [activeBox, setActiveBox] = useState(props.state);

    //update the state of checkbox when database changes
    useEffect(() => {
        setActiveBox(props.state);
    }, [props.state]);

    //Handle the state of chechbox;
    const handleStateOfItem = () => {
        const database = getDatabase(firebaseConfig);
        //create a variable that makes reference to our item status
        const databaseRef = ref(
            database,
            props.userNode + "/items/" + props.itemNode
        );
        //update the information from our database
        update(databaseRef, { state: !activeBox });
    };

    return (
        <div className="checkbox-label-container">
            <div className="checkbox-container">
                <input
                    className="item-checkbox"
                    type="checkbox"
                    name={props.name}
                    id={props.itemNode + "checkbox"}
                    onChange={handleStateOfItem}
                    checked={activeBox}
                />
            </div>
            <div className="label-container">
                <label
                    className={`item-label ${activeBox ? "item-checked" : ""}`}
                    htmlFor={props.itemNode + "checkbox"}
                >
                    {props.name}
                </label>
            </div>
        </div>
    );
}

export default Checkbox;
