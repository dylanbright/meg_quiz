let quizData;
let selectedChapters = [];
let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let showingCorrectAnswer = false;
let questionResults = [];
let questionFeedback = document.getElementById("question-feedback");

const setupContainer = document.getElementById("setup");
const chaptersContainer = document.getElementById("chapters");
const questionCountInput = document.getElementById("question-count");
const startButton = document.getElementById("start-btn");

const quizContainer = document.getElementById("quiz-container");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const submitButton = document.getElementById("submit-btn");
const resultsContainer = document.getElementById("results");

async function loadQuizData() {
  const response = await fetch("MEQ_Questions_35turbo_v2.json");
  quizData = await response.json();
  displayChapters();
}

// function displayChapters() {
//   let uniqueChapters = [...new Set(quizData.map(q => q.chapter))].sort();
//   uniqueChapters.forEach(chapter => {
//     const chapterElement = document.createElement("label");
//     chapterElement.innerHTML = `
//       <input type="checkbox" name="chapter" value="${chapter}" />
//       ${chapter} <br/>
//     `;
//     chaptersContainer.appendChild(chapterElement);
//   });
// }

function displayChapters() {
  let uniqueChapters = [...new Set(quizData.map(q => q.chapter))];
  uniqueChapters.sort((a, b) => {
    const numA = parseFloat(a.split('.')[0]);
    const numB = parseFloat(b.split('.')[0]);
    return numA - numB;
  });

  uniqueChapters.forEach(chapter => {
    const chapterElement = document.createElement("label");
    chapterElement.innerHTML = `
      <input type="checkbox" name="chapter" value="${chapter}" />
      ${chapter} <br/>
    `;
    chaptersContainer.appendChild(chapterElement);
  });
}


function startQuiz() {
  selectedChapters = Array.from(document.querySelectorAll('input[name="chapter"]:checked')).map(chapter => chapter.value);
//   selectedChapters.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const questionCount = parseInt(questionCountInput.value);

  if (selectedChapters.length === 0 || !questionCount) return;

  selectedQuestions = getRandomQuestions(questionCount);

  if (selectedQuestions.length === 0) {
    alert("No questions available for the selected chapters.");
    return;
  }

  setupContainer.style.display = "none";
  quizContainer.style.display = "block";
  displayQuestion();
}

function getRandomQuestions(count) {
  const questionsFromSelectedChapters = quizData.filter(q => selectedChapters.includes(q.chapter));
  const shuffledQuestions = questionsFromSelectedChapters.sort(() => Math.random() - 0.5);
  return shuffledQuestions.slice(0, count);
}


function displayQuestion() {
    questionElement.innerHTML = `<div style="text-align: left; font-size: 20px;">${selectedQuestions[currentQuestionIndex].question}</div><br>`;
    optionsContainer.innerHTML = "";
    selectedQuestions[currentQuestionIndex].options.forEach((option, index) => {
      const optionElement = document.createElement("label");
      optionElement.innerHTML = `
        <input type="radio" name="option" value="${option}" />
        ${option}<br>
      `;
      optionsContainer.appendChild(optionElement);
    });
    // clear the feedback message
    questionFeedback.textContent = "";
  }
  

function nextQuestion() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
  
    if (!selectedOption) {
      // if no answer is selected, don't do anything
      return;
    }
  
    const correctAnswer = selectedQuestions[currentQuestionIndex].correct_answer;
    const isCorrect = selectedOption.value === correctAnswer;
  
    if (isCorrect) {
      questionFeedback.textContent = "Correct!";
      score++;
    } else {
      questionFeedback.textContent = `Incorrect. Correct answer: ${correctAnswer}`;
    }
  
    questionResults.push({
      question: selectedQuestions[currentQuestionIndex].question,
      answer: correctAnswer,
      correct: isCorrect
    });
  
    nextButton.textContent = "Next";
    nextButton.onclick = moveToNextQuestion;
}

function submitQuiz() {
  nextQuestion();
}

function moveToNextQuestion() {
    //questionFeedback.textContent = "";
    nextButton.textContent = "Submit";
    nextButton.onclick = nextQuestion;
  
    currentQuestionIndex++;
  
    if (currentQuestionIndex < selectedQuestions.length) {
      displayQuestion();
    } else {
      quizContainer.style.display = "none";
      showResults();
    }
  }

function showResults() {
const correctQuestionsContainer = document.getElementById("correct-questions");
const incorrectQuestionsContainer = document.getElementById("incorrect-questions");

let correctCount = 0;

questionResults.forEach(result => {
    const listItem = document.createElement("li");
    listItem.textContent = `${result.question}`;

    if (result.correct) {
    correctQuestionsContainer.querySelector("ul").appendChild(listItem);
    correctCount++;
    } else {
    const feedbackItem = document.createElement("li");
    feedbackItem.textContent = `Incorrect. Correct answer: ${result.answer}`;
    incorrectQuestionsContainer.querySelector("ul").appendChild(listItem);
    incorrectQuestionsContainer.querySelector("ul").appendChild(feedbackItem);
    }
});

resultsContainer.innerHTML = `Your score:<br/> ${correctCount} out of ${selectedQuestions.length}!`;
resultsContainer.style.display = "block";
correctQuestionsContainer.style.display = "block";
incorrectQuestionsContainer.style.display = "block";

// Display the Try Again div
document.getElementById("try-again").style.display = "block";
document.getElementById("try-again-btn").addEventListener("click", () => {
    location.reload();
    });
}

  

// Load quiz data and display chapters
loadQuizData();
