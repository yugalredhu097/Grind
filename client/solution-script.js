// solution-script.js - Makes solution.html dynamic

const testResults = JSON.parse(localStorage.getItem('testResults'));
const currentQuestionIndex = parseInt(localStorage.getItem('currentQuestionIndex')) || 0;

if (!testResults || currentQuestionIndex === null) {
    alert('No question data found.');
    window.location.href = 'test-results.html';
} else {
    loadQuestionData();
}

function loadQuestionData() {
    const result = testResults.results[currentQuestionIndex];
    
    if (!result) {
        alert('Question not found.');
        window.location.href = 'test-results.html';
        return;
    }

    // Update question number in title
    const questionTitle = document.querySelector('h1');
    if (questionTitle) {
        questionTitle.textContent = `Question #${currentQuestionIndex + 1}`;
    }

    // Update breadcrumb
    const breadcrumbSpan = document.querySelector('.flex.flex-wrap.gap-2 span:last-child');
    if (breadcrumbSpan) {
        breadcrumbSpan.textContent = result.subject || 'Physics';
    }

    // Update subject badge
    const subjectChip = document.querySelector('.bg-blue-50 p');
    if (subjectChip) {
        subjectChip.textContent = result.subject || 'Physics';
    }

    // Update question text
    const questionText = document.querySelector('.prose p');
    if (questionText) {
        questionText.innerHTML = result.question;
    }

    // Update official solution with user's answer info
    updateOfficialSolution(result);
    
    // Update AI explanation
    updateAIExplanation(result);

    // Update back button
    const backButton = document.querySelector('button[class*="arrow_back"]');
    if (backButton) {
        backButton.onclick = () => window.location.href = 'test-results.html';
    }
}

function updateOfficialSolution(result) {
    // You can customize this to show actual step-by-step solutions from your backend
    const finalAnswerBox = document.querySelector('.bg-green-50');
    if (finalAnswerBox) {
        const answerParagraph = finalAnswerBox.querySelector('p:last-child');
        if (answerParagraph) {
            answerParagraph.innerHTML = `Correct Answer: <strong>${result.correctAnswer}</strong>`;
        }
    }
}

function updateAIExplanation(result) {
    // Add user's performance indicator
    const aiSection = document.querySelector('.bg-primary\\/10').closest('.relative');
    
    if (aiSection && result.userAnswer) {
        const performanceBadge = document.createElement('div');
        performanceBadge.className = `mt-4 p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30'}`;
        
        performanceBadge.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined ${result.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                    ${result.isCorrect ? 'check_circle' : 'cancel'}
                </span>
                <div>
                    <p class="font-bold text-sm ${result.isCorrect ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}">
                        ${result.isCorrect ? 'You got this right! ✓' : 'You selected: ' + result.userAnswer}
                    </p>
                    ${!result.isCorrect ? `<p class="text-sm text-slate-600 dark:text-slate-400 mt-1">The correct answer is <strong>${result.correctAnswer}</strong></p>` : ''}
                </div>
            </div>
        `;
        
        aiSection.querySelector('.flex.flex-col.gap-5').prepend(performanceBadge);
    }
}

console.log('✅ Solution page loaded for question', currentQuestionIndex + 1);