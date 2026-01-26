// dashboard-script.js - Makes dashboard.html dynamic with real user data

// Load test history from localStorage
let testHistory = JSON.parse(localStorage.getItem('testHistory')) || [];
let userStats = JSON.parse(localStorage.getItem('userStats')) || {
    totalQuestionsAttempted: 0,
    averageAccuracy: 0,
    streak: 5
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});

function loadDashboardData() {
    updateQuickStats();
    updateRecentActivity();
    updateUserName();
}

// Update the 3 stat cards at the top
function updateQuickStats() {
    // Get most recent test score
    const recentTest = testHistory.length > 0 ? testHistory[testHistory.length - 1] : null;
    
    // Card 1: Recent Mock Score
    const scoreElement = document.querySelector('.text-2xl.font-bold');
    if (scoreElement && recentTest) {
        const maxScore = recentTest.totalQuestions * 4;
        scoreElement.innerHTML = `${recentTest.score}<span class="text-lg text-[#9dabb9] font-medium">/${maxScore}</span>`;
    } else if (scoreElement) {
        scoreElement.innerHTML = `0<span class="text-lg text-[#9dabb9] font-medium">/300</span>`;
    }
    
    // Card 2: Questions Attempted
    const questionsElements = document.querySelectorAll('.text-2xl.font-bold');
    if (questionsElements[1]) {
        const totalAttempted = testHistory.reduce((sum, test) => {
            return sum + (test.totalQuestions - test.unattempted);
        }, 0);
        
        questionsElements[1].textContent = totalAttempted.toLocaleString();
        
        // Calculate change from last test
        if (testHistory.length >= 2) {
            const lastTest = testHistory[testHistory.length - 1];
            const prevTest = testHistory[testHistory.length - 2];
            const lastAttempted = lastTest.totalQuestions - lastTest.unattempted;
            const prevAttempted = prevTest.totalQuestions - prevTest.unattempted;
            const change = lastAttempted - prevAttempted;
            
            const changeElement = questionsElements[1].parentElement.querySelector('.text-green-500');
            if (changeElement && change !== 0) {
                changeElement.innerHTML = `<span class="material-symbols-outlined text-sm">trending_${change > 0 ? 'up' : 'down'}</span> ${change > 0 ? '+' : ''}${change}`;
            }
        }
    }
    
    // Card 3: Accuracy %
    const accuracyElements = document.querySelectorAll('.text-2xl.font-bold');
    if (accuracyElements[2]) {
        let averageAccuracy = 0;
        
        if (testHistory.length > 0) {
            const totalAccuracy = testHistory.reduce((sum, test) => {
                const attempted = test.totalQuestions - test.unattempted;
                return sum + (attempted > 0 ? (test.correct / attempted) * 100 : 0);
            }, 0);
            averageAccuracy = Math.round(totalAccuracy / testHistory.length);
        }
        
        accuracyElements[2].textContent = averageAccuracy + '%';
        
        // Calculate change from last test
        if (testHistory.length >= 2) {
            const lastTest = testHistory[testHistory.length - 1];
            const prevTest = testHistory[testHistory.length - 2];
            
            const lastAttempted = lastTest.totalQuestions - lastTest.unattempted;
            const prevAttempted = prevTest.totalQuestions - prevTest.unattempted;
            
            const lastAccuracy = lastAttempted > 0 ? (lastTest.correct / lastAttempted) * 100 : 0;
            const prevAccuracy = prevAttempted > 0 ? (prevTest.correct / prevAttempted) * 100 : 0;
            
            const change = Math.round(lastAccuracy - prevAccuracy);
            
            const changeElement = accuracyElements[2].parentElement.querySelector('.text-green-500');
            if (changeElement && change !== 0) {
                changeElement.className = change > 0 ? 'text-green-500 text-xs font-bold mb-1.5 flex items-center' : 'text-red-500 text-xs font-bold mb-1.5 flex items-center';
                changeElement.innerHTML = `<span class="material-symbols-outlined text-sm">trending_${change > 0 ? 'up' : 'down'}</span> ${change > 0 ? '+' : ''}${change}%`;
            }
        }
    }
}

// Update Recent Activity feed
function updateRecentActivity() {
    const activityContainer = document.querySelector('.relative.pl-4.space-y-8');
    if (!activityContainer) return;
    
    // Clear existing activities (except timeline line)
    const timelineLine = activityContainer.querySelector('.absolute.left-4');
    activityContainer.innerHTML = '';
    if (timelineLine) {
        activityContainer.appendChild(timelineLine);
    }
    
    // If no test history, show placeholder
    if (testHistory.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'text-center py-8';
        placeholder.innerHTML = `
            <span class="material-symbols-outlined text-[#9dabb9] text-4xl mb-2">assignment</span>
            <p class="text-[#9dabb9] text-sm">No activity yet. Take your first test!</p>
        `;
        activityContainer.appendChild(placeholder);
        return;
    }
    
    // Show last 4 activities
    const recentTests = testHistory.slice(-4).reverse();
    
    recentTests.forEach((test, index) => {
        const activity = createActivityItem(test, index);
        activityContainer.appendChild(activity);
    });
}

function createActivityItem(test, index) {
    const div = document.createElement('div');
    div.className = 'relative flex gap-4 group cursor-pointer';
    
    // Determine time ago
    const timeAgo = getTimeAgo(test.submittedAt);
    
    // Determine icon and color based on performance
    let iconClass = 'check';
    let borderColor = 'border-green-500';
    let iconColor = 'text-green-500';
    
    const percentage = parseFloat(test.percentage);
    if (percentage < 50) {
        iconClass = 'close';
        borderColor = 'border-red-500';
        iconColor = 'text-red-500';
    } else if (percentage < 75) {
        iconClass = 'trending_up';
        borderColor = 'border-orange-500';
        iconColor = 'text-orange-500';
    }
    
    div.innerHTML = `
        <div class="relative z-10 flex-shrink-0 size-8 rounded-full bg-[#101922] border-2 ${borderColor} flex items-center justify-center">
            <span class="material-symbols-outlined ${iconColor} text-sm">${iconClass}</span>
        </div>
        <div class="flex-1 -mt-1 p-3 rounded-lg hover:bg-[#101922] transition-colors border border-transparent hover:border-border-dark">
            <div class="flex justify-between items-start">
                <p class="text-white text-sm font-semibold">Mock Test ${testHistory.length - index}</p>
                <span class="text-[10px] text-[#9dabb9]">${timeAgo}</span>
            </div>
            <p class="text-[#9dabb9] text-xs mt-0.5">Scored ${test.score}/${test.totalQuestions * 4} • ${test.percentage}% accuracy</p>
        </div>
    `;
    
    // Add click handler to view results
    div.onclick = () => {
        // Load this test's results and go to test-results page
        localStorage.setItem('testResults', JSON.stringify(test));
        window.location.href = 'test-results.html';
    };
    
    return div;
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
        return diffMins === 0 ? 'Just now' : `${diffMins}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Update user name
function updateUserName() {
    const userName = localStorage.getItem('userName') || 'Student';
    const welcomeHeader = document.querySelector('h1.text-3xl');
    if (welcomeHeader) {
        welcomeHeader.textContent = `Welcome back, ${userName}`;
    }
    
    // Update sidebar user name
    const sidebarName = document.querySelector('.text-sm.font-medium.truncate');
    if (sidebarName) {
        sidebarName.textContent = userName;
    }
}

// Save test to history when completing a test
function saveTestToHistory(testResults) {
    testHistory.push(testResults);
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
    
    // Update user stats
    const totalAttempted = testHistory.reduce((sum, test) => {
        return sum + (test.totalQuestions - test.unattempted);
    }, 0);
    
    const totalAccuracy = testHistory.reduce((sum, test) => {
        const attempted = test.totalQuestions - test.unattempted;
        return sum + (attempted > 0 ? (test.correct / attempted) * 100 : 0);
    }, 0);
    const averageAccuracy = testHistory.length > 0 ? totalAccuracy / testHistory.length : 0;
    
    userStats = {
        totalQuestionsAttempted: totalAttempted,
        averageAccuracy: averageAccuracy,
        streak: userStats.streak // Keep existing streak
    };
    
    localStorage.setItem('userStats', JSON.stringify(userStats));
}

// Expose function globally
window.saveTestToHistory = saveTestToHistory;

console.log('✅ Dashboard loaded with user data');