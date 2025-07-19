import { useState } from "react";
import Modal from "./modal";
import Backdrop from "./backdrop";
function Todo(props) {
  const [ModalIsOpen, setModalIsOpen] = useState(false);
  function DeleteHandler() {
    setModalIsOpen(true);
  }
  function closeModalHandler(){
    setModalIsOpen(false);
  }
  return (
    <div>
      <div className="card">
        <h2>{props.text}</h2>
        <div className="actions">
          <button className="btn" onClick={DeleteHandler}>
            Delete
          </button>
        </div>
      </div>
         {ModalIsOpen && <Modal onConfirm={closeModalHandler} onCancel={closeModalHandler} />}
    {ModalIsOpen && <Backdrop onCancel={closeModalHandler}/>}
    </div>
 
  );
}
export default Todo;
