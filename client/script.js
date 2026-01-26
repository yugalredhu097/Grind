// script.js - Complete Test Submission Flow for Grind

// ===========================
// STATE MANAGEMENT
// ===========================
let questions = []; // All questions from backend
let currentQuestionIndex = 0;
let userAnswers = {}; // Store user's answers { questionId: selectedOption }
let markedForReview = new Set(); // Track marked questions
let testStartTime = Date.now();
let timerInterval = null;

// ===========================
// INITIALIZE TEST
// ===========================
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestionsFromBackend();
    if (questions.length > 0) {
        displayQuestion(currentQuestionIndex);
        startTimer();
        updatePalette();
    } else {
        alert('No questions available. Please contact support.');
    }
});

// ===========================
// FETCH QUESTIONS FROM BACKEND
// ===========================
async function loadQuestionsFromBackend() {
    try {
        // Update this URL to your actual backend URL
        const response = await fetch('http://localhost:5001/questions');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        questions = data.slice(0, 30); // Take first 30 questions for the test
        
        console.log(`✅ Loaded ${questions.length} questions from backend`);
    } catch (error) {
        console.error('❌ Error loading questions:', error);
        
        // For development/demo: Load mock questions if backend fails
        questions = generateMockQuestions(30);
        console.log('⚠️ Using mock questions for demo');
    }
}

// ===========================
// MOCK QUESTIONS (For Demo/Development)
// ===========================
function generateMockQuestions(count) {
    const mockQuestions = [];
    const subjects = ['Physics', 'Chemistry', 'Mathematics'];
    const options = [
        ['r²', '1/r²', '1/r', 'Constant'],
        ['Increases', 'Decreases', 'Remains same', 'Doubles'],
        ['Linear', 'Quadratic', 'Exponential', 'Logarithmic']
    ];
    
    for (let i = 0; i < count; i++) {
        mockQuestions.push({
            _id: `mock_${i + 1}`,
            question: `Sample question ${i + 1}: This is a placeholder question text for testing purposes.`,
            options: options[i % 3],
            correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
            subject: subjects[i % 3],
            year: 2020 + (i % 4)
        });
    }
    
    return mockQuestions;
}

// ===========================
// DISPLAY QUESTION
// ===========================
function displayQuestion(index) {
    if (!questions[index]) {
        console.error('Question not found at index:', index);
        return;
    }
    
    const question = questions[index];
    currentQuestionIndex = index;
    
    // Update question number
    const questionTitle = document.querySelector('h2.text-2xl');
    if (questionTitle) {
        questionTitle.textContent = `Question ${index + 1}`;
    }
    
    // Update subject badge
    const subjectBadge = document.querySelector('.bg-slate-200.dark\\:bg-\\[\\#283039\\].px-2');
    if (subjectBadge) {
        subjectBadge.textContent = question.subject || 'Physics';
    }
    
    // Update question text
    const questionText = document.querySelector('.prose.dark\\:prose-invert p');
    if (questionText) {
        questionText.innerHTML = question.question || question.text || 'Question loading...';
    }
    
    // Update options
    const optionLabels = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2 label');
    const optionLetters = ['A', 'B', 'C', 'D'];
    
    optionLabels.forEach((label, i) => {
        const radio = label.querySelector('input[type="radio"]');
        const optionSpan = label.querySelector('span:last-child');
        
        if (question.options && question.options[i]) {
            // Set option text
            optionSpan.innerHTML = `<span class="font-bold text-slate-400 dark:text-slate-500 mr-2">${optionLetters[i]}.</span>${question.options[i]}`;
            
            // Set radio value
            radio.value = optionLetters[i];
            radio.name = `question_${question._id}`;
            
            // Restore previously selected answer
            const savedAnswer = userAnswers[question._id];
            if (savedAnswer === optionLetters[i]) {
                radio.checked = true;
                label.className = 'group relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all border-primary bg-primary/5 dark:bg-primary/10';
            } else {
                radio.checked = false;
                label.className = 'group relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all border-slate-200 dark:border-[#283039] bg-white dark:bg-[#1c252e] hover:border-primary/50 dark:hover:border-primary/50';
            }
        }
    });
    
    // Setup option click handlers
    setupOptionListeners(question._id);
    
    // Update progress and palette
    updateProgress();
    updatePalette();
}

// ===========================
// OPTION SELECTION HANDLER
// ===========================
function setupOptionListeners(questionId) {
    const optionLabels = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2 label');
    
    optionLabels.forEach((label) => {
        const radio = label.querySelector('input[type="radio"]');
        
        // Remove old listeners by cloning
        const newLabel = label.cloneNode(true);
        label.parentNode.replaceChild(newLabel, label);
        
        const newRadio = newLabel.querySelector('input[type="radio"]');
        
        newLabel.addEventListener('click', () => {
            // Save the selected answer
            userAnswers[questionId] = newRadio.value;
            
            console.log(`Selected answer: ${newRadio.value} for question ${questionId}`);
            
            // Update visual state of all options
            optionLabels.forEach((l, idx) => {
                const otherLabel = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2 label')[idx];
                const otherRadio = otherLabel.querySelector('input[type="radio"]');
                
                if (otherRadio.value === newRadio.value) {
                    otherLabel.className = 'group relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all border-primary bg-primary/5 dark:bg-primary/10';
                    otherRadio.checked = true;
                } else {
                    otherLabel.className = 'group relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all border-slate-200 dark:border-[#283039] bg-white dark:bg-[#1c252e] hover:border-primary/50 dark:hover:border-primary/50';
                    otherRadio.checked = false;
                }
            });
            
            // Update palette immediately
            updatePalette();
        });
    });
}

// ===========================
// NAVIGATION FUNCTIONS
// ===========================
function saveAndNext() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
        
        // Scroll to top
        const scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }
    } else {
        alert('This is the last question. Click "Submit Test" to finish.');
    }
}

function goToQuestion(index) {
    if (index >= 0 && index < questions.length) {
        displayQuestion(index);
        
        // Scroll to top
        const scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }
    }
}

// ===========================
// MARK FOR REVIEW
// ===========================
function markForReview() {
    const questionId = questions[currentQuestionIndex]._id;
    
    if (markedForReview.has(questionId)) {
        markedForReview.delete(questionId);
        alert('✅ Review mark removed');
    } else {
        markedForReview.add(questionId);
        alert('🔖 Question marked for review!');
    }
    
    updatePalette();
}

// ===========================
// UPDATE QUESTION PALETTE
// ===========================
function updatePalette() {
    const paletteButtons = document.querySelectorAll('.grid.grid-cols-5 button');
    
    questions.forEach((question, index) => {
        if (!paletteButtons[index]) return;
        
        const btn = paletteButtons[index];
        const questionId = question._id;
        const isAnswered = userAnswers[questionId] !== undefined;
        const isMarked = markedForReview.has(questionId);
        const isCurrent = index === currentQuestionIndex;
        
        // Reset classes
        btn.className = 'aspect-square rounded flex items-center justify-center text-sm font-bold transition-opacity';
        
        // Clear inner HTML
        btn.innerHTML = index + 1;
        
        // Apply appropriate class based on state
        if (isCurrent) {
            btn.classList.add('bg-primary', 'text-white', 'ring-2', 'ring-offset-2', 'ring-primary', 'ring-offset-slate-50', 'dark:ring-offset-[#161e27]', 'z-10', 'rounded-lg');
        } else if (isMarked && isAnswered) {
            btn.classList.add('bg-purple-500', 'text-white', 'hover:opacity-90', 'relative');
            // Add green dot for marked + answered
            btn.innerHTML = `${index + 1}<div class="absolute top-0 right-0 size-2 bg-green-500 rounded-full border border-white dark:border-[#161e27] translate-x-1/4 -translate-y-1/4"></div>`;
        } else if (isMarked) {
            btn.classList.add('bg-purple-500', 'text-white', 'hover:opacity-90');
        } else if (isAnswered) {
            btn.classList.add('bg-green-500', 'text-white', 'hover:opacity-90');
        } else if (index < currentQuestionIndex) {
            // Visited but not answered
            btn.classList.add('bg-red-500', 'text-white', 'hover:opacity-90');
        } else {
            // Not visited
            btn.classList.add('bg-slate-200', 'dark:bg-[#283039]', 'text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-300', 'dark:hover:bg-slate-700');
        }
        
        // Add click handler
        btn.onclick = () => goToQuestion(index);
    });
}

// ===========================
// UPDATE PROGRESS BAR
// ===========================
function updateProgress() {
    const answeredCount = Object.keys(userAnswers).length;
    const progressPercent = Math.round((answeredCount / questions.length) * 100);
    
    const progressBar = document.querySelector('.h-2 .bg-primary');
    const progressText = document.querySelector('.flex.justify-between.text-xs span:last-child');
    
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${progressPercent}%`;
    }
}

// ===========================
// TIMER FUNCTIONALITY
// ===========================
function startTimer() {
    const timerDisplay = document.querySelector('.font-mono.font-bold.tracking-widest');
    let totalSeconds = 3 * 60 * 60; // 3 hours in seconds
    
    timerInterval = setInterval(() => {
        totalSeconds--;
        
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            alert('⏰ Time is up! Submitting test automatically.');
            submitTest(true);
            return;
        }
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (timerDisplay) {
            timerDisplay.textContent = timeString;
        }
    }, 1000);
}

// ===========================
// SUBMIT TEST
// ===========================
function submitTest(autoSubmit = false) {
    if (!autoSubmit) {
        const unansweredCount = questions.length - Object.keys(userAnswers).length;
        
        let confirmMessage = 'Are you sure you want to submit the test?';
        if (unansweredCount > 0) {
            confirmMessage = `⚠️ You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`;
        }
        
        if (!confirm(confirmMessage)) {
            return;
        }
    }
    
    clearInterval(timerInterval);
    
    // Calculate score
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const results = [];
    
    questions.forEach((question) => {
        const userAnswer = userAnswers[question._id];
        const correctAnswer = question.correctAnswer || question.answer;
        
        if (!userAnswer) {
            unattempted++;
            results.push({
                questionId: question._id,
                question: question.question || question.text,
                options: question.options,
                userAnswer: null,
                correctAnswer: correctAnswer,
                isCorrect: false,
                subject: question.subject
            });
        } else if (userAnswer === correctAnswer) {
            correct++;
            score += 4; // +4 for correct
            results.push({
                questionId: question._id,
                question: question.question || question.text,
                options: question.options,
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                isCorrect: true,
                subject: question.subject
            });
        } else {
            incorrect++;
            score -= 1; // -1 for incorrect
            results.push({
                questionId: question._id,
                question: question.question || question.text,
                options: question.options,
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                isCorrect: false,
                subject: question.subject
            });
        }
    });
    
    // Calculate time taken
    const timeTakenMs = Date.now() - testStartTime;
    const timeTakenMinutes = Math.floor(timeTakenMs / 60000);
    
    // Prepare test results
    const testResults = {
        score: score,
        totalQuestions: questions.length,
        correct: correct,
        incorrect: incorrect,
        unattempted: unattempted,
        results: results,
        timeTaken: timeTakenMs,
        timeTakenMinutes: timeTakenMinutes,
        submittedAt: new Date().toISOString(),
        percentage: ((correct / questions.length) * 100).toFixed(2)
    };
    
    // Store in localStorage
    localStorage.setItem('testResults', JSON.stringify(testResults));
    
    // 🔥 ADD TO TEST HISTORY FOR DASHBOARD
    let testHistory = JSON.parse(localStorage.getItem('testHistory')) || [];
    testHistory.push(testResults);
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
    
    console.log('✅ Test submitted successfully:', testResults);
    console.log(`📊 Score: ${score}/${questions.length * 4} | Correct: ${correct} | Incorrect: ${incorrect} | Unattempted: ${unattempted}`);
    
    // Redirect to test-results page
    window.location.href = 'test-results.html';
}

// ===========================
// EXPOSE FUNCTIONS GLOBALLY
// ===========================
window.saveAndNext = saveAndNext;
window.markForReview = markForReview;
window.submitTest = submitTest;
window.goToQuestion = goToQuestion;

console.log('🚀 Test interface initialized');