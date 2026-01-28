// profile-script.js - Student Profile Page Logic

let testHistory = [];
let userName = '';
let userEmail = '';

// Initialize profile
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    loadPerformanceData();
    loadRecentTests();
});

function loadProfileData() {
    // Get user info from localStorage
    userName = localStorage.getItem('userName') || 'Student';
    userEmail = localStorage.getItem('userEmail') || 'student@example.com';
    
    // Update profile info
    document.getElementById('profileName').textContent = userName;
    document.getElementById('profileEmail').textContent = userEmail;
    document.getElementById('profileInitial').textContent = userName.charAt(0).toUpperCase();
    
    // Load test history
    testHistory = JSON.parse(localStorage.getItem('testHistory')) || [];
    
    // Update basic stats
    document.getElementById('profileTestsTaken').textContent = testHistory.length;
    
    // Calculate average score
    if (testHistory.length > 0) {
        const totalScore = testHistory.reduce((sum, test) => sum + parseFloat(test.percentage), 0);
        const avgScore = Math.round(totalScore / testHistory.length);
        document.getElementById('profileAvgScore').textContent = avgScore + '%';
    }
    
    // Generate Student ID
    const id = userName.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 10000);
    document.getElementById('studentId').textContent = 'JEE2024-' + id;
    
    // Mock study streak (in production, calculate from actual data)
    document.getElementById('studyStreak').textContent = Math.floor(Math.random() * 15) + ' days';
}

function loadPerformanceData() {
    // Calculate total questions attempted
    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalAttempted = 0;
    
    const subjectStats = {
        'Physics': { correct: 0, total: 0 },
        'Chemistry': { correct: 0, total: 0 },
        'Mathematics': { correct: 0, total: 0 }
    };
    
    testHistory.forEach(test => {
        totalQuestions += test.totalQuestions;
        totalCorrect += test.correct;
        totalAttempted += (test.totalQuestions - test.unattempted);
        
        // Subject-wise breakdown
        test.results.forEach(result => {
            const subject = result.subject || 'Physics';
            if (subjectStats[subject]) {
                subjectStats[subject].total++;
                if (result.isCorrect) {
                    subjectStats[subject].correct++;
                }
            }
        });
    });
    
    document.getElementById('totalQuestions').textContent = totalAttempted;
    
    // Calculate overall accuracy
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    document.getElementById('overallAccuracy').textContent = accuracy + '%';
    
    // Display subject-wise performance
    displaySubjectPerformance(subjectStats);
}

function displaySubjectPerformance(subjectStats) {
    const container = document.getElementById('subjectPerformance');
    container.innerHTML = '';
    
    const subjects = ['Physics', 'Chemistry', 'Mathematics'];
    const colors = {
        'Physics': { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-100 dark:bg-blue-900/20' },
        'Chemistry': { bg: 'bg-pink-500', text: 'text-pink-500', light: 'bg-pink-100 dark:bg-pink-900/20' },
        'Mathematics': { bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-100 dark:bg-purple-900/20' }
    };
    
    subjects.forEach(subject => {
        const stats = subjectStats[subject];
        const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        const color = colors[subject];
        
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-4 bg-slate-50 dark:bg-[#161e27] rounded-lg';
        
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="size-10 ${color.light} rounded-lg flex items-center justify-center">
                    <span class="material-symbols-outlined ${color.text}">${subject === 'Physics' ? 'science' : subject === 'Chemistry' ? 'biotech' : 'calculate'}</span>
                </div>
                <div>
                    <p class="font-medium">${subject}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">${stats.correct}/${stats.total} correct</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-xl font-bold ${color.text}">${accuracy}%</p>
                <div class="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                    <div class="${color.bg} h-full rounded-full" style="width: ${accuracy}%"></div>
                </div>
            </div>
        `;
        
        container.appendChild(div);
    });
    
    // If no data, show placeholder
    if (testHistory.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <span class="material-symbols-outlined text-slate-400 text-4xl mb-2">assignment</span>
                <p class="text-slate-500 dark:text-slate-400">No performance data yet. Take a test to see your stats!</p>
            </div>
        `;
    }
}

function loadRecentTests() {
    const container = document.getElementById('recentTestsList');
    container.innerHTML = '';
    
    const recentTests = testHistory.slice(-5).reverse(); // Last 5 tests
    
    if (recentTests.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <span class="material-symbols-outlined text-slate-400 text-4xl mb-2">quiz</span>
                <p class="text-slate-500 dark:text-slate-400">No tests taken yet. Start practicing!</p>
            </div>
        `;
        return;
    }
    
    recentTests.forEach((test, index) => {
        const date = new Date(test.submittedAt);
        const scorePercentage = parseFloat(test.percentage);
        const scoreColor = scorePercentage >= 75 ? 'text-green-600 dark:text-green-400' : 
                           scorePercentage >= 50 ? 'text-orange-600 dark:text-orange-400' : 
                           'text-red-600 dark:text-red-400';
        
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-4 bg-slate-50 dark:bg-[#161e27] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer';
        div.onclick = () => viewTestDetails(testHistory.length - index - 1);
        
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary">assignment</span>
                </div>
                <div>
                    <p class="font-medium">Mock Test ${testHistory.length - index}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">${date.toLocaleDateString()}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold ${scoreColor}">${test.score}/${test.totalQuestions * 4}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">${test.percentage}%</p>
            </div>
        `;
        
        container.appendChild(div);
    });
}

// Action handlers
function editProfile() {
    const newName = prompt('Enter your name:', userName);
    if (newName && newName.trim()) {
        userName = newName.trim();
        localStorage.setItem('userName', userName);
        loadProfileData();
        alert('✅ Profile updated successfully!');
    }
}

function changeProfilePicture() {
    alert('📸 Profile picture upload coming soon!\n\nIn production, this would open a file picker to upload your photo.');
}

function changePassword() {
    alert('🔒 Change Password\n\nThis feature will be available in the full version.');
}

function downloadReport() {
    if (testHistory.length === 0) {
        alert('No test data to download. Take a test first!');
        return;
    }
    
    alert('📥 Downloading your performance report...\n\nIn production, this would generate a PDF with detailed analytics.');
}

function clearHistory() {
    if (testHistory.length === 0) {
        alert('No test history to clear.');
        return;
    }
    
    if (confirm('⚠️ Are you sure you want to clear all test history?\n\nThis action cannot be undone.')) {
        localStorage.removeItem('testHistory');
        testHistory = [];
        alert('✅ Test history cleared successfully!');
        location.reload();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        window.location.href = 'login.html';
    }
}

function viewTestDetails(testIndex) {
    const test = testHistory[testIndex];
    localStorage.setItem('testResults', JSON.stringify(test));
    window.location.href = 'test-results.html';
}

console.log('✅ Profile page loaded');