import React, { useState, useEffect, useRef } from "react";

export default function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState("initial");

  // useRef() allows us to have a reference to any variable we want that persists through rerendersof our application
  const frontEl = useRef();
  const backEl = useRef();

  function setMaxHeight() {
    //Element.getBoundingClientRect() gives us the height of our rectangle (our card)
    // Definition: The Element.getBoundingClientRect() method returns a DOMRect object providing information about the size of an element and its position relative to the viewport
    const frontHeight = frontEl.current.getBoundingClientRect().height;
    const backHeight = backEl.current.getBoundingClientRect().height;
    // height is always gonna be the biggest out of both and this also sets a default minimum to 100px
    setHeight(Math.max(frontHeight, backHeight, 100));
  }

  useEffect(
    setMaxHeight,
    //whenever these elements change, we are going to recalculate our height bc if our content is shorter/longer, then the card will need to be shorter/longer
    [flashcard.question, flashcard.answer, flashcard.options]
  );

  // Although setMaxHeight changes the height, there were still instances on mobile view where the card was much bigger than the content held. Therefore, we need another useEffect for when layout changes as well
  useEffect(() => {
    // everytime we resize our browser, we want to call setMaxHeight
    window.addEventListener("resize", setMaxHeight);
    //return is called whenever component destroys itself, so we can remove event listener when we no longer need it
    return () => window.removeEventListener("resize", setMaxHeight);
    // we want this to happen first time it loads
  }, []);

  function handleFlip(e) {
    e.preventDefault();
    setFlip(!flip);
    console.log("flip", flip);
  }

  return (
    <>
      <div
        className={`card ${flip ? "flip" : ""}`}
        style={{ height: height }}
        onClick={handleFlip}
      >
        <div className="front" ref={frontEl}>
          {flashcard.question}

          <div className="flashcard-options">
            {flashcard.options.map((option) => {
              return (
                <div className="flashcard-option" key={option}>
                  {option}
                </div>
              );
            })}
          </div>
        </div>
        <div className="back" ref={backEl}>
          {flashcard.answer}
        </div>
      </div>
    </>
  );
}
