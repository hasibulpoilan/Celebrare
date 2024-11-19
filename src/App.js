import React, { useState, useRef } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo, faRedo, faFont, faTextWidth, faPlus } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [text, setText] = useState("");
  const [textList, setTextList] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentAction, setCurrentAction] = useState(-1);
  const editorRef = useRef(null);

  const handleAddText = () => {
    if (text.trim()) {
      const newText = {
        text,
        x: 50,
        y: 50,
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "normal",
        fontFamily: "Arial",
      };
      const newList = [...textList.slice(0, currentAction + 1), newText];
      setTextList(newList);
      setHistory(newList); 
      setCurrentAction(newList.length - 1);
      setText(""); 
    }
  };

  const handleUndo = () => {
    if (currentAction > 0) {
      setCurrentAction(currentAction - 1);
      setTextList(textList.slice(0, currentAction));
    }
  };

  const handleRedo = () => {
    if (currentAction < history.length - 1) {
      setCurrentAction(currentAction + 1);
      setTextList(history.slice(0, currentAction + 2));
    }
  };

  const handleDrag = (e, index) => {
    const updatedList = [...textList];
    const rect = editorRef.current.getBoundingClientRect();
    updatedList[index] = {
      ...updatedList[index],
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setTextList(updatedList);
    setHistory(updatedList);
  };

  const handleStyleChange = (index, key, value) => {
    const updatedList = [...textList];
    updatedList[index] = { ...updatedList[index], [key]: value };
    setTextList(updatedList);
    setHistory(updatedList);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Celebrare</h1>
        <div className="actions">
        

          <button  onClick={handleUndo} disabled={currentAction <= 0}><FontAwesomeIcon icon={faUndo} />
 Undo
          </button>
          <button onClick={handleRedo} disabled={currentAction >= history.length - 1}> <FontAwesomeIcon icon={faRedo} />
            Redo
          </button>
        </div>
      </header>

      <div className="editor" ref={editorRef}>
        {textList.map((item, index) => (
          <div
            key={index}
            className="text-item"
            style={{
              top: item.y,
              left: item.x,
              fontSize: `${item.fontSize}px`,
              fontStyle: item.fontStyle,
              fontWeight: item.fontWeight,
              fontFamily: item.fontFamily,
            }}
            draggable
            onDragEnd={(e) => handleDrag(e, index)}
          >
            {item.text}
          </div>
        ))}
      </div>

      <footer className="toolbar">
        <input
          type="text"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleAddText}><FontAwesomeIcon icon={faPlus} />Add Text</button>
        {currentAction >= 0 && (
          <div className="style-controls">
            <label>
            <FontAwesomeIcon icon={faTextWidth} />
              <input 
                type="number"
                min="10"
                max="50"
                value={textList[currentAction]?.fontSize || 16}
                onChange={(e) =>
                  handleStyleChange(currentAction, "fontSize", e.target.value)
                }
              />
            </label>
            <label>
              Font Style:
              <select
                value={textList[currentAction]?.fontStyle || "normal"}
                onChange={(e) =>
                  handleStyleChange(currentAction, "fontStyle", e.target.value)
                }
              >
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
              </select>
            </label>
            <label>
              Bold:
              <input
                type="checkbox"
                checked={textList[currentAction]?.fontWeight === "bold"}
                onChange={(e) =>
                  handleStyleChange(currentAction, "fontWeight", e.target.checked ? "bold" : "normal")
                }
              />
            </label>
            <label>
            <FontAwesomeIcon icon={faFont} />
              <select
                value={textList[currentAction]?.fontFamily || "Arial"}
                onChange={(e) =>
                  handleStyleChange(currentAction, "fontFamily", e.target.value)
                }
              >
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </label>
          </div>
        )}
      </footer>
    </div>
  );
};

export default App;
