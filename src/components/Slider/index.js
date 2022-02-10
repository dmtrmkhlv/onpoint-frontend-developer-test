import {React, useState} from "react";
import styles from "../../styles/App.module.css";

export const Slider = (props) => {
  const [startCoordinates, setStartCoordinates] = useState(0);
  const [endCoordinates, setEndCoordinates] = useState(0);
  const [moveStatus, setMoveStatus] = useState(false);
  const divStyle = {
    left: `-${endCoordinates}px`
  };

  const isTouch = () => 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch) || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
      
  const currentXCoordinates = (e)=> isTouch() ? e.nativeEvent.touches[0].clientX : e.clientX;
  
  const sliderMove = (xCoordinates) => {
    let newEndCoordinates;
    // To left
    if(startCoordinates > xCoordinates){
      newEndCoordinates = (startCoordinates - xCoordinates);
      setEndCoordinates(newEndCoordinates);
    }
    // To right
    if(startCoordinates < xCoordinates){  
      let oldEndCoordinates = endCoordinates;
      newEndCoordinates = oldEndCoordinates - (xCoordinates - startCoordinates);
      setEndCoordinates(newEndCoordinates);
    }
  }

  const startSwipe = (e)=>{
    setMoveStatus(true);
    setStartCoordinates(currentXCoordinates(e));
  }
  
  const swipe = (e)=>{
    if(moveStatus){
      sliderMove(currentXCoordinates(e));
    }
  }

  return (
    <div 
    onMouseDown={(e) => {startSwipe(e)}}  
    onMouseMove={(e) => {swipe(e)}} 
    onMouseUp={() => {setMoveStatus(false)}} 
    onTouchStart={(e) => {startSwipe(e)}} 
    onTouchMove={(e) => {swipe(e)}} 
    onTouchEnd={() => {setMoveStatus(false)}}
    className={styles.slider}>
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
