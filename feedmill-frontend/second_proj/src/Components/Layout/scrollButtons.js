import { useEffect, useState } from "react";
import "./ScrollButton.css";

function ScrollButton() {
  const [scrollDir, setScrollDir] = useState("down");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      if (scrollTop + windowHeight >= scrollHeight - 200) {
        setScrollDir("up");
      } else if (scrollTop <= 200) {
        setScrollDir("down");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // لضمان تنظيف الحدث عند الخروج من المكون، مما يقي من الأداء السيء أو الأخطاء.
  }, []);

  const handleClick = () => {
    if (scrollDir === "down") {
      window.scrollTo({ top: document.documentElement.scrollHeight , behavior: "smooth" });//scroll down
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      className={`scroll-button ${scrollDir}`}
      onClick={handleClick}
      title={scrollDir === "down" ? "Scroll Down" : "Scroll Up"}
    >
        <span className="arrow">{scrollDir === "down" ? "↓" : "↑"}</span>
      
    </button>
  );
}

export default ScrollButton;
