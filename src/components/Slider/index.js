import {React, useState, useEffect} from "react";
import styles from "../../styles/App.module.css";

export const Slider = (props) => {
  const [startCoordinates, setStartCoordinates] = useState(0);
  const [endCoordinates, setEndCoordinates] = useState(0);
  const [prevEndCoordinates, setPrevEndCoordinates] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [moveStatus, setMoveStatus] = useState(false);
  const divStyle = {
    left: `-${endCoordinates}px`
  };

  /**
   * 
   * @param {number} boost ускорение анимации
   * @param {number} xUpdate обновление текущей координаты слайда
   * @param {number} newCoordinates новая конечная координата слайда
   */
  const animationSpeed = (boost, xUpdate, newCoordinates)=>{
    let int = setInterval(() => {
      xUpdate = xUpdate - boost;
      boost += 10;
      if(xUpdate <= newCoordinates + 50){
        xUpdate = newCoordinates;
      }
      if(xUpdate == newCoordinates){
        clearInterval(int);
      }
      setEndCoordinates(xUpdate);
    }, 5);
  }
/**
 * 
 * @param {number} x координата курсора в момент прекращения касания
 * @param {nember} width ширина экрана
 */
  const swipeAnimation = (x, width)=>{
    console.log(swipeDirection)
    let newCoordinates;
    let xUpdate = x;
    let boost = 10;
    if(swipeDirection === 'toLeft'){
      if(prevEndCoordinates == 0){
        newCoordinates = width;
      }
      if(prevEndCoordinates == width){
        newCoordinates = width * 2;
      }
    }
    if(swipeDirection === 'toRight'){
      if(prevEndCoordinates == width){
        newCoordinates = 0;
      }
      if(prevEndCoordinates == width * 2){
        newCoordinates = width;
      }
    }
    // if(x < width/2){
    //   newCoordinates = 0;
    // }
    // if(x >= width/2){
    //   newCoordinates = width;
    // }
    // if(x < (width *2 + width/2) && x > (width * 2)){
    //   newCoordinates = width;
    // }
    // if(x > (width + width/2) && x <= (width * 2)){
    //   newCoordinates = width * 2;
    // }
    animationSpeed(boost, xUpdate, newCoordinates);
    // setEndCoordinates(newCoordinates);
    setPrevEndCoordinates(newCoordinates);
  }

  const isTouch = () => 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch) || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
      
  const currentXCoordinates = (e)=> isTouch() ? e.nativeEvent.touches[0].clientX : e.clientX;
  
  /**
   * 
   * @param {number} xCoordinates координата курсора в момент касания
   * @returns 
   */
  const sliderMove = (xCoordinates) => {
    let newEndCoordinates;
    // To left
    if(startCoordinates > xCoordinates){
      newEndCoordinates = Math.round(prevEndCoordinates + (startCoordinates - xCoordinates));
      if(newEndCoordinates >= windowWidth * 2){
        return;
      }
      setSwipeDirection("toLeft");
      setEndCoordinates(newEndCoordinates);
    }
    // To right
    if(startCoordinates < xCoordinates){  
      newEndCoordinates = Math.round(prevEndCoordinates - (xCoordinates - startCoordinates));
      setSwipeDirection("toRight");
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
