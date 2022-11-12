import React, { useEffect, useState } from "react";

const buttonValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function App() {
  const [focus, setFocus] = useState(false);
  const [selectedField, setSelectedField] = useState(0);
  const [mousePos, setMousePos] = useState({});

  const modalRef = React.createRef();
  const closeBtnRef = React.createRef();

  const ref1 = React.createRef();
  const ref2 = React.createRef();

  useEffect(() => {
    const handleMouseClick = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("click", handleMouseClick);

    return () => {
      window.removeEventListener("click", handleMouseClick);
    };
  }, []);

  useEffect(() => {
    const { x: mouseX, y: mouseY } = mousePos;

    const selectedInput = getSelectedInput(mouseX, mouseY);

    if (selectedInput.length) {
      const { id } = selectedInput[0].current;
      handleFocus(id);
    } else {
      handleFieldLeave(mouseX, mouseY);
    }
  }, [mousePos]);

  const getSelectedInput = (mouseX, mouseY) => {
    const {
      top: inputOneTop,
      bottom: inputOneBottom,
      left: inputOneLeft,
      right: inputOneRight,
    } = ref1.current.getBoundingClientRect();
    const {
      top: inputTwoTop,
      bottom: inputTwoBottom,
      left: inputTwoLeft,
      right: inputTwoRight,
    } = ref2.current.getBoundingClientRect();

    const isInputOneClicked =
      mouseY >= inputOneTop &&
      mouseY <= inputOneBottom &&
      mouseX >= inputOneLeft &&
      mouseX <= inputOneRight;
    const isInputTwoClicked =
      mouseY >= inputTwoTop &&
      mouseY <= inputTwoBottom &&
      mouseX >= inputTwoLeft &&
      mouseX <= inputTwoRight;

    const inputsMap = [
      { ...ref1, selected: isInputOneClicked },
      { ...ref2, selected: isInputTwoClicked },
    ];

    return inputsMap.filter((input) => {
      return input.selected;
    });
  };

  const handleFocus = (id) => {
    setFocus(true);
    setSelectedField(parseInt(id));
  };

  const handleFieldLeave = (mouseX, mouseY) => {
    if (!focus) return;

    const field = document.getElementById(selectedField);
    const { y: modalY } = modalRef.current.getBoundingClientRect();
    const {
      top: topClose,
      bottom: bottomClose,
      left: leftClose,
      right: rightClose,
    } = closeBtnRef.current.getBoundingClientRect();
    const isCloseBtnClicked =
      mouseY >= topClose &&
      mouseY <= bottomClose &&
      mouseX >= leftClose &&
      mouseX <= rightClose;

    if (mouseY <= modalY || isCloseBtnClicked) {
      setFocus(false);
    } else {
      field.focus();
    }
  };

  const handleDigitClick = (e) => {
    const value = e.target.dataset.value;
    const field = document.getElementById(selectedField);
    field.value = value;
  };

  return (
    <>
      <div
        className={`input-background ${focus && "input-background-keyboard"}`}
      >
        <div className="input-container">
          <input id={1} className="input-field" ref={ref1} readOnly />
          <input id={2} className="input-field" ref={ref2} readOnly />
        </div>
      </div>
      <div className={`keyboard-modal ${!focus && "hidden"}`} ref={modalRef}>
        <div className="keyboard-container">
          {buttonValues.map((value) => {
            return (
              <button
                key={value}
                className="digits"
                onClick={(e) => handleDigitClick(e)}
                data-value={value}
              >
                {value}
              </button>
            );
          })}
        </div>
        <span className="close" ref={closeBtnRef}>
          &times;
        </span>
      </div>
    </>
  );
}

export default App;
