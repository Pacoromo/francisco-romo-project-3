import firebaseConfig from "./firebase";
import { getDatabase, ref, remove } from "firebase/database";
import Checkbox from "./Checkbox";
import QtyInput from "./Qtyinput";

function ItemLi(props) {
    console.log("The ItemsLi Component just rendered!");

    //This will remove the book from the list

    const handleRemoveItem = (itemNode) => {
        const database = getDatabase(firebaseConfig);
        const databaseRef = ref(database, props.userNode + "/items/" + itemNode);
        remove(databaseRef);
    };

    return (
        <div className="list-item-container">
            {props.items.map((item) => {
                const {
                    key = item,
                    name = item.item.name,
                    qty = item.item.qty,
                    state = item.item.state,
                } = item;
                return (
                    <li className="item-li" key={key}>
                        <QtyInput
                            userNode={props.userNode}
                            itemNode={key}
                            name={name}
                            qty={qty}
                        />
                        <Checkbox
                            userNode={props.userNode}
                            itemNode={key}
                            name={name}
                            state={state}
                        />
                        <button
                            className="remove-item-btn"
                            onClick={() => {
                                handleRemoveItem(key);
                            }}
                        >
                            ✖️
                        </button>
                    </li>
                );
            })}
        </div>
    );
}

export default ItemLi;

/*
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
*/
