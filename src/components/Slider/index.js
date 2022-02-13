import { React, useState, useRef, useEffect, useCallback } from "react";
import styles from "../../styles/App.module.css";

export const Slider = (props) => {
  const [startCoordinates, setStartCoordinates] = useState(0);
  const [endCoordinates, setEndCoordinates] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState("");
  const [scrollTextRefTop, setScrollTextRefTop] = useState(0);
  const [scrollLineHeight, setScrollLineHeight] = useState(0);
  const [startScrollTextButton, setStartScrollTextButton] = useState(0);
  const [startScrollButton, setStartScrollButton] = useState(0);
  const [isSwipe, setIsSwipe] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupSlide, setPopupSlide] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const slideStyle = {
    left: `-${endCoordinates}px`,
  };

  const popupButtonStyle = {
    background: "#ff6a9f",
    border: "2px solid #ff6a9f",
  };

  const scrollTextRef = useRef();
  const scrollLineRef = useRef();
  const scrollButtonRef = useRef();
  const popupLeftSlideRef = useRef();
  const popupRightSlideRef = useRef();
  const popupDotLeftRef = useRef();
  const popupDotRightRef = useRef();

  const startScrollTextWithButton = (e) => {
    setIsSwipe(false);
    e.stopPropagation();
    setStartScrollTextButton(e.nativeEvent.touches[0].clientY);
    setStartScrollButton(+e.target.style.top.split("px")[0]);
  };

  const endSwipeScrollTextWithButton = (e) => {
    setIsSwipe(false);
    e.stopPropagation();
    setStartScrollTextButton(0);
  };

  const swipeScrollTextWithButton = (e) => {
    e.stopPropagation();
    let currentCoordinate = e.nativeEvent.touches[0].clientY;
    const scrollTextHeight = scrollTextRef.current.clientHeight;
    const scrollTextBoxHeight = scrollTextRef.current.scrollHeight;
    const scrollButtonHeight = scrollButtonRef.current.clientHeight;
    let scrollButtonCurrent =
      startScrollButton + Math.round(currentCoordinate - startScrollTextButton);
    let newScrollTextRefTop = Math.round(
      scrollButtonCurrent *
        ((scrollTextBoxHeight - scrollTextHeight) / scrollLineHeight)
    );
    if (
      newScrollTextRefTop >= 0 &&
      newScrollTextRefTop < scrollTextBoxHeight - scrollTextHeight
    ) {
      scrollButtonRef.current.style.top = `${scrollButtonCurrent}px`;
      scrollTextRef.current.scrollTop = newScrollTextRefTop;
    }
  };

  const onScrollText = (e) => {
    e.stopPropagation();
    const scrollTextHeight = e.target.scrollHeight;
    const scrollTop = scrollTextRef.current.scrollTop;
    const scrollButtonHeight = scrollButtonRef.current.clientHeight;
    setScrollTextRefTop(scrollTop);
    scrollButtonRef.current.style.top = `${
      Math.round(
        scrollTop *
          ((scrollLineHeight - scrollButtonHeight / 2) / scrollTextHeight)
      ) + 3
    }px`;
  };

  useEffect(() => {
    setScrollLineHeight(scrollLineRef.current.clientHeight);
  }, []);

  const ref = useRef();
  const sliderBoxElement = useRef(
    new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      // setWindowWidth(width / 3);
    })
  );

  useEffect(() => {
    sliderBoxElement.current.observe(ref.current);
  }, [ref, sliderBoxElement]);

  /**
   *
   * @param {number} speed скорость анимации
   * @param {number} boost ускорение анимации
   * @param {number} xUpdate обновление текущей координаты слайда
   * @param {number} newCoordinates новая конечная координата слайда
   * @param {string} direction направление движения свайпа
   */
  const animationSpeed = (speed, boost, xUpdate, newCoordinates, direction) => {
    let int = setInterval(() => {
      if (direction == "toRight") {
        xUpdate = xUpdate - speed;
        if (xUpdate <= newCoordinates + 50) {
          xUpdate = newCoordinates;
        }
      }
      if (direction == "toLeft") {
        xUpdate = xUpdate + speed;
        if (xUpdate >= newCoordinates + 50) {
          xUpdate = newCoordinates;
        }
      }
      speed += boost;
      if (xUpdate == newCoordinates) {
        clearInterval(int);
        setSwipeDirection("");
        setStartCoordinates(0);
        setIsSwipe(false);
      }
      setEndCoordinates(xUpdate);
    }, 5);
  };
  /**
   *
   * @param {number} endXCoordinates отступ слева
   * @param {number} widthScreen ширина экрана
   */
  const swipeAnimation = (endXCoordinates, widthScreen) => {
    let newCoordinates;
    if (swipeDirection === "toLeft") {
      if (endCoordinates == 0) {
        newCoordinates = widthScreen;
      }
      if (endCoordinates == widthScreen) {
        newCoordinates = widthScreen * 2;
      }
      if (endCoordinates == widthScreen * 2) {
        return;
      }
    }
    if (swipeDirection === "toRight") {
      if (endCoordinates == 0) {
        return;
      }
      if (endCoordinates == widthScreen) {
        newCoordinates = 0;
      }
      if (endCoordinates == widthScreen * 2) {
        newCoordinates = widthScreen;
      }
    }
    animationSpeed(1, 2, endXCoordinates, newCoordinates, swipeDirection);
  };

  /**
   *
   * @returns возвращает является ли собыие касанием
   */
  const isTouch = () =>
    "ontouchstart" in window ||
    (window.DocumentTouch && document instanceof window.DocumentTouch) ||
    navigator.maxTouchPoints > 0 ||
    window.navigator.msMaxTouchPoints > 0;

  const currentXCoordinates = (e) =>
    isTouch() ? e.nativeEvent.touches[0].clientX : e.clientX;

  /**
   *
   * @param {number} xCoordinates координата курсора в момент касания
   * @returns
   */
  const defineSlideDirection = (xCoordinates) => {
    // To left
    if (startCoordinates > xCoordinates) {
      setSwipeDirection("toLeft");
    }
    // To right
    if (startCoordinates < xCoordinates) {
      setSwipeDirection("toRight");
    }
  };

  const startSwipe = (e) => {
    setStartCoordinates(currentXCoordinates(e));
  };

  const swipe = (e) => {
    setIsSwipe(true);
    defineSlideDirection(currentXCoordinates(e));
  };

  const endSwipe = (e) => {
    if (isSwipe) {
      swipeAnimation(endCoordinates, windowWidth);
    }
  };

  const swipeToFirstSlide = (e) => {
    if (endCoordinates == 0) {
      return;
    }
    animationSpeed(1, 2, endCoordinates, 0, "toRight");
  };

  const swipeFromFirstToSecondSlide = (e) => {
    animationSpeed(1, 2, endCoordinates, windowWidth, "toLeft");
  };

  const swipeScrollText = (e) => {
    e.stopPropagation();
  };

  const popupOpen = (e) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  const popupClose = (e) => {
    e.stopPropagation();
    setShowPopup(false);
  };

  const setSlideNum = useCallback(
    (num) => {
      setPopupSlide(null);
      setTimeout(() => {
        setPopupSlide(num);
      }, 100);

      if (num == 1) {
        popupDotLeftRef.current.style.backgroundColor = "#ff6a9f";
        popupDotLeftRef.current.style.border = "2px solid #ff6a9f";
      } else {
        popupDotLeftRef.current.style.backgroundColor = "#ffffff";
        popupDotLeftRef.current.style.border = "2px solid #171717";
      }
      if (num == 2) {
        popupDotRightRef.current.style.backgroundColor = "#ff6a9f";
        popupDotRightRef.current.style.border = "2px solid #ff6a9f";
      } else {
        popupDotRightRef.current.style.backgroundColor = "#ffffff";
        popupDotRightRef.current.style.border = "2px solid #171717";
      }
    },
    [popupSlide]
  );

  return (
    <div
      // onMouseDown={(e) => {startSwipe(e)}}
      // onMouseMove={(e) => {swipe(e)}}
      // onMouseUp={(e) => {endSwipe(e)}}
      onTouchStart={(e) => {
        startSwipe(e);
      }}
      onTouchMove={(e) => {
        swipe(e);
      }}
      onTouchEnd={(e) => {
        endSwipe(e);
      }}
      className={styles.slider}
    >
      <div className={styles.slider__header}>
        <div
          onClick={(e) => {
            swipeToFirstSlide(e);
          }}
          className={styles.slider__header_logo}
        ></div>
        <div className={styles.slider__header_title}>PROJECT</div>
      </div>
      <div ref={ref} style={slideStyle} className={styles.slider__box}>
        <div className={styles.slider__item + " " + styles.slider__item_one}>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_title}>
            <br />
            ПРИВЕТ,
          </div>
          <div className={styles.slider__item_text}>
            <p>
              ЭТО <span className={styles.slider__item_text_bold}>НЕ</span>{" "}
              КОММЕРЧЕСКОЕ ЗАДАНИЕ
            </p>
            <div
              onClick={(e) => {
                swipeFromFirstToSecondSlide(e);
              }}
              className={styles.slider__button + " " + styles.slider__item_one}
            >
              <div className={styles.slider__button_bg}></div>
              <div className={styles.slider__button_logo}></div>
              <div className={styles.slider__button_text}>Что дальше?</div>
            </div>
          </div>
        </div>
        <div className={styles.slider__item + " " + styles.slider__item_two}>
          <div
            className={styles.slider__item_bg + " " + styles.animateSlideTwo}
          ></div>
          <div
            className={styles.slider__item_bg + " " + styles.animateSlideTwo}
          ></div>
          <div
            className={styles.slider__item_bg + " " + styles.animateSlideTwo}
          ></div>
          <div
            className={styles.slider__item_bg + " " + styles.animateSlideTwo}
          ></div>
          <div
            className={styles.slider__item_bg + " " + styles.animateSlideTwo}
          ></div>
          <div className={styles.slider__item_title}>
            текст <br />
            сообщения
          </div>
          <div className={styles.slider__textarea}>
            <div ref={scrollLineRef} className={styles.slider__textarea_scroll}>
              <div
                ref={scrollButtonRef}
                onTouchStart={(e) => {
                  startScrollTextWithButton(e);
                }}
                onTouchMove={(e) => {
                  swipeScrollTextWithButton(e);
                }}
                onTouchEnd={(e) => {
                  endSwipeScrollTextWithButton(e);
                }}
                className={styles.slider__textarea_button}
              ></div>
            </div>
            <div
              ref={scrollTextRef}
              onTouchMove={(e) => {
                swipeScrollText(e);
              }}
              onScroll={(e) => {
                onScrollText(e);
              }}
              className={styles.slider__textarea_text}
            >
              <p>
                <span className={styles.slider__textarea_text_bold}>
                  Lorem ipsum dolor sit amet
                </span>{" "}
                consectetur adipisicing elit. Sint, laborum temporibus? Quam
                dicta repellat quaerat aliquid reiciendis beatae maiores
                doloremque vel necessitatibus, deserunt numquam, esse quibusdam
                nulla iusto laudantium adipisci? Magni ipsa cupiditate ut nemo?
                Iusto animi, laudantium modi sequi aperiam asperiores possimus
                sint eligendi perspiciatis deleniti, neque impedit dicta
                praesentium rem provident earum quia quasi nam aspernatur,
                laborum dolorum? Obcaecati sit amet, nulla nisi cumque similique
                delectus iste nobis sequi, reiciendis quisquam fuga excepturi
                illo deserunt vitae! Laborum minus aliquid vitae iure expedita
                consequatur necessitatibus cupiditate quia voluptatem autem.
                Nemo veritatis dolore nisi porro vitae commodi tenetur odio,
                iure fugiat recusandae pariatur reprehenderit earum dicta
                aspernatur quaerat unde consequuntur eligendi voluptas tempora.
                Excepturi dolores necessitatibus iure illo omnis esse! Officiis
                harum asperiores quis est cumque praesentium eaque deserunt
                ullam mollitia itaque quos rem unde illum necessitatibus ab
                exercitationem sunt nesciunt commodi earum maiores eos
                accusantium aspernatur, repellat quam? Quae. Incidunt voluptate
                impedit et minima vero at porro, adipisci culpa molestias
                placeat nam vel. Omnis ipsum similique, minus totam
                necessitatibus quia? Accusantium error dicta velit earum beatae
                ipsa, voluptatem fugiat? Veniam, repellat impedit numquam
                ratione, architecto eligendi eius soluta, vero cumque nisi nihil
                excepturi magnam! Quae quaerat quia enim adipisci nostrum
                voluptatibus quod vel voluptate harum? Voluptas iusto optio ex.
                Accusamus modi eos aliquam a iure magnam itaque nemo accusantium
                ipsam dolore ut placeat aliquid repellat molestias repellendus
                reprehenderit consequuntur corrupti repudiandae dicta commodi
                dolorum esse culpa, vero consectetur. Qui? Nisi fugiat suscipit
                doloremque id alias! Tempora aperiam alias eligendi officia
                nisi, optio numquam officiis! Adipisci illo dicta doloribus
                similique dolorum ipsum aperiam expedita voluptas sapiente,
                rerum, quasi repellendus culpa? Vero dolorum, molestias
                repudiandae laboriosam perspiciatis id nisi exercitationem
                ducimus quod. Maxime, neque? Officia, quidem. Fugiat deserunt
                minus quam illo consequatur cum laboriosam voluptatum accusamus
                accusantium? Quo quis accusamus nulla? Ducimus a, fuga cum
                ratione eos magnam esse mollitia rem, iusto sunt deleniti itaque
                odit fugiat quam? Nostrum commodi numquam fugiat atque officiis
                sit sapiente! Recusandae laudantium iure sit quae! Iure quos est
                ab obcaecati asperiores nulla illo id saepe dolorem, laboriosam
                tempora iste excepturi labore perferendis perspiciatis similique
                provident animi nemo tenetur accusantium officiis. Quos possimus
                maiores ab animi? Consequuntur, nisi suscipit possimus officia
                quos, totam voluptas pariatur dolor eaque tempore repellendus
                dignissimos debitis eum atque nostrum voluptate dolores mollitia
                aliquid iure necessitatibus facilis nulla a quibusdam nihil.
                Nemo. Beatae recusandae odio sequi ea ab nam consequuntur
                laboriosam illo ad facilis. Velit minima, aperiam tempore
                facilis facere consequatur vitae, possimus, odio asperiores
                laboriosam provident molestiae porro animi. Obcaecati, vel?
                Magnam, blanditiis eaque harum dolorum deserunt odit
                exercitationem ratione atque. Rem dicta ex repellat perspiciatis
                harum ullam nulla, eveniet dolor, iusto quas eius error dolorum
                temporibus commodi aspernatur fugiat quo. Natus, eum nam id
                tenetur, iure reprehenderit dolore aspernatur rem perspiciatis
                porro quos autem quibusdam ab modi consequatur. Libero quas
                saepe velit vero quae nisi nesciunt dicta dolorem atque
                laboriosam. Repudiandae exercitationem ipsa dolorum inventore
                vel libero nisi, nemo similique ea est, officia ab consectetur
                eveniet, excepturi maxime quia explicabo. Amet debitis
                consectetur, aspernatur tenetur illum blanditiis ullam harum
                quis. Expedita eaque quidem enim quasi sed cum inventore.
                Perferendis maiores esse eligendi iure debitis cumque animi
                dolorem provident quod blanditiis, unde fugiat quo nesciunt nam
                totam quidem suscipit non nihil? Libero eligendi voluptatibus
                maiores? Distinctio facilis nemo recusandae, eligendi esse vitae
                porro doloribus sint aperiam consectetur adipisci voluptas
                cupiditate voluptatum quisquam exercitationem vero provident
                dolorem, dolor animi sequi sunt dolores! Illo quibusdam eligendi
                quos. Voluptas amet fugit obcaecati odit tenetur consectetur,
                totam vitae doloribus quam aliquid assumenda cum ab possimus!
                Soluta quae beatae consectetur placeat velit, incidunt repellat
                aperiam. Veritatis? Quidem in perferendis tenetur quisquam quia
                quo magni harum consequuntur laborum est ipsa id nemo qui ullam
                sapiente ratione, cupiditate aspernatur delectus voluptatibus
                possimus odio ducimus dolores. Repellat, dolores architecto!
                Molestias, iusto sit? Aliquid, libero. Neque quisquam nobis
                quasi ullam tempora laudantium, commodi cupiditate maiores
                voluptates expedita beatae delectus non fugiat aut! Quos ipsa
                saepe, cupiditate at soluta non qui. Quia beatae, fuga, quasi
                non libero velit nihil enim consequuntur magni veniam modi
                doloribus nobis obcaecati exercitationem mollitia necessitatibus
                minus vero sapiente sunt quam. Vel vero maiores nostrum
                recusandae consequatur. Nostrum accusamus incidunt optio
                explicabo ipsum! Quidem odit provident quas eum maxime,
                similique mollitia hic qui incidunt optio eligendi molestias
                veritatis cupiditate reprehenderit, eos vitae error. Eum velit
                ipsa cum. Ad, at mollitia sit veniam non sapiente sunt saepe
                nemo consequuntur consectetur, aperiam eveniet maxime dolorum
                adipisci, necessitatibus velit? Quos assumenda magnam
                blanditiis, dignissimos fugit odit ratione ullam porro
                molestiae. Fugit ducimus facere magnam tempore iste obcaecati
                distinctio labore maxime autem voluptate ut minus quam, aperiam
                nihil eaque doloribus excepturi neque rem. Aut hic veniam, minus
                doloremque perspiciatis error deserunt. Aut quia soluta officiis
                distinctio necessitatibus provident saepe quas, aperiam
                praesentium corporis beatae quasi reiciendis ab laborum odit
                quos sunt nostrum labore voluptates, porro facere nesciunt a
                voluptatibus mollitia. Officiis. Veniam fuga nulla facere cumque
                rerum quia odio debitis sapiente! At in iusto repellat? Porro,
                officiis reprehenderit nisi, ipsum animi sequi minima vitae
                exercitationem ipsam modi nemo dolorem, eum ex! Iusto neque, nam
                doloremque accusantium dicta adipisci quaerat tempora molestias
                est molestiae, ipsum, reiciendis voluptatibus tenetur odit sunt
                nemo nesciunt suscipit quas voluptatem odio praesentium
                explicabo sint aperiam! Debitis, autem! Soluta aut repellat eius
                iusto veniam quas! Assumenda laborum temporibus suscipit,
                eligendi nam ullam eaque, quo sapiente culpa eum dolores cum
                fugit quibusdam. Optio facere commodi laborum officia, qui
                culpa.
              </p>
            </div>
          </div>
        </div>
        <div className={styles.slider__item + " " + styles.slider__item_three}>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          <div className={styles.slider__item_bg}></div>
          {showPopup && (
            <div
              onClick={(e) => {
                popupClose(e);
              }}
              className={styles.popup__slider_close}
            ></div>
          )}
          {showPopup && (
            <div className={styles.popup__slider_buttons}>
              <span
                onClick={(e) => {
                  setSlideNum(1);
                }}
              >
                &#60;
              </span>
              <div
                ref={popupDotLeftRef}
                style={popupButtonStyle}
                className={styles.popup__slider_buttons_dot}
              ></div>
              <div
                ref={popupDotRightRef}
                className={styles.popup__slider_buttons_dot}
              ></div>
              <span
                onClick={(e) => {
                  setSlideNum(2);
                }}
              >
                &#62;
              </span>
            </div>
          )}
          {showPopup && (
            <div className={styles.popup}>
              <div className={styles.popup__slider}>
                <div className={styles.popup__slider_box}>
                  <div className={styles.popup__slider_title}>ПРЕИМУЩЕСТВА</div>
                  <div className={styles.popup__slider_text}>
                    BREND
                    <span className={styles.slider__item_text_bold}>XY</span>
                  </div>
                  <div className={styles.popup__slideBox}>
                    {popupSlide == 1 && (
                      <div
                        ref={popupLeftSlideRef}
                        className={
                          styles.popup__slideBox_item +
                          " " +
                          styles.animateOpacity
                        }
                      >
                        <p className={styles.popup__slideBox_item_title}>01</p>
                        <p className={styles.popup__slideBox_item_text}>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit
                        </p>
                        <p className={styles.popup__slideBox_item_title}>02</p>
                        <p className={styles.popup__slideBox_item_text}>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit
                        </p>
                        <p className={styles.popup__slideBox_item_title}>03</p>
                        <p className={styles.popup__slideBox_item_text}>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit
                        </p>
                      </div>
                    )}
                    {popupSlide == 2 && (
                      <div
                        ref={popupRightSlideRef}
                        className={
                          styles.popup__slideBox_item +
                          " " +
                          styles.animateOpacity
                        }
                      >
                        <p className={styles.popup__slideBox_item_title}>04</p>
                        <p className={styles.popup__slideBox_item_text}>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit
                        </p>
                        <p className={styles.popup__slideBox_item_title}>05</p>
                        <p className={styles.popup__slideBox_item_text}>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit
                        </p>
                        <p className={styles.popup__slideBox_item_title}>06</p>
                        <p className={styles.popup__slideBox_item_text}>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className={styles.slider__item_title}>
            <br />
            КЛЮЧЕВОЕ СООБЩЕНИЕ
          </div>
          <div className={styles.slider__item_text}>
            <p>
              BREND<span className={styles.slider__item_text_bold}>XY</span>
            </p>
          </div>
          <div className={styles.slider__item_box}>
            <div className={styles.slider__item_card}>
              <div className={styles.slider__item_card_img}></div>
              <p>
                Ehicula ipsum a arcu cursus vitae. Eu non diam phasellus
                vestibulum lorem sed risus ultricies
              </p>
            </div>
            <div className={styles.slider__item_card}>
              <p>A arcu cursus vitae</p>
              <div className={styles.slider__item_card_img}></div>
            </div>
          </div>
          {!showPopup && (
            <div
              onClick={(e) => {
                popupOpen(e);
              }}
              className={
                styles.slider__button + " " + styles.slider__item_three
              }
            >
              <div className={styles.slider__button_bg}></div>
              <div className={styles.slider__button_logo}></div>
              <div className={styles.slider__button_text}>Подробнее</div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.slider__footer}>
        <div className={styles.slider__footer_logo}></div>
      </div>
    </div>
  );
};
