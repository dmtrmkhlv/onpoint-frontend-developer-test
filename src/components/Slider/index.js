import {React, useState} from "react";
import styles from "../../styles/App.module.css";

export const Slider = (props) => {
  let [startCoordinates, setStartCoordinates] = useState(0);
  const [endCoordinates, setEndCoordinates] = useState(0);
  const [moveStatus, setMoveStatus] = useState(false);
  const divStyle = {
    left: `${endCoordinates}px`
  };

  const isTouch = () => 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch) || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
      
  const currentXCoordinates = (e)=> isTouch() ? e.nativeEvent.touches[0].clientX : e.clientX;
  
  const sliderMove = (xCoordinates) => {
    let newEndCoordinates;
    if(startCoordinates > xCoordinates){

      newEndCoordinates = endCoordinates + (startCoordinates - xCoordinates);
      console.log(endCoordinates, "endCoordinates");
      setEndCoordinates((newEndCoordinates)*-1);
      // setStartCoordinates(startCoordinates++);
    }
    if(startCoordinates < xCoordinates){

      newEndCoordinates = endCoordinates + (xCoordinates - startCoordinates);
      if(xCoordinates >= 0){
        return;
        }
      setEndCoordinates(newEndCoordinates);
      setStartCoordinates(xCoordinates++);
    }
    
    console.log(startCoordinates, xCoordinates)
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
