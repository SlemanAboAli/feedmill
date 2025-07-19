
import MainNavigation from "./MainNavigation";
import classes from "./Layout.module.css";
import { useEffect, useState } from "react";
import ScrollButtons from "./scrollButtons";

function Layout(props) {
  // حالة تظهر زر الصعود فقط إذا تم التمرير لأسفل
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <div>
      <MainNavigation
        headerColor={props.headerColor}
        onChangeColors={props.onChangeColors}
      />
      <main className={classes.main}>{props.children}</main>
      <ScrollButtons/>

      {/* زر للصعود */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            padding: "10px 15px",
            fontSize: "16px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#800040",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
          aria-label="Scroll to top"// مثل تلميح او توضيح تقرأ من قبل قارئ الشاشة ليس لها وظيفة اخرى
        >
          ↑
        </button>
      )}

      {/* زر للنزول */}
      <button
        onClick={scrollToBottom}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 15px",
          fontSize: "16px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#004466",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
        aria-label="Scroll to bottom"
      >
        ↓
      </button>
    </div>
  );
}

export default Layout;
