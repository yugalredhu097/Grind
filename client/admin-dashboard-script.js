// admin-dashboard-script.js - Admin Dashboard Logic

// Mock student data (In production, fetch from backend)
const mockStudents = [
    { name: 'Rahul Sharma', testsTaken: 5, avgScore: 78, accuracy: 82, weakSubject: 'Chemistry', lastActive: '2 hours ago' },
    { name: 'Priya Singh', testsTaken: 8, avgScore: 85, accuracy: 88, weakSubject: 'Physics', lastActive: '1 day ago' },
    { name: 'Amit Kumar', testsTaken: 3, avgScore: 65, accuracy: 70, weakSubject: 'Mathematics', lastActive: '3 hours ago' },
    { name: 'Sneha Patel', testsTaken: 6, avgScore: 92, accuracy: 95, weakSubject: 'Physics', lastActive: '30 mins ago' },
    { name: 'Vikram Reddy', testsTaken: 4, avgScore: 70, accuracy: 75, weakSubject: 'Chemistry', lastActive: '5 hours ago' },
];

// Weak concepts data
const weakConcepts = [
    { subject: 'Chemistry', topic: 'Organic Chemistry', avgAccuracy: 45, studentCount: 12 },
    { subject: 'Physics', topic: 'Rotational Motion', avgAccuracy: 52, studentCount: 8 },
    { subject: 'Mathematics', topic: 'Integration', avgAccuracy: 58, studentCount: 10 },
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    loadWeakConcepts();
    loadStudentTable();
});

function loadDashboardStats() {
    // Calculate stats
    const totalStudents = mockStudents.length;
    const totalTests = mockStudents.reduce((sum, student) => sum + student.testsTaken, 0);
    const avgScore = Math.round(mockStudents.reduce((sum, student) => sum + student.avgScore, 0) / totalStudents);
    const avgTime = 45; // Mock data
    
    // Update UI
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('totalTests').textContent = totalTests;
    document.getElementById('avgScore').textContent = avgScore + '%';
    document.getElementById('avgTime').textContent = avgTime + ' min';
}

function loadWeakConcepts() {
    const grid = document.getElementById('weakConceptsGrid');
    grid.innerHTML = '';
    
    weakConcepts.forEach(concept => {
        const card = document.createElement('div');
        card.className = 'bg-slate-50 dark:bg-[#161e27] rounded-lg p-4 border border-slate-200 dark:border-[#283039]';
        
        const colorClass = concept.avgAccuracy < 50 ? 'text-red-500' : concept.avgAccuracy < 70 ? 'text-orange-500' : 'text-yellow-500';
        
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
                    <p class="text-sm font-medium">${concept.studentCount} students</p>
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
    
    mockStudents.forEach(student => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-50 dark:hover:bg-[#161e27] transition-colors';
        
        const accuracyColor = student.accuracy >= 80 ? 'text-green-600 dark:text-green-400' : 
                               student.accuracy >= 60 ? 'text-orange-600 dark:text-orange-400' : 
                               'text-red-600 dark:text-red-400';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                    <div class="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                        ${student.name.charAt(0)}
                    </div>
                    <div>
                        <p class="font-medium">${student.name}</p>
                        <p class="text-xs text-slate-500 dark:text-slate-400">Student ID: ${Math.floor(Math.random() * 10000)}</p>
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
                <span class="text-sm font-bold ${accuracyColor}">${student.accuracy}%</span>
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
                <button onclick="viewStudentDetails('${student.name}')" class="text-primary hover:text-blue-600 text-sm font-medium">
                    View Details →
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function viewStudentDetails(studentName) {
    alert(`Viewing detailed analytics for ${studentName}.\n\nThis would show:\n- Test-wise performance\n- Subject-wise breakdown\n- Weak topics\n- Progress over time`);
}

console.log('✅ Admin Dashboard loaded');