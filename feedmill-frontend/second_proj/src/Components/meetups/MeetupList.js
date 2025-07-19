// import MeetupItem from "./MeetupItem";
// import Slider from "react-slick";
// import classes from "./MeetupList.module.css";
// import "./MeetupSlider.css"; // ملف للتنسيقات الإضافية إن احتجت
// import { useState } from "react";
// function MeetupList(props) {
//   const settings = {
//     dots: true, // نقاط أسفل السلايدر
//     infinite: false,
//     speed: 500,
//     slidesToShow: 3, // عدد العناصر الظاهرة دفعة واحدة
//     slidesToScroll: 1,
//     responsive: [
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 1, // في الشاشات الصغيرة
//         },
//       },
//     ],
//   };
//   const [isHorizontal, setIsHorizontal] = useState(false);

//   return (
//     <Slider {...settings}>
//       <div>
//         <button onClick={() => setIsHorizontal((prev) => !prev)}>
//           {isHorizontal ? "عرض شبكي" : "عرض أفقي"}
//         </button>

//         <ul className={isHorizontal ? classes.horizontal : classes.list}>
//           {props.meetups.map((meetup) => (
//             <MeetupItem
//               key={meetup.id}
//               id={meetup.id}
//               image={meetup.image}
//               title={meetup.title}
//               address={meetup.address}
//               description={meetup.description}
//             />
//           ))}
//         </ul>
//       </div>
//     </Slider>
//   );
// }
// export default MeetupList;
//====================================================================
import MeetupItem from "./MeetupItem";
import Slider from "react-slick";
import classes from "./MeetupList.module.css";
import "./MeetupSlider.css";
import { useState } from "react";

function NextArrow(props) {
  return (
    <div className="custom-arrow next" onClick={props.onClick}>
      ▶
    </div>
  );
}

function PrevArrow(props) {
  return (
    <div className="custom-arrow prev" onClick={props.onClick}>
      ◀
    </div>
  );
}

function MeetupList(props) {
  const [useSlider, setUseSlider] = useState(true);

  const settings = {
    dots: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,

    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          className={classes.toggleButton}
          onClick={() => setUseSlider((prev) => !prev)}
        >
          {useSlider ? "عرض عمودي" : "عرض سلايدر"}
        </button>
      </div>

      {useSlider ? (
        <Slider {...settings}>
          {props.meetups.map((meetup) => (
            <div key={meetup.id}>
              <MeetupItem {...meetup} />
            </div>
          ))}
        </Slider>
      ) : (
        <ul className={classes.list}>
          {props.meetups.map((meetup) => (
            <MeetupItem key={meetup.id} {...meetup} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default MeetupList;
