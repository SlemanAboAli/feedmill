import classes from "./NewMeetupForm.module.css";
import { useRef } from "react";
function NewMeetupForm(props) {
  const titleInputRef = useRef();
  const imageInputRef = useRef();
  const addressInputRef = useRef();
  const descriptionInputRef = useRef();
  const formRef = useRef();
  function submitHandler(event) {
    event.preventDefault();

    const enteredTitle = titleInputRef.current.value;
    const enteredImage = imageInputRef.current.value;
    const enteredAddress = addressInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    const meetupData = {
      title: enteredTitle,
      image: enteredImage,
      address: enteredAddress,
      description: enteredDescription,
    };
    
    props.onAddMeetup(meetupData);
    formRef.current.reset();
  }

  return (
    <form className={classes.form} onSubmit={submitHandler} ref={formRef}>
      <div className={classes.control}>
        <label htmlFor="title">Meetup Title</label>
        <input type="text" required id="title" ref={titleInputRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="image">Meetup Image</label>
        <input type="url" required id="image" ref={imageInputRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="address">Address</label>
        <input type="text" required id="address" ref={addressInputRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="description">Description</label>
        <textarea
          required
          id="description"
          rows="5"
          ref={descriptionInputRef}
        />
      </div>
      <div className={classes.actions}>
        <button>Add Meetup</button>
      </div>
    </form>
  );
}
export default NewMeetupForm;
