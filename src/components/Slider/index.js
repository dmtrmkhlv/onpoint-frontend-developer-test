import {React, useState} from "react";
import styles from "../../styles/App.module.css";

export const Slider = (props) => {
  const [mouseCoordinates, setMouseCoordinates] = useState(0);
  const divStyle = {
    color: 'blue',
    background: "red",
    left: `${mouseCoordinates}px`
  };

  const touch = (e)=>{
    setMouseCoordinates(e.clientX);
    console.log(e.clientX);
  }

  return (
    <div onMouseDown={(e) => {
      touch(e)
    }}  className={styles.slider}>
      <div className={styles.slider__header}>
        <div className={styles.slider__header_logo}>L</div>
        <div className={styles.slider__header_title}>PROJECT</div>
      </div>
      <div style={divStyle} className={styles.slider__box}>
        <div className={styles.slider__item}></div>
        <div className={styles.slider__item}></div>
        <div className={styles.slider__item}></div>
      </div>
    </div>
  );

};
