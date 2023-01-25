import React, { useState, useEffect, useRef } from "react";
import FlashcardList from "./FlashcardList";
import "./app.css";
import axios from "axios";

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);
  const categoryEl = useRef();
  const amountEl = useRef();

  // this useEffect() will generate different categories
  useEffect(() => {
    axios.get("https://opentdb.com/api_category.php").then((res) => {
      setCategories(res.data.trivia_categories);
    });
  }, []);

  // helper function to convert special character codes to actual characters
  function decodeString(str) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = str;
    return textArea.value;
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .get("https://opentdb.com/api.php", {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value,
        },
      })
      .then((res) => {
        setFlashcards(
          res.data.results.map((questionItem, index) => {
            const answer = decodeString(questionItem.correct_answer);
            const options = [
              ...questionItem.incorrect_answers.map((answer) =>
                decodeString(answer)
              ),
              answer,
            ];
            return {
              // this will be a unique ID because in the future, we will know we won't have clashing identifiers
              id: `${index}-${Date.now()}`,
              question: decodeString(questionItem.question),
              answer: answer,
              // sort options randomly. .random() will give answer between 0 and 1. When you subtract 0.5, it will mean getting half the time you are getting a negative number or getting a positive number. Therefore, the order of the sort will always be random ascending or descending
              options: options.sort(() => Math.random() - 0.5),
            };
          })
        );
        console.log("res.data", res.data);
      });
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number Of Questions</label>
          <input
            type="number"
            id="amount"
            min="1"
            step="1"
            defaultValue={10}
            ref={amountEl}
          />
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}

export default App;
