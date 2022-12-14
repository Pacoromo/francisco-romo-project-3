import firebaseConfig from "./firebase";
import { useState, useEffect } from "react";
import { getDatabase, ref, update } from "firebase/database";

function QtyInput(props) {

    //Set the state of the qty input
    const [qtyInput, setQtyInput] = useState(props.qty);

    //update the state of qty input when database changes
    useEffect(() => {
        setQtyInput(props.qty);
    }, [props.qty]);

    //Handle the state of qty input;
    const handleChangeOnQtyInput = (e) => {
        const database = getDatabase(firebaseConfig);
        //create a variable that makes reference to our item status
        const databaseRef = ref(
            database,
            props.userNode + "/items/" + props.itemNode
        );
        //update the information from our database
        update(databaseRef, { qty: e.target.value });
    };

    return (
        <div className="qty-input-label-container">
            <div className="input-container">
                <input
                    type="number"
                    name={props.name + "qty"}
                    id={props.itemNode + "qty"}
                    className="qty-input"
                    min={1}
                    value={qtyInput}
                    onChange={handleChangeOnQtyInput}
                />
            </div>
            <div className="label-container">
                <label htmlFor={props.itemsNode + "qty"} className="sr-only">
                    Quantity
                </label>
            </div>
        </div>
    );
}

export default QtyInput;
