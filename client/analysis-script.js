// analysis-script.js - Makes analysis.html dynamic with real test data

const testResults = JSON.parse(localStorage.getItem('testResults'));

if (!testResults) {
    alert('No test results found. Please take a test first.');
    window.location.href = 'dashboard.html';
} else {
    loadAnalysisData();
}

function loadAnalysisData() {
    // Update score cards
    updateScoreCards();
    
    // Update AI insights
    updateAIInsights();
    
    // Update question analysis table
    updateQuestionTable();
    
    // Update performance charts
    updatePerformanceCharts();
}

function updateScoreCards() {
    // Total Marks
    const totalMarksEl = document.querySelector('.text-3xl.font-bold.leading-tight');
    if (totalMarksEl && totalMarksEl.textContent.includes('/')) {
        const maxScore = testResults.totalQuestions * 4;
        totalMarksEl.innerHTML = `${testResults.score}<span class="text-[#9dabb9] text-xl font-medium">/${maxScore}</span>`;
    }
    
    // Calculate percentile (mock calculation - you can make this more sophisticated)
    const percentile = Math.min(99.9, (testResults.percentage * 0.9) + 10);
    const percentileEl = document.querySelectorAll('.text-3xl.font-bold.leading-tight')[1];
    if (percentileEl) {
        percentileEl.textContent = percentile.toFixed(1);
    }
    
    // Accuracy Rate
    const accuracyEl = document.querySelectorAll('.text-3xl.font-bold.leading-tight')[2];
    if (accuracyEl) {
        accuracyEl.textContent = testResults.percentage + '%';
    }
    
    // Update accuracy progress bar
    const progressBar = document.querySelector('.bg-primary.h-1\\.5');
    if (progressBar) {
        progressBar.style.width = testResults.percentage + '%';
    }
}

function updateAIInsights() {
    // Analyze subject-wise performance
    const subjectStats = analyzeBySubject();
    
    // Find weakest subject
    let weakestSubject = null;
    let weakestAccuracy = 100;
    
    for (const [subject, stats] of Object.entries(subjectStats)) {
        const accuracy = (stats.correct / stats.total) * 100;
        if (accuracy < weakestAccuracy) {
            weakestAccuracy = accuracy;
            weakestSubject = subject;
        }
    }
    
    // Update AI insight cards
    const insightCards = document.querySelectorAll('.flex.gap-4.rounded-xl.border');
    
    if (insightCards[0] && weakestSubject) {
        const weakStats = subjectStats[weakestSubject];
        const accuracy = ((weakStats.correct / weakStats.total) * 100).toFixed(0);
        
        insightCards[0].querySelector('h4').textContent = `Weakness in ${weakestSubject}`;
        insightCards[0].querySelector('p').innerHTML = `Your accuracy in <span class="text-white font-medium">${weakestSubject}</span> is ${accuracy}%. Focus on practicing more questions from this subject.`;
    }
    
    // Time management insight
    if (insightCards[1]) {
        const avgTimePerQuestion = testResults.timeTakenMinutes / testResults.totalQuestions;
        const idealTime = 3; // 3 minutes per question
        
        if (avgTimePerQuestion > idealTime) {
            const percentMore = (((avgTimePerQuestion - idealTime) / idealTime) * 100).toFixed(0);
            insightCards[1].querySelector('p').innerHTML = `You spent <span class="text-white font-medium">${percentMore}% more time</span> than average per question. Practice time management strategies.`;
        } else {
            insightCards[1].querySelector('h4').textContent = 'Good Time Management ✓';
            insightCards[1].querySelector('p').innerHTML = `You're managing time well! <span class="text-white font-medium">Keep it up</span> and maintain this pace.`;
            insightCards[1].querySelector('.bg-yellow-500\\/10').className = 'size-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0';
            insightCards[1].querySelector('.text-yellow-500').className = 'material-symbols-outlined text-green-500';
        }
    }
    
    // Stronghold insight
    if (insightCards[2]) {
        let strongestSubject = null;
        let strongestAccuracy = 0;
        
        for (const [subject, stats] of Object.entries(subjectStats)) {
            const accuracy = (stats.correct / stats.total) * 100;
            if (accuracy > strongestAccuracy) {
                strongestAccuracy = accuracy;
                strongestSubject = subject;
            }
        }
        
        if (strongestSubject) {
            insightCards[2].querySelector('h4').textContent = `Stronghold: ${strongestSubject}`;
            insightCards[2].querySelector('p').innerHTML = `Excellent performance in <span class="text-white font-medium">${strongestSubject}</span> with ${strongestAccuracy.toFixed(0)}% accuracy. Keep maintaining this!`;
        }
    }
}

function updateQuestionTable() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Add rows for each question (show first 10 for now)
    testResults.results.slice(0, 10).forEach((result, index) => {
        const row = createTableRow(result, index);
        tbody.appendChild(row);
    });
}

function createTableRow(result, index) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-[#323b46] transition-colors group';
    
    // Determine status
    let statusBadge = '';
    if (result.userAnswer === null) {
        statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            Skipped
        </span>`;
    } else if (result.isCorrect) {
        statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Correct
        </span>`;
    } else {
        statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Incorrect
        </span>`;
    }
    
    // Mock time spent (you can track this in real implementation)
    const timeSpent = Math.floor(Math.random() * 100) + 30;
    
    // Mock difficulty
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const difficulty = difficulties[Math.floor(Math.random() * 3)];
    const difficultyBars = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3;
    const difficultyColor = difficulty === 'Easy' ? 'bg-green-500' : difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';
    
    tr.innerHTML = `
        <td class="p-4 text-white font-medium">${String(index + 1).padStart(2, '0')}</td>
        <td class="p-4">
            <div class="flex flex-col">
                <span class="text-white text-sm font-medium">${result.subject || 'Physics'}</span>
                <span class="text-[#9dabb9] text-xs">Topic placeholder</span>
            </div>
        </td>
        <td class="p-4">${statusBadge}</td>
        <td class="p-4 text-white text-sm">${timeSpent}s</td>
        <td class="p-4">
            <div class="flex gap-0.5">
                ${Array(3).fill(0).map((_, i) => 
                    `<div class="w-3 h-1.5 ${i < difficultyBars ? difficultyColor : 'bg-[#3b4754]'} rounded-sm"></div>`
                ).join('')}
                <span class="ml-2 text-xs text-[#9dabb9]">${difficulty}</span>
            </div>
        </td>
        <td class="p-4 text-right">
            <button onclick="viewSolutionFromAnalysis(${index})" class="text-primary hover:text-white text-sm font-medium transition-colors">View Solution</button>
        </td>
    `;
    
    return tr;
}

function updatePerformanceCharts() {
    // Charts are static for now - you can integrate Chart.js or similar library later
    console.log('Charts updated with test data');
}

function analyzeBySubject() {
    const subjectStats = {};
    
    testResults.results.forEach(result => {
        const subject = result.subject || 'Physics';
        
        if (!subjectStats[subject]) {
            subjectStats[subject] = {
                total: 0,
                correct: 0,
                incorrect: 0,
                unattempted: 0
            };
        }
        
        subjectStats[subject].total++;
        
        if (result.userAnswer === null) {
            subjectStats[subject].unattempted++;
        } else if (result.isCorrect) {
            subjectStats[subject].correct++;
        } else {
            subjectStats[subject].incorrect++;
        }
    });
    
    return subjectStats;
}

function viewSolutionFromAnalysis(questionIndex) {
    localStorage.setItem('currentQuestionIndex', questionIndex);
    window.location.href = 'solution.html';
}

// Update "View Solutions" button at the bottom
const viewSolutionsBtn = document.querySelector('button[onclick*="solution.html"]');
if (viewSolutionsBtn) {
    viewSolutionsBtn.onclick = () => window.location.href = 'test-results.html';
}

console.log('✅ Analysis page loaded with test data');