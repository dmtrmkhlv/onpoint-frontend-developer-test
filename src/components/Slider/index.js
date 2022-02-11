import {React, useState, useEffect} from "react";
import styles from "../../styles/App.module.css";

export const Slider = (props) => {
  const [startCoordinates, setStartCoordinates] = useState(0);
  const [endCoordinates, setEndCoordinates] = useState(0);
  const [prevEndCoordinates, setPrevEndCoordinates] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [moveStatus, setMoveStatus] = useState(false);
  const divStyle = {
    left: `-${endCoordinates}px`
  };

  const swipeAnimation = (x, width)=>{
    let newCoordinates = 0;
    if(x < width/2){

    }
    if(x >= width/2){
      newCoordinates = width;
    }
    if(x > width && x <= (width + width/2)){
      newCoordinates = width * 2;
    }
    setEndCoordinates(newCoordinates);
    setPrevEndCoordinates(newCoordinates);
  }

  const isTouch = () => 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch) || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
      
  const currentXCoordinates = (e)=> isTouch() ? e.nativeEvent.touches[0].clientX : e.clientX;
  
  const sliderMove = (xCoordinates) => {
    let newEndCoordinates;
    // To left
    if(startCoordinates > xCoordinates){
      newEndCoordinates = Math.round(prevEndCoordinates + (startCoordinates - xCoordinates));
      if(newEndCoordinates >= windowWidth * 2){
        return;
      }
      setEndCoordinates(newEndCoordinates);
    }
    // To right
    if(startCoordinates < xCoordinates){  
      newEndCoordinates = Math.round(prevEndCoordinates - (xCoordinates - startCoordinates));
      setEndCoordinates(newEndCoordinates);
    }
  }

  const startSwipe = (e)=>{
    setMoveStatus(true);
    setStartCoordinates(currentXCoordinates(e));
  }

  const endSwipe = ()=>{
    setMoveStatus(false);
    setPrevEndCoordinates(endCoordinates);
    swipeAnimation(endCoordinates, windowWidth);
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
    onMouseUp={() => {endSwipe()}} 
    onTouchStart={(e) => {startSwipe(e)}} 
    onTouchMove={(e) => {swipe(e)}} 
    onTouchEnd={() => {endSwipe()}}
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
