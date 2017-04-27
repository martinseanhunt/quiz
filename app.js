// STATE GLOBAL

var state = {
	questions: [
		{
			question: "Who first taught the practice ofAshtanga Yoga as it is known today in the west?",
			answers: ["Sri. K. Pattabhi Jois", "B. K. S. Iyengar", "Captian Caveman", "R. Sharath Jois"],
			correctAnswer: "Sri. K. Pattabhi Jois"
		},
		{
			question: "What ancient text initially outlined Ashtanga Yoga?",
			answers: ["Light on Yoga", "Hatha Yoga Pradipika", "Pantajali's Yoga Sutras", "Yoga Mala"],
			correctAnswer: "Pantajali's Yoga Sutras"
		},
		{
			question: 'What does "Ashtanga Yoga" mean?',
			answers: ["Primary Series", "A sweet beach body", "8 limbed Yoga", "Physical Yoga"],
			correctAnswer: "8 limbed Yoga"
		},
		{
			question: "What is Uddiyana Bhanda",
			answers: ["A sports drink", "A resistance band used in practice", "A Yoga rock band", "An energetic lock applied below the navel"],
			correctAnswer: "An energetic lock applied below the navel"
		},
		{
			question: "What does Vinyasa mean?",
			answers: ["Movement coordinated with breath", "Sun Salutations", "A strong Yoga workout", "Concentration point"],
			correctAnswer: "Movement coordinated with breath"
		},
	],
	questionCount: 0,
	correctCount: 0,
	wrongCount: 0
}

// TEMPLATES (GLOBAL)

var welcomeTemplate = (
  '<div class="welcome-screen">' +
		'<h2>Welcome to the quiz!</h2>' +
		'<p>It\'s all about Ashtanga Yoga</p>' +
		'<button class="js-start">Start the Quiz!</button>' +
	'</div>'
);

var questionTemplate = (
	'<div class="question-screen">' +
		'<div class="question"/>' +
			'<h2></h2>' +
			'<form class="answers">' +
		      '<button type="submit">Submit</button>' +
		    '</form>' +
		'</div>' +
	'</div>'
);

var answerTemplate = (
	'<div class="answer">' +
	      '<input type="radio" name="answer"> <label></label>' +
	  '</div>' 
);

var answerScreenTemplate = (
	'<div class="answer-screen">' +
		'<h2></h2>' +
		'<p></p>' +
		'<button class="next-question">Next Question</button>' +
	'</div>'
);

var finishScreenTemplate = (
	'<div class="final-screen">' +
		'<h2>You finished the quiz!</h2>' +
		'<p></p>' +
		'<button class="playagain">Play Again!</button>' +
	'</div>'
);

// STATE MANAGEMENT

function getQuestion(state, questionID){
	return state.questions[questionID];
}

function getQuestionCount(state){
	return state.questionCount;
}

function getTotalQuestions(state){
	return state.questions.length;
}

function addQuestionCount(state){
	state.questionCount++;
	return state.questionCount;
}

function updateScore(state, modifier){
	if(modifier === 1){
		state.correctCount ++;
	}else if(modifier === 0 ){
		state.wrongCount ++;
	}
}

function getCorrectScore(state){
	return state.correctCount;
}

function getWrongScore(state){
	return state.wrongCount;
}

function resetState(state){
	state.questionCount = 0;
	state.correctCount = 0;
	state.wrongCount = 0;
}


// DOM Manipulation

function renderWelcomeScreen(state, template, element) {		
	element.html(template);
}

function renderQuestion(state, qTemplate, aTemplate, element, question){
	// Get the question we're going to render
	var questionObject = getQuestion(state, question);

	// If there are no more questoins, return false
	if(!questionObject){
		return false;
	}

	// Load the question template
	var questionTemplate = $(qTemplate);

	// Set question
	questionTemplate.find('h2').text(questionObject.question);
	
	// Render answers in to question template
	var answersHTML = questionObject.answers.map(function(answer, index){
		// load answer template
		var answerTemplate = $(aTemplate);
		var answerInput = answerTemplate.find('input');
		var answerLabel = answerTemplate.find('label');

		answerInput.attr('value', answer);
		answerLabel.attr('for', answer);
		answerLabel.text(answer);

		return answerTemplate;

	});
	questionTemplate.find('.answers').prepend(answersHTML);

	// Render all to DOM
	element.html(questionTemplate);

	//Render Progress
	renderProgress(state, $('.progress span'));

	return true;
}

function processUserAnswer(state, mainElement, userAnswer, questionCount, template){
	// Get the question object
	var question = getQuestion(state, questionCount);

	// get template and add question
	var answerTemplate = $(template);
	answerTemplate.find('h2').text(question.question);

	// let the user know if they were right and update score
	var userCorrect = null;

	if( userAnswer === question.correctAnswer ){
		answerTemplate.find('p').text('You got it!');
		userCorrect = 1;
	}else{
		answerTemplate.find('p').text('Oops, the right answer was: ' + question.correctAnswer);
		userCorrect = 0;
	}

	if( (questionCount + 1) === getTotalQuestions(state) ){
		answerTemplate.find('button').text('See your score');
	}
	
	mainElement.html(answerTemplate);

	updateScore(state, userCorrect);
	renderScore(state, $('.score span'));
}

function renderFinishScreen(state, mainElement, finishScreenTemplate){
	var template = $(finishScreenTemplate);
	var correctScore = getCorrectScore(state);
	var wrongScore = getWrongScore(state);

	template.find('p').text('Well done, you got ' + correctScore + ' questions right and ' + wrongScore + ' wrong...');

	mainElement.html(template);
}

function renderScore(state, element){
	var correctScore = getCorrectScore(state);
	var wrongScore = getWrongScore(state);
	element.text( correctScore + ' correct, ' + wrongScore + ' incorrect');
}

function renderProgress(state, element){
	var totalQuestions = getTotalQuestions(state);
	var questionCount = getQuestionCount(state);
	element.text( 'Progress: ' + (questionCount + 1) +' out of '+ totalQuestions );
}

function hideFooter(state){
	$('footer').addClass('hidden');
}

function showFooter(state){
	$('footer').removeClass('hidden');
}

// EVENT LISTENERS

$(function(){

	// Set the element that we'll render everything in to
	var mainElement = $('main');

	// To start, render the welcome screen
	renderWelcomeScreen(state, welcomeTemplate, mainElement);

	// When the start button is pushed, render the first question
	mainElement.on('click', '.js-start', function(){
		// get the first question
		renderQuestion(state, questionTemplate, answerTemplate, mainElement, 0);
		//ushow footer
		showFooter(state);
	});


	// When the submit button is pushed, process answer and render answer screen
	mainElement.on('submit', '.answers', function(e){
		
		e.preventDefault();

		// Check if it's the right answer and do stuff
		var userAnswer = mainElement.find('input:checked').val();
		var count = getQuestionCount(state);
		
		processUserAnswer(state, mainElement, userAnswer, count, answerScreenTemplate);

	});

	// When next question button is pushed, load the next question
	mainElement.on('click', '.next-question', function(){
		//update what question we're on in the state and save the value
		count = addQuestionCount(state);
		// get the next question or if renderQuestion returns false render the finishing screen
		if (!renderQuestion(state, questionTemplate, answerTemplate, mainElement, count)){
			// render finishing screen
			renderFinishScreen(state, mainElement, finishScreenTemplate);
		}
	});

	mainElement.on('click', '.playagain', function(){
		resetState(state);
		hideFooter(state);
		renderWelcomeScreen(state, welcomeTemplate, mainElement);
	});

});

