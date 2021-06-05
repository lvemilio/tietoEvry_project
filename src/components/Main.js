import React,{useEffect, useLayoutEffect, } from 'react' 

import {useState} from 'react'
import rough from "roughjs/bundled/rough.esm";



function Main() {


  //Constructor setting up the Sides form and its state
    const [Side1,setSide1] = useState('')
    const[Side2,setSide2] = useState('')
    const[Side3,setSide3] = useState('')
    const[isSubmitted,setIsSubmitted] = useState(false)

  // HandleSubmit is triggered every time user clicks the 'Calculate triangle' button, prevents default values and null values with error. 
  const handleSubmit=(e)=>{
    e.preventDefault()
    if(Side1 === '' || Side2 === '' || Side3 === ''){
        alert("Please specify all triangle sides.") 
    }
    else{ 
         setIsSubmitted(true);
         getTriangleType();
    }  
  }
  //HandleChange is called every time the user changed any of the input fields, since it is assumed
  //that every time the user changes an input, they want to recalculate the triangle, so the isSubmitted state is changed.
  //Function also prevents invalid values
  const handleChange=e=>{
    const re = /^[1-9]\d*$/;
          if (e.target.value === '' || re.test(e.target.value)) {
            if(e.target.name === "Side1"){
              setSide1(e.target.value)
            }
            else if(e.target.name === "Side2"){
              setSide2(e.target.value)
            }
            else if(e.target.name === "Side3"){
              setSide3(e.target.value)
            }
          }
          else{
            alert("Please input only whole numbers.")
          }
          setIsSubmitted(false)
  }
  //Object that stores triangle types
  const TRIANGLE_TYPES = Object.freeze({
    ISOSCELES: "ISOSCELES",
    SCALENE: "SCALENE",
    EQUILATERAL: "EQUILATERAL",
    IMPOSSIBLE: "IMPOSSIBLE"
})

  //Function to calculate what type of triangle was created 
  const getTriangleType = () => {
    const uniqueSides = [...new Set([Side1, Side2,Side3])]
    const side1 = parseInt(Side1,10);
    const side2 = parseInt(Side2,10);
    const side3 = parseInt(Side3,10);
    if(Side1 !== '' || Side2 !== '' || Side3 !== ''){
        if(side1+side2<=side3 || side2+side3<=side1 || side1+side3<=side2){
            return TRIANGLE_TYPES.IMPOSSIBLE
        }
        else if (uniqueSides.length === 3) {
            return TRIANGLE_TYPES.SCALENE;
        }
        else if (uniqueSides.length === 2) {
            return TRIANGLE_TYPES.ISOSCELES;
        }    
        else {
        return TRIANGLE_TYPES.EQUILATERAL;
        }
    }
}

  //Output string is dependant on the triangle type, called every time user presses calculate
  const getOutputString = () => {
    const triangleType = getTriangleType();
    const prefix = "This triangle is "
    if(isSubmitted){  
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      const roughCanvas = rough.canvas(canvas);
    if (triangleType === TRIANGLE_TYPES.IMPOSSIBLE){
        return "Is not possible to calculate this kind of triangle. Please check your input values, note that the sum of any two lengths should not be equal to or smaller than the 3rd length."
    }
    else if (triangleType === TRIANGLE_TYPES.EQUILATERAL) {
        roughCanvas.draw(generator.line(150,175,300,125))
        roughCanvas.draw(generator.line(150,175,200,25))
        roughCanvas.draw(generator.line(200,25,300,125))
        return prefix + "equilateral.";
    }
    else if (triangleType === TRIANGLE_TYPES.ISOSCELES) {
        roughCanvas.draw(generator.line(175,175,275,175))
        roughCanvas.draw(generator.line(175,175,225,25))
        roughCanvas.draw(generator.line(225,25,275,175))
        return prefix + "isosceles.";
    }
    else {
        roughCanvas.draw(generator.line(150,150,250,139))
        roughCanvas.draw(generator.line(250,139,213,34))
        roughCanvas.draw(generator.line(213,34,150,150))
        return prefix + "scalene."
    }
  }
}
/////////////////////////////////////////////////////////////Form Logic End
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////Drawing box logic beggining,  
const generator = rough.generator();


const createElement = (id, x1, y1, x2, y2, type) => {
    const canvas = document.getElementById("canvas");
    var rect = canvas.getBoundingClientRect()
    var cornerX = rect.left
    var cornetY = rect.top
  const roughElement = generator.line(x1-cornerX, y1-cornetY, x2-cornerX, y2-cornetY)
  return { id, x1, y1, x2, y2, type, roughElement };
};


const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};


const positionWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element;
  if (type === "rectangle") {
    const topLeft = nearPoint(x, y, x1, y1, "tl");
    const topRight = nearPoint(x, y, x2, y1, "tr");
    const bottomLeft = nearPoint(x, y, x1, y2, "bl");
    const bottomRight = nearPoint(x, y, x2, y2, "br");
    const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    return topLeft || topRight || bottomLeft || bottomRight || inside;
  } else {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    const start = nearPoint(x, y, x1, y1, "start");
    const end = nearPoint(x, y, x2, y2, "end");
    const inside = Math.abs(offset) < 1 ? "inside" : null;
    return start || end || inside;
  }
};

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
  return elements
    .map(element => ({ ...element, position: positionWithinElement(x, y, element) }))
    .find(element => element.position !== null);
};

const adjustElementCoordinates = element => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

const cursorForPosition = position => {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
};

const resizedCoordinates = (clientX, clientY, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null; //should not really get here...
  }
};

const useHistory = initialState => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action, overwrite = false) => {
    const newState = typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex(prevState => prevState + 1);
    }
  };

  const undo = () => index > 0 && setIndex(prevState => prevState - 1);
  const redo = () => index < history.length - 1 && setIndex(prevState => prevState + 1);

  return [history[index], setState, undo, redo];
};

  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("line");
  const [selectedElement, setSelectedElement] = useState(null);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  useEffect(() => {
    const undoRedoFunction = event => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  const updateElement = (id, x1, y1, x2, y2, type) => {
    const updatedElement = createElement(id, x1, y1, x2, y2, type);
    const elementsCopy = [...elements];
    elementsCopy[id] = updatedElement;
    setElements(elementsCopy, true);
  };

  const handleMouseDown = event => {
    const { clientX, clientY } = event;
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        setElements(prevState => prevState);

        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(id, clientX, clientY, clientX, clientY, tool);
      setElements(prevState => [...prevState, element]);
      setSelectedElement(element);

      setAction("drawing");
    }
  };

  const handleMouseMove = event => {
    const { clientX, clientY } = event;

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.target.style.cursor = element ? cursorForPosition(element.position) : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    } else if (action === "moving") {
      const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = clientX - offsetX;
      const newY1 = clientY - offsetY;
      updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type);
    } else if (action === "resizing") {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
      updateElement(id, x1, y1, x2, y2, type);
    }
  };

  const handleMouseUp = () => {
    if (selectedElement) {
      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (action === "drawing" || action === "resizing") {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }
    setAction("none");
    setSelectedElement(null);
  };

//////////////////////////////////////////////Drawing logic end (includes unused, expandable features)
//////////////////////////////////////////////
//////////////////////////////////////////////


    return(
      <form onSubmit={handleSubmit}>
      <div>
        <canvas
        id="canvas"
        width={430}
        height={200}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style = {{borderStyle:'solid'}}
      >
        Canvas
      </canvas>
      </div>            
          <div data-ts="Note">
            <p id = "triangle_type" style = {{textAlign:'center'}}><b>{getOutputString()}</b></p>
          </div>
        <div className = 'form-control'>
          <label htmlFor='Side1'>A side</label>
          <input 
            name='Side1'
            placeholder='A side' 
            value = {Side1}
            onChange={handleChange}
          />
        </div>
        <div className = 'form-control'>
          <label htmlFor='Side2'>B side</label>
          <input
            name='Side2' 
            placeholder='B side'
            value={Side2}
            onChange={handleChange}
          />
        </div>
        <div className = 'form-control'>
          <label htmlFor='Side3'>C side</label>
          <input
            name='Side3' 
            placeholder='C side'
            value={Side3}
            onChange={handleChange}
          />
        </div>
        <div>
            <input type = 'submit'  value = 'Calculate triangle' className='btn btn-block'/>
        </div>
      </form>
    )
  }

  
export default Main