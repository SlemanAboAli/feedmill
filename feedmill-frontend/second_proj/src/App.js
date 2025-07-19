import AllMeetupsPage from "./Components/Pages/AllMeetups";
import NewMeetupPage from "./Components/Pages/NewMeetup";
import FavoritePage from "./Components/Pages/Favorites";
import { Routes, Route } from "react-router-dom";

import { useState, useEffect } from "react";
import Layout from "./Components/Layout/Layout";
function App() {
  const [headerColor, setHeaderColor] = useState("#800040");
  const [bodyColor, setBodyColor] = useState("#ffffff");

  useEffect(() => {
    const savedHeader = localStorage.getItem("headerColor");
    const savedBody = localStorage.getItem("bodyColor");
    if (savedHeader) setHeaderColor(savedHeader);
    if (savedBody) setBodyColor(savedBody);
  }, []);
  // useEffect يتم تشغيله  في اول مرة يتم عرض المكون بها و في كل مرة تتغير بها قيمة  bodyColor
  useEffect(() => {
    document.body.style.backgroundColor = bodyColor;
  }, [bodyColor]);


  // دالة لتغيير الألوان وحفظها
  const onChangeColors = (newHeader, newBody) => {
    setHeaderColor(newHeader);
    setBodyColor(newBody);
    localStorage.setItem("headerColor", newHeader);
    localStorage.setItem("bodyColor", newBody);
  };

  return (
    <div>
      <Layout headerColor={headerColor} onChangeColors={onChangeColors}>
        <Routes>
          <Route path="/" element={<AllMeetupsPage />} />
          <Route path="/new-meetup" element={<NewMeetupPage />} />
          <Route path="/favorites" element={<FavoritePage />} />
        </Routes>
      </Layout>
    </div>
  );
}
export default App;
