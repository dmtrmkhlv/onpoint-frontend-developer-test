import {React, useState, useRef, useEffect} from "react";
import styles from "../../styles/App.module.css";

export const Slider = (props) => {
  const [startCoordinates, setStartCoordinates] = useState(0);
  const [endCoordinates, setEndCoordinates] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState('');
  const [isSwipe, setIsSwipe] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const slideStyle = {
    left: `-${endCoordinates}px`
  };


  const ref = useRef();
  const sliderBoxElement  = useRef(
    new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setWindowWidth(width / 3)
    })
  );
 
  useEffect(() => {
    sliderBoxElement.current.observe(ref.current);
  }, 
  [ref, sliderBoxElement]);

  /**
   * 
   * @param {number} speed скорость анимации
   * @param {number} boost ускорение анимации
   * @param {number} xUpdate обновление текущей координаты слайда
   * @param {number} newCoordinates новая конечная координата слайда
   * @param {string} direction направление движения свайпа
   */
  const animationSpeed = (speed, boost, xUpdate, newCoordinates, direction)=>{
    let int = setInterval(() => {
      if(direction == 'toRight'){
        xUpdate = xUpdate - speed;
        if(xUpdate <= newCoordinates + 50){
          xUpdate = newCoordinates;
        }
      }
      if(direction == 'toLeft'){
        xUpdate = xUpdate + speed;
        if(xUpdate >= newCoordinates + 50){
          xUpdate = newCoordinates;
        }
      }
      speed += boost;
      if(xUpdate == newCoordinates){
        clearInterval(int);
        setSwipeDirection("");
        setStartCoordinates(0);
        setIsSwipe(false);
      }
      setEndCoordinates(xUpdate);
    }, 5);
  }
/**
 * 
 * @param {number} endXCoordinates отступ слева
 * @param {number} widthScreen ширина экрана
 */
  const swipeAnimation = (endXCoordinates, widthScreen)=>{
    let newCoordinates;
    if(swipeDirection === 'toLeft'){
      if(endCoordinates == 0){
        newCoordinates = widthScreen;
      }
      if(endCoordinates == widthScreen){
        newCoordinates = widthScreen * 2;
      }
      if(endCoordinates == widthScreen * 2){
        return;
      }
    }
    if(swipeDirection === 'toRight'){
      if(endCoordinates == 0){
        return;
      }
      if(endCoordinates == widthScreen){
        newCoordinates = 0;
      }
      if(endCoordinates == widthScreen * 2){
        newCoordinates = widthScreen;
      }
    }
    animationSpeed(1, 2, endXCoordinates, newCoordinates, swipeDirection);
  }

  /**
   * 
   * @returns возвращает является ли собыие касанием
   */
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
    setStartCoordinates(currentXCoordinates(e));
  }

  const swipe = (e)=>{
    setIsSwipe(true);
      defineSlideDirection(currentXCoordinates(e));
  }

  const endSwipe = (e)=>{
    if(isSwipe){
      swipeAnimation(endCoordinates, windowWidth);
    }
  }

  const swipeToFirstSlide = (e)=>{
    if(endCoordinates == 0){
      return;
    }
    animationSpeed(1, 2, endCoordinates, 0, 'toRight');   
  }

    const swipeFromFirstToSecondSlide = (e)=>{
    animationSpeed(1, 2, endCoordinates, windowWidth, 'toLeft');   
  }
  
  return (
    <div 
    // onMouseDown={(e) => {startSwipe(e)}}  
    // onMouseMove={(e) => {swipe(e)}} 
    // onMouseUp={(e) => {endSwipe(e)}} 
    onTouchStart={(e) => {startSwipe(e)}} 
    onTouchMove={(e) => {swipe(e)}} 
    onTouchEnd={(e) => {endSwipe(e)}}
    className={styles.slider}>
      <div className={styles.slider__header}>
        <div 
        onClick={(e) => {swipeToFirstSlide(e)}} 
        className={styles.slider__header_logo}>L</div>
        <div className={styles.slider__header_title}>PROJECT</div>
      </div>
      <div ref={ref} style={slideStyle} className={styles.slider__box}>
        <div className={styles.slider__item}></div>
        <div className={styles.slider__item}></div>
        <div className={styles.slider__item}></div>
      </div>
    </div>
  );

};
