import {React} from "react";
import {useSlideAnimation} from "../../hooks/useSlideAnimation"
import styles from "../../styles/App.module.css";

export const Slider = (props) => {
  const { startSwipe, swipe, endSwipe, getEndCoordinates} = useSlideAnimation();
  const sliderStyle = {
    left: `-${getEndCoordinates}px`
  };

  return (
    <div 
    onMouseDown={(e) => {startSwipe(e)}}  
    onMouseMove={(e) => {swipe(e)}} 
    onMouseUp={() => {endSwipe()}} 
    onTouchStart={(e) => {startSwipe(e)}} 
    onTouchMove={(e) => {swipe(e)}} 
    onTouchEnd={() => {endSwipe()}}
    className={styles.slider}>
      <div className={styles.slider__header}>
        <div className={styles.slider__header_logo}>L</div>
        <div className={styles.slider__header_title}>PROJECT</div>
      </div>
      <div style={sliderStyle} className={styles.slider__box}>
        <div className={styles.slider__item}></div>
        <div className={styles.slider__item}></div>
        <div className={styles.slider__item}></div>
      </div>
    </div>
  );

};
