import {React, useState, useEffect} from "react";
import styles from "../../styles/App.module.css";

export const Slider = (props) => {
  const [startCoordinates, setStartCoordinates] = useState(0);
  const [endCoordinates, setEndCoordinates] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [moveStatus, setMoveStatus] = useState(false);
  const divStyle = {
    left: `-${endCoordinates}px`
  };

  /**
   * 
   * @param {number} speed скорость анимации
   * @param {number} boost ускорение анимации
   * @param {number} xUpdate обновление текущей координаты слайда
   * @param {number} newCoordinates новая конечная координата слайда
   */
  const animationSpeed = (speed, boost, xUpdate, newCoordinates)=>{
    let int = setInterval(() => {
      if(swipeDirection == 'toRight'){
        xUpdate = xUpdate - speed;
        if(xUpdate <= newCoordinates + 50){
          xUpdate = newCoordinates;
        }
      }
      if(swipeDirection == 'toLeft'){
        xUpdate = xUpdate + speed;
        if(xUpdate >= newCoordinates + 50){
          xUpdate = newCoordinates;
        }
      }
      speed += boost;
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
    let newCoordinates;
    if(swipeDirection === 'toLeft'){
      if(endCoordinates == 0){
        newCoordinates = width;
      }
      if(endCoordinates == width){
        newCoordinates = width * 2;
      }
      if(endCoordinates == width * 2){
        return;
      }
    }
    if(swipeDirection === 'toRight'){
      if(endCoordinates == 0){
        return;
      }
      if(endCoordinates == width){
        newCoordinates = 0;
      }
      if(endCoordinates == width * 2){
        newCoordinates = width;
      }
    }
    animationSpeed(1, 2, x, newCoordinates);
  }

  const isTouch = () => 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch) || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
      
  const currentXCoordinates = (e)=> isTouch() ? e.nativeEvent.touches[0].clientX : e.clientX;
  
  /**
   * 
   * @param {number} xCoordinates координата курсора в момент касания
   * @returns 
   */
  const defineSlideDirection = (xCoordinates) => {
    // To left
    if(startCoordinates > xCoordinates){
      setSwipeDirection("toLeft");
    }
    // To right
    if(startCoordinates < xCoordinates){  
      setSwipeDirection("toRight");
    }
  }

  const startSwipe = (e)=>{
    setMoveStatus(true);
    setStartCoordinates(currentXCoordinates(e));
  }

  const endSwipe = ()=>{
    setMoveStatus(false);
    swipeAnimation(endCoordinates, windowWidth);
  }
  
  const swipe = (e)=>{
    if(moveStatus){
      defineSlideDirection(currentXCoordinates(e));
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
