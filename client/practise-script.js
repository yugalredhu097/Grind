// practice-script.js - Practice Mode Logic

let selectedSubject = '';
let selectedYear = 'all';

// Chapter data for each subject
const chapters = {
    'Physics': [
        { name: 'Mechanics', topics: ['Newton\'s Laws', 'Work Energy Power', 'Rotational Motion'], questions: 45 },
        { name: 'Thermodynamics', topics: ['Laws of Thermodynamics', 'Heat Transfer', 'Kinetic Theory'], questions: 38 },
        { name: 'Waves and Oscillations', topics: ['SHM', 'Sound Waves', 'Wave Interference'], questions: 42 },
        { name: 'Electrostatics', topics: ['Coulomb\'s Law', 'Electric Field', 'Capacitors'], questions: 50 },
        { name: 'Current Electricity', topics: ['Ohm\'s Law', 'Kirchhoff\'s Laws', 'RC Circuits'], questions: 35 },
        { name: 'Magnetism', topics: ['Magnetic Field', 'Electromagnetic Induction', 'AC Circuits'], questions: 40 },
        { name: 'Optics', topics: ['Ray Optics', 'Wave Optics', 'Optical Instruments'], questions: 44 },
        { name: 'Modern Physics', topics: ['Photoelectric Effect', 'Bohr Model', 'Nuclear Physics'], questions: 52 },
        { name: 'Kinematics', topics: ['Motion in 1D', 'Motion in 2D', 'Projectile Motion'], questions: 36 },
    ],
    'Chemistry': [
        { name: 'Organic Chemistry - Basics', topics: ['Nomenclature', 'Isomerism', 'GOC'], questions: 48 },
        { name: 'Hydrocarbons', topics: ['Alkanes', 'Alkenes', 'Alkynes', 'Aromatic'], questions: 52 },
        { name: 'Alcohols and Phenols', topics: ['Preparation', 'Properties', 'Reactions'], questions: 40 },
        { name: 'Aldehydes and Ketones', topics: ['Preparation', 'Nucleophilic Addition', 'Tests'], questions: 45 },
        { name: 'Carboxylic Acids', topics: ['Preparation', 'Properties', 'Derivatives'], questions: 38 },
        { name: 'Atomic Structure', topics: ['Bohr Model', 'Quantum Numbers', 'Electronic Config'], questions: 42 },
        { name: 'Chemical Bonding', topics: ['Ionic', 'Covalent', 'VSEPR', 'Hybridization'], questions: 50 },
        { name: 'Thermodynamics', topics: ['Laws', 'Enthalpy', 'Entropy', 'Gibbs Energy'], questions: 46 },
        { name: 'Electrochemistry', topics: ['Electrolytic Cells', 'Galvanic Cells', 'Nernst Equation'], questions: 44 },
        { name: 'Chemical Kinetics', topics: ['Rate Law', 'Order', 'Arrhenius Equation'], questions: 40 },
    ],
    'Mathematics': [
        { name: 'Algebra', topics: ['Complex Numbers', 'Quadratic Equations', 'Sequences'], questions: 55 },
        { name: 'Trigonometry', topics: ['Ratios', 'Identities', 'Equations', 'Inverse'], questions: 48 },
        { name: 'Calculus - Differentiation', topics: ['Limits', 'Derivatives', 'Applications'], questions: 60 },
        { name: 'Calculus - Integration', topics: ['Indefinite', 'Definite', 'Applications'], questions: 58 },
        { name: 'Differential Equations', topics: ['First Order', 'Second Order', 'Applications'], questions: 42 },
        { name: 'Vectors', topics: ['Operations', 'Dot Product', 'Cross Product'], questions: 40 },
        { name: '3D Geometry', topics: ['Lines', 'Planes', 'Distance', 'Angles'], questions: 45 },
        { name: 'Probability', topics: ['Events', 'Conditional', 'Distributions'], questions: 50 },
        { name: 'Matrices and Determinants', topics: ['Operations', 'Properties', 'Applications'], questions: 46 },
        { name: 'Coordinate Geometry', topics: ['Straight Lines', 'Circles', 'Conic Sections'], questions: 52 },
    ]
};

// Select subject
function selectSubject(subject) {
    selectedSubject = subject;
    
    // Hide subject selection
    document.getElementById('subjectSelection').classList.add('hidden');
    
    // Show chapter selection
    document.getElementById('chapterSelection').classList.remove('hidden');
    
    // Update title
    document.getElementById('selectedSubjectTitle').textContent = `${subject} Chapters`;
    
    // Load chapters
    loadChapters();
}

// Load chapters for selected subject
function loadChapters() {
    const chaptersList = document.getElementById('chaptersList');
    chaptersList.innerHTML = '';
    
    const subjectChapters = chapters[selectedSubject] || [];
    
    subjectChapters.forEach((chapter, index) => {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-[#1c252e] rounded-xl border border-slate-200 dark:border-[#283039] p-6 hover:border-primary hover:shadow-lg transition-all cursor-pointer group';
        
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        ${index + 1}
                    </div>
                    <div>
                        <h3 class="font-bold text-lg group-hover:text-primary transition-colors">${chapter.name}</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400">${chapter.questions} PYQs Available</p>
                    </div>
                </div>
                <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
            </div>
            
            <div class="space-y-2 mb-4">
                ${chapter.topics.slice(0, 3).map(topic => `
                    <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span class="size-1.5 rounded-full bg-primary"></span>
                        ${topic}
                    </div>
                `).join('')}
            </div>
            
            <button onclick="startPractice('${selectedSubject}', '${chapter.name}')" 
                class="w-full py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                Start Practice
                <span class="material-symbols-outlined text-lg">play_arrow</span>
            </button>
        `;
        
        chaptersList.appendChild(card);
    });
}

// Back to subjects
function backToSubjects() {
    document.getElementById('chapterSelection').classList.add('hidden');
    document.getElementById('subjectSelection').classList.remove('hidden');
    selectedSubject = '';
}

// Filter by year
function filterByYear(year) {
    selectedYear = year;
    
    // Update button styles
    document.querySelectorAll('.year-filter').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-slate-100', 'dark:bg-[#283039]', 'text-slate-600', 'dark:text-slate-400');
    });
    
    event.target.classList.remove('bg-slate-100', 'dark:bg-[#283039]', 'text-slate-600', 'dark:text-slate-400');
    event.target.classList.add('bg-primary', 'text-white');
    
    console.log('Filtering by year:', year);
    // In production, this would filter questions by year
}

// Start practice
function startPractice(subject, chapter) {
    // Store practice session info
    localStorage.setItem('practiceSubject', subject);
    localStorage.setItem('practiceChapter', chapter);
    localStorage.setItem('practiceMode', 'chapter');
    
    console.log(`Starting practice: ${subject} - ${chapter}`);
    
    // Redirect to mock test page
    // In production, you'd pass subject and chapter as query params
    window.location.href = `mock-test.html?subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}`;
}

console.log('✅ Practice page loaded');