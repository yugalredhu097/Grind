// admin-dashboard-script.js - Dynamic Admin Dashboard with Real Data

// Get all test history from localStorage
let allTestHistory = [];
let studentData = {};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadRealData();
    loadDashboardStats();
    loadWeakConcepts();
    loadStudentTable();
});

// Load real data from localStorage
function loadRealData() {
    // Get test history
    allTestHistory = JSON.parse(localStorage.getItem('testHistory')) || [];
    
    // If no data, use mock data for demo
    if (allTestHistory.length === 0) {
        console.log('⚠️ No real test data found. Using mock data for demo.');
        useMockData();
        return;
    }
    
    // Process test history to create student data
    processStudentData();
}

// Process test history to extract student performance
function processStudentData() {
    // For now, we'll treat all tests as from one student
    // In production, you'd have user IDs to differentiate
    
    const studentName = localStorage.getItem('userName') || 'Current Student';
    
    studentData[studentName] = {
        name: studentName,
        testsTaken: allTestHistory.length,
        tests: allTestHistory,
        avgScore: 0,
        avgAccuracy: 0,
        totalScore: 0,
        totalCorrect: 0,
        totalAttempted: 0,
        subjectPerformance: {},
        weakSubject: '',
        lastActive: allTestHistory.length > 0 ? getTimeAgo(allTestHistory[allTestHistory.length - 1].submittedAt) : 'Never'
    };
    
    // Calculate averages
    allTestHistory.forEach(test => {
        studentData[studentName].totalScore += test.score;
        studentData[studentName].totalCorrect += test.correct;
        studentData[studentName].totalAttempted += (test.totalQuestions - test.unattempted);
        
        // Track subject-wise performance
        test.results.forEach(result => {
            const subject = result.subject || 'Physics';
            if (!studentData[studentName].subjectPerformance[subject]) {
                studentData[studentName].subjectPerformance[subject] = {
                    correct: 0,
                    total: 0,
                    accuracy: 0
                };
            }
            
            studentData[studentName].subjectPerformance[subject].total++;
            if (result.isCorrect) {
                studentData[studentName].subjectPerformance[subject].correct++;
            }
        });
    });
    
    // Calculate final averages
    const totalTests = allTestHistory.length;
    studentData[studentName].avgScore = Math.round(studentData[studentName].totalScore / totalTests);
    studentData[studentName].avgAccuracy = studentData[studentName].totalAttempted > 0 
        ? Math.round((studentData[studentName].totalCorrect / studentData[studentName].totalAttempted) * 100) 
        : 0;
    
    // Calculate subject accuracies
    Object.keys(studentData[studentName].subjectPerformance).forEach(subject => {
        const perf = studentData[studentName].subjectPerformance[subject];
        perf.accuracy = perf.total > 0 ? Math.round((perf.correct / perf.total) * 100) : 0;
    });
    
    // Find weak subject
    let lowestAccuracy = 100;
    Object.keys(studentData[studentName].subjectPerformance).forEach(subject => {
        const accuracy = studentData[studentName].subjectPerformance[subject].accuracy;
        if (accuracy < lowestAccuracy) {
            lowestAccuracy = accuracy;
            studentData[studentName].weakSubject = subject;
        }
    });
    
    if (!studentData[studentName].weakSubject) {
        studentData[studentName].weakSubject = 'N/A';
    }
}

// Use mock data if no real data exists
function useMockData() {
    studentData = {
        'Rahul Sharma': {
            name: 'Rahul Sharma',
            testsTaken: 5,
            avgScore: 78,
            avgAccuracy: 82,
            weakSubject: 'Chemistry',
            lastActive: '2 hours ago',
            subjectPerformance: {
                'Physics': { correct: 25, total: 35, accuracy: 71 },
                'Chemistry': { correct: 18, total: 30, accuracy: 60 },
                'Mathematics': { correct: 28, total: 35, accuracy: 80 }
            }
        },
        'Priya Singh': {
            name: 'Priya Singh',
            testsTaken: 8,
            avgScore: 85,
            avgAccuracy: 88,
            weakSubject: 'Physics',
            lastActive: '1 day ago',
            subjectPerformance: {
                'Physics': { correct: 30, total: 40, accuracy: 75 },
                'Chemistry': { correct: 38, total: 40, accuracy: 95 },
                'Mathematics': { correct: 36, total: 40, accuracy: 90 }
            }
        },
        'Amit Kumar': {
            name: 'Amit Kumar',
            testsTaken: 3,
            avgScore: 65,
            avgAccuracy: 70,
            weakSubject: 'Mathematics',
            lastActive: '3 hours ago',
            subjectPerformance: {
                'Physics': { correct: 15, total: 20, accuracy: 75 },
                'Chemistry': { correct: 14, total: 20, accuracy: 70 },
                'Mathematics': { correct: 10, total: 20, accuracy: 50 }
            }
        },
        'Sneha Patel': {
            name: 'Sneha Patel',
            testsTaken: 6,
            avgScore: 92,
            avgAccuracy: 95,
            weakSubject: 'Physics',
            lastActive: '30 mins ago',
            subjectPerformance: {
                'Physics': { correct: 35, total: 40, accuracy: 87 },
                'Chemistry': { correct: 38, total: 40, accuracy: 95 },
                'Mathematics': { correct: 39, total: 40, accuracy: 97 }
            }
        },
    };
    
    // Create mock test history
    allTestHistory = [
        { score: 78, totalQuestions: 30, correct: 20, submittedAt: new Date().toISOString() },
        { score: 85, totalQuestions: 30, correct: 23, submittedAt: new Date().toISOString() },
        { score: 65, totalQuestions: 30, correct: 18, submittedAt: new Date().toISOString() }
    ];
}

function loadDashboardStats() {
    // Calculate stats
    const totalStudents = Object.keys(studentData).length;
    const totalTests = allTestHistory.length;
    
    let totalScoreSum = 0;
    let totalTimeSum = 0;
    let studentCount = 0;
    
    Object.values(studentData).forEach(student => {
        totalScoreSum += student.avgScore;
        studentCount++;
    });
    
    allTestHistory.forEach(test => {
        totalTimeSum += test.timeTakenMinutes || 0;
    });
    
    const avgScore = studentCount > 0 ? Math.round(totalScoreSum / studentCount) : 0;
    const avgTime = totalTests > 0 ? Math.round(totalTimeSum / totalTests) : 0;
    
    // Update UI
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('totalTests').textContent = totalTests;
    document.getElementById('avgScore').textContent = avgScore + '%';
    document.getElementById('avgTime').textContent = avgTime + ' min';
}

function loadWeakConcepts() {
    const grid = document.getElementById('weakConceptsGrid');
    grid.innerHTML = '';
    
    // Analyze weak concepts across all students
    const conceptAnalysis = {};
    
    Object.values(studentData).forEach(student => {
        Object.keys(student.subjectPerformance || {}).forEach(subject => {
            const perf = student.subjectPerformance[subject];
            
            if (!conceptAnalysis[subject]) {
                conceptAnalysis[subject] = {
                    subject: subject,
                    totalAccuracy: 0,
                    studentCount: 0,
                    strugglingStudents: 0
                };
            }
            
            conceptAnalysis[subject].totalAccuracy += perf.accuracy;
            conceptAnalysis[subject].studentCount++;
            
            if (perf.accuracy < 70) {
                conceptAnalysis[subject].strugglingStudents++;
            }
        });
    });
    
    // Calculate average accuracy per subject
    const weakConcepts = Object.values(conceptAnalysis).map(concept => {
        return {
            subject: concept.subject,
            topic: concept.subject + ' (Overall)',
            avgAccuracy: Math.round(concept.totalAccuracy / concept.studentCount),
            studentCount: concept.strugglingStudents
        };
    }).sort((a, b) => a.avgAccuracy - b.avgAccuracy).slice(0, 3);
    
    // If no real weak concepts, show placeholder
    if (weakConcepts.length === 0) {
        grid.innerHTML = `
            <div class="col-span-3 text-center py-8">
                <span class="material-symbols-outlined text-slate-400 text-4xl mb-2">check_circle</span>
                <p class="text-slate-500 dark:text-slate-400">No weak concepts identified yet. More data needed.</p>
            </div>
        `;
        return;
    }
    
    weakConcepts.forEach(concept => {
        const card = document.createElement('div');
        card.className = 'bg-slate-50 dark:bg-[#161e27] rounded-lg p-4 border border-slate-200 dark:border-[#283039] hover:border-primary/50 transition-colors cursor-pointer';
        
        const colorClass = concept.avgAccuracy < 50 ? 'text-red-500' : 
                          concept.avgAccuracy < 70 ? 'text-orange-500' : 
                          'text-yellow-500';
        
        card.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div>
                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400">${concept.subject}</p>
                    <h3 class="text-base font-bold mt-1">${concept.topic}</h3>
                </div>
                <span class="material-symbols-outlined ${colorClass}">warning</span>
            </div>
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-2xl font-bold ${colorClass}">${concept.avgAccuracy}%</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Avg Accuracy</p>
                </div>
                <div class="text-right">
                    <p class="text-sm font-medium">${concept.studentCount} student${concept.studentCount !== 1 ? 's' : ''}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">struggling</p>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function loadStudentTable() {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';
    
    const students = Object.values(studentData);
    
    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center">
                    <span class="material-symbols-outlined text-slate-400 text-4xl mb-2 block">person_off</span>
                    <p class="text-slate-500 dark:text-slate-400 mt-2">No student data available yet.</p>
                    <p class="text-sm text-slate-400 dark:text-slate-500 mt-1">Students will appear here after taking tests.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-50 dark:hover:bg-[#161e27] transition-colors';
        
        const accuracyColor = student.avgAccuracy >= 80 ? 'text-green-600 dark:text-green-400' : 
                               student.avgAccuracy >= 60 ? 'text-orange-600 dark:text-orange-400' : 
                               'text-red-600 dark:text-red-400';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                    <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        ${student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-medium">${student.name}</p>
                        <p class="text-xs text-slate-500 dark:text-slate-400">Student ID: ${1000 + index}</p>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium">${student.testsTaken}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-bold">${student.avgScore}%</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-bold ${accuracyColor}">${student.avgAccuracy}%</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-xs font-medium">
                    ${student.weakSubject}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                ${student.lastActive}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
                <button onclick="viewStudentDetails('${student.name}')" class="text-primary hover:text-blue-600 text-sm font-medium transition-colors">
                    View Details →
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function viewStudentDetails(studentName) {
    const student = studentData[studentName];
    
    if (!student) {
        alert('Student not found');
        return;
    }
    
    let subjectBreakdown = '';
    Object.keys(student.subjectPerformance || {}).forEach(subject => {
        const perf = student.subjectPerformance[subject];
        subjectBreakdown += `\n• ${subject}: ${perf.accuracy}% (${perf.correct}/${perf.total} correct)`;
    });
    
    alert(`📊 Detailed Analytics for ${studentName}\n\n` +
          `Tests Taken: ${student.testsTaken}\n` +
          `Average Score: ${student.avgScore}%\n` +
          `Average Accuracy: ${student.avgAccuracy}%\n` +
          `Weak Subject: ${student.weakSubject}\n` +
          `\nSubject-wise Performance:${subjectBreakdown}\n\n` +
          `Last Active: ${student.lastActive}`);
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

console.log('✅ Admin Dashboard loaded with real data');
console.log('📊 Students:', Object.keys(studentData).length);
console.log('📝 Total Tests:', allTestHistory.length);