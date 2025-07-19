import { useNavigate } from "react-router-dom";
import NewMeetupForm from "../meetups/NewMeetupForm";
import { useState } from "react";

function NewMeetupPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  async function addMeetupHandler(meetupData) {
    try {
      const response = await fetch(
        "https://react-getting-started-9a0b5-default-rtdb.firebaseio.com/meetups.json",
        {
          method: "POST",
          body: JSON.stringify(meetupData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("حدث خطأ أثناء الإرسال!");
      }

      // تم الإرسال بنجاح
      navigate("/", { replace: true });
    } catch (err) {
      // فشل الاتصال بالإنترنت أو مشكلة بالخادم
      setError("تعذر الاتصال بالخادم. تأكد من اتصال الإنترنت.");
    }
  }

  return (
    <section>
      <h1>Add New Meetup</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </section>
  );
}

export default NewMeetupPage;
