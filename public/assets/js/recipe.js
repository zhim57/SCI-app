// let correctAnswer,
//   correctNumber = localStorage.getItem("quiz_game_correct")
//     ? localStorage.getItem("quiz_game_correct")
//     : 0,
//   incorrectNumber = localStorage.getItem("quiz_game_incorrect")
//     ? localStorage.getItem("quiz_game_incorrect")
//     : 0,
//   nextQuestion = localStorage.getItem("quiz_nextQuestion")
//     ? localStorage.getItem("quiz_nextQuestion")
//     : 0,
//   wrongAnswers = JSON.parse(localStorage.getItem("quiz_wrong_questions"))
//     ? JSON.parse(localStorage.getItem("quiz_wrong_questions"))
//     : [];
let dudu;
let answer = {};

loadQuestionJA = () => {
  let id = nextQuestion || 1;
  let condition = "id =" + id;
  let table = "questions";

  let requestPortable = {
    table: table,
    culprit: "line41_quiz.js",
    condition: condition,
  };
  // Send the GET request.
  $.ajax("/api/questions01/", {

    type: "GET",
    data: requestPortable,
  }).then((response) => {
    dudu = response;

    nextQuestion++;
    displayQuestion(dudu);
  });
};

document.addEventListener("DOMContentLoaded", function () {
  loadQuestionJA();
  eventListeners();
});

eventListeners = () => {

  document
    .querySelector("#clear-storage")
    .addEventListener("click", clearResults);
  document
    .querySelector("#show-results")
    .addEventListener("click", showResults);
};

// document.querySelector("#start").addEventListener("click", loadQuestionJA);

// loads a new question from an API
// loadQuestion = () => {
//      const url = 'https://opentdb.com/api.php?amount=1';
//      fetch(url)
//           .then(data => data.json())
//           .then(result  =>  displayQuestion(result.results));
// }



// displays the question HTML from API
showResults = () => {
  const correctDiv = document.createElement("div");
  correctDiv.classList.add("alert-results", "col-md-12", "wrongs");
  correctDiv.textContent = `
    Answered ${nextQuestion - 1} questions, ${
    514 - (nextQuestion - 1)
  } remaining .   Score: ${((correctNumber / (nextQuestion - 2)) * 100).toFixed(
    2
  )}%.   
     List of the wrong items so far: `;
  // select the questions div to insert the alert
  let appDiv = document.querySelector("#app");
  appDiv.appendChild(correctDiv);

  for (let k = 0; k < wrongAnswers.length; k++) {
    let answer1 =
      wrongAnswers[k].ifia_number + " : " + wrongAnswers[k].answer_correct;
    // generate the HTML for possible answers
    let wrongAnswerDiv = document.createElement("div");
    wrongAnswerDiv.classList.add("wrongs", "row");

    let answerHTML = document.createElement("li");
    answerHTML.classList.add("col-12");
    answerHTML.textContent = answer1;
    wrongAnswerDiv.appendChild(answerHTML);
    correctDiv.appendChild(wrongAnswerDiv);
  }
  // render in the HTML
  setTimeout(() => {
    document.querySelector(".alert-results").remove();
  }, 5500);
};
displayQuestion = (questions) => {
  let possibleAnswers = [];
  // create the HTML Question
  const questionHTML = document.createElement("div");
  questionHTML.classList.add("col-12", "questionHTML");

  correctAnswer = questions[0].answer_correct;
  possibleAnswers.push(questions[0].answer_a);
  possibleAnswers.push(questions[0].answer_b);
  possibleAnswers.push(questions[0].answer_c);
  possibleAnswers.push(questions[0].answer_d);

  answer = questions[0];
  //  console.log(answer);
  if (nextQuestion != 515){


    questions.forEach((question) => {
      // read the correct answer
      // correctAnswer = question.correct_answer;
      // inject the correct answer in the possible answers
      // let possibleAnswers = question.incorrect_answers;
      // possibleAnswers.splice( Math.floor( Math.random() * 3 ), 0, correctAnswer );
  
      // add the HTML for the Current Question
      questionHTML.innerHTML = `
                 <div class="row justify-content-between heading">
                      <p class="category">Category:  ${questions[0].section}</p>
                      <div class="totals">
                           <span class="badge badge-success">${correctNumber}</span>
                           <span class="badge badge-danger">${incorrectNumber}</span>
                      </div>
                 </div>
                 <h2 id="question" class="text-center">${question.ifia_number} : ${question.question}
  
            `;
  
    // generate the HTML for possible answers
    const answerDiv = document.createElement("div");
    answerDiv.classList.add(
      "questions",
      "row",
      "justify-content-around",
      "mt-4"
    );
    possibleAnswers.forEach((answer) => {
      const answerHTML = document.createElement("li");
      answerHTML.classList.add("col-12", "col-md-5");
      answerHTML.textContent = answer;
      // attach an event click the answer is clicked
      answerHTML.onclick = selectAnswer;
      answerDiv.appendChild(answerHTML);
    });
    questionHTML.appendChild(answerDiv);

    // render in the HTML
    document.querySelector("#app").appendChild(questionHTML);
  });

}
else if (nextQuestion === 515){
console.log("End score");
  questions.forEach((question) => {
    // read the correct answer
    // correctAnswer = question.correct_answer;
    // inject the correct answer in the possible answers
    // let possibleAnswers = question.incorrect_answers;
    // possibleAnswers.splice( Math.floor( Math.random() * 3 ), 0, correctAnswer );

    // add the HTML for the Current Question
    questionHTML.innerHTML = `
               <div class="row justify-content-between heading">
                    <p class="category">Category:  ${questions[0].section}</p>
                    <div class="totals">
                         <span class="badge badge-success">${correctNumber}</span>
                         <span class="badge badge-danger">${incorrectNumber}</span>
                    </div>
               </div>
               <h2 id="question" class="text-center">${question.ifia_number},  ${question.question}  ${((correctNumber / (nextQuestion - 2)) * 100).toFixed(2)}%.   

          `;

  // generate the HTML for possible answers
  const answerDiv = document.createElement("div");
  answerDiv.classList.add(
    "questions",
    "row",
    "justify-content-around",
    "mt-4"
  );
  possibleAnswers.forEach((answer) => {
    const answerHTML = document.createElement("li");
    answerHTML.classList.add("col-12", "col-md-5");
    answerHTML.textContent = answer;
    // attach an event click the answer is clicked
    answerHTML.onclick = selectAnswer;
    answerDiv.appendChild(answerHTML);
  });
  questionHTML.appendChild(answerDiv);

  // render in the HTML
  document.querySelector("#app").appendChild(questionHTML);
});

}

};

// when the answer is selected
selectAnswer = (e) => {
  // removes the previous active class for the answer
  if (document.querySelector(".active")) {
    const activeAnswer = document.querySelector(".active");
    activeAnswer.classList.remove("active");
  }
  // adds the current answer
  e.target.classList.add("active");
  validateAnswer();
};

// Checks if the answer is correct and 1 answer is selected
validateAnswer = () => {
  if (document.querySelector(".questions .active")) {
    // everything is fine, check if the answer is correct or not
    checkAnswer();
  } else {
    // error, the user didn't select anything
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("alert", "alert-danger", "col-md-6");
    errorDiv.textContent = "Please select 1 answer";
    // select the questions div to insert the alert
    const questionsDiv = document.querySelector(".questions");
    questionsDiv.appendChild(errorDiv);

    // remove the error
    setTimeout(() => {
      document.querySelector(".alert-danger").remove();
    }, 3000);
  }
};

// check if the answer is correct or not
checkAnswer = () => {
  const userAnswer = document.querySelector(".questions .active");

  if (userAnswer.textContent === correctAnswer) {
    correctNumber++;
    // save into localstorage
    saveIntoStorage();

    // clear previous HTML
    const app = document.querySelector("#app");
    while (app.firstChild) {
      app.removeChild(app.firstChild);
    }

    // load a new question
    loadQuestionJA();
  } else {
    incorrectNumber++;

    wrongAnswers.push(answer);

    const correctDiv = document.createElement("div");
    correctDiv.classList.add("alert", "alert-danger", "col-md-6");
    correctDiv.textContent = correctAnswer;
    // select the questions div to insert the alert
    const questionDiv = document.querySelector("#question");
    questionDiv.appendChild(correctDiv);

    setTimeout(() => {
      document.querySelector(".alert-danger").remove();

      // save into localstorage
      saveIntoStorage();

      // clear previous HTML
      const app = document.querySelector("#app");
      while (app.firstChild) {
        app.removeChild(app.firstChild);
      }

      // load a new question
      loadQuestionJA();
    }, 3000);
  }
};


saveIntoStorage = () => {
//   localStorage.setItem("quiz_game_correct", correctNumber);
//   localStorage.setItem("quiz_game_incorrect", incorrectNumber);
//   localStorage.setItem("quiz_nextQuestion", nextQuestion);
//   localStorage.setItem("quiz_wrong_questions", JSON.stringify(wrongAnswers));
};

// Clears the results from storage

clearResults = () => {
  // localStorage.setItem("quiz_game_correct", 0);
  // localStorage.setItem("quiz_game_incorrect", 0);
  // localStorage.setItem("quiz_nextQuestion", 1);
  // wrongAnswers = [];
  // localStorage.setItem("quiz_wrong_questions", JSON.stringify(wrongAnswers));

  setTimeout(() => {
    window.location.reload();
  }, 500);
};
