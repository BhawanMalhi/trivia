// Helper function to create elements with class names
function createElementWithClass(elementName, className) {
    const elem = document.createElement(elementName);
    elem.classList.add(className);
    return elem;
}

// Think of a way to randomize the input of 
function shuffleChoices(incorrect, correct) {
    const random = Math.floor(Math.random() * (incorrect.length + 1));
    incorrect.splice(random, 0, correct);
}

// initiate score
let score = 0;
let questionCounter = 1;

const quizArticle = document.querySelector('.quiz');

async function getQuestions() {
    try {
        const quizAPI = await axios.get('https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple');
        const quizData = quizAPI.data.results[0];

        console.log(quizData)

        // Append elements onto page
        quizArticle.innerHTML = ''; //Clears the previous question and updates a new question

        const quizCounters = createElementWithClass('div', 'quiz__counters');
        quizArticle.appendChild(quizCounters);

        const quizQuestionCounter = createElementWithClass('h1', 'quiz__prompt');
        quizQuestionCounter.innerHTML = `QUESTION: ${questionCounter}/10 |`;
        quizCounters.appendChild(quizQuestionCounter);

        const quizScoreCounter = createElementWithClass('h1', 'quiz__counter');
        quizScoreCounter.innerHTML = `| SCORE: ${score}/10`;
        quizCounters.appendChild(quizScoreCounter);

        const quizContainer = createElementWithClass('div', 'quiz__container')
        quizArticle.appendChild(quizContainer);

        const quizCategory = createElementWithClass('h2', 'quiz__category');
        quizCategory.innerHTML = `Category - ${quizData.category}`;
        quizContainer.appendChild(quizCategory);

        const quizQuestion = createElementWithClass('p', 'quiz__question');
        quizQuestion.innerHTML = quizData.question;
        quizContainer.appendChild(quizQuestion);

        shuffleChoices(quizData["incorrect_answers"], quizData["correct_answer"]);

        const quizForm = createElementWithClass('form', 'quiz__form');
        quizForm.id = 'quizForm'
        quizContainer.appendChild(quizForm);

        // For loop to print out options and ensure they have proper values
        const answerBank = quizData["incorrect_answers"];
        for (let i = 0; i < answerBank.length; i++) {
            const answerGroup = createElementWithClass('div', 'quiz__form-option');
            quizForm.appendChild(answerGroup);

            const answerSelect = createElementWithClass('input', 'quiz__form-select');
            answerSelect.type = 'radio'
            answerSelect.value = answerBank[i];
            answerSelect.name = 'option'
            answerGroup.appendChild(answerSelect);

            const answerItem = createElementWithClass('label', 'quiz__form-select--label');
            answerItem.innerHTML = answerBank[i];
            answerItem.for = `option${answerBank[i]}`;
            answerGroup.appendChild(answerItem);

            // console.log(answerSelect.value)
        }

        const formSubmitButton = createElementWithClass('button', 'quiz__form-submit');
        formSubmitButton.type = 'submit';
        formSubmitButton.setAttribute('form', 'quizForm');
        formSubmitButton.innerText = 'SUBMIT';
        quizContainer.appendChild(formSubmitButton);
        
        // Add Event Listeners for submit and to take what action
        const quizFormSelect = document.querySelector('.quiz__form');
        quizFormSelect.addEventListener('submit', (e) => {
            e.preventDefault();

            const selectedChoice = document.querySelector('input[name=option]:checked');
            const allChoices = document.querySelectorAll('.quiz__form-select');
            if (selectedChoice.value === quizData["correct_answer"]) {
                score++ //Adds a point to the score
                console.log(`You got it right!`, score)
            } else {
                console.log(`You got it wrong`, score)
            }

            //Highlights right answer green and wrong answers red no matter if the user got it right or wrong
            allChoices.forEach((choice) => {
                if (choice.value === quizData["correct_answer"]) {
                    choice.parentElement.classList.add('quiz__form-option--correct')
                } else {
                    choice.parentElement.classList.add('quiz__form-option--wrong')
                }
            })

            //Question counter for game limit
            if (questionCounter == 10) {
                quizArticle.innerHTML = ''; 

                const resultsPopUp = createElementWithClass('div', 'results');
                document.body.appendChild(resultsPopUp);

                const resultsTitle = createElementWithClass('h1', 'results__title');
                resultsTitle.innerText = `You've reached the end!`;
                resultsPopUp.appendChild(resultsTitle);

                const resultsScore = createElementWithClass('h2', 'results__score');
                resultsScore.innerHTML = `You scored: ${score}/10`;
                resultsPopUp.appendChild(resultsScore)

                const playAgain = createElementWithClass('button', 'results__button');
                playAgain.innerText = `PLAY AGAIN`;
                playAgain.type = 'button';
                resultsPopUp.appendChild(playAgain);

                
                //Play again event listener
                const playAgainAction = document.querySelector('.results__button');
                setTimeout(() => {
                    playAgainAction.addEventListener('click', (e) => {
                        window.parent.location = window.parent.location.href;
                })}, 4000)

            } else {
                setTimeout(() => {
                getQuestions()}, 4000)}
                questionCounter++;
                console.log(questionCounter)
        })


        // console.log(quizData)
        // console.log(answerBank)
    } catch(e) {
        console.log(`ERROR CAUGHT: `, e)
    }
}

getQuestions();
