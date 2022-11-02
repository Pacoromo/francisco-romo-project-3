import ItemsList from "./ItemsList";

function Main(props) {
    console.log("The Main Component just rendered!");

    return (
        <main className="main-section">
            {props.node ? (
                <ItemsList userNode={props.node} />
            ) : props.intro ? (
                <div className="intro">
                    <h3>Back to basics</h3>
                    <p>Hola</p>
                </div>
            ) : null}
        </main>
    );
}

export default Main;
