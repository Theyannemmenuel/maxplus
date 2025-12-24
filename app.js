// ==================== USER DATA ====================
let userData = {
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    goal: ''
};

// ==================== WORKOUT DATA ====================
const workoutExercises = [
    {
        name: 'Squats',
        video: 'videos/squats.mp4',
        duration: 30,
        sets: 3,
        intensity: 'modérée',
        description: 'Gardez le dos droit et descendez jusqu\'à ce que vos cuisses soient parallèles au sol.'
    },
    {
        name: 'Pompes',
        video: 'videos/pompes.mp4',
        duration: 30,
        sets: 3,
        intensity: 'élevée',
        description: 'Gardez le corps aligné et descendez jusqu\'à ce que la poitrine touche presque le sol.'
    }
];

let currentExerciseIndex = 0;
let currentSet = 1;
let timeRemaining = 30;
let restTime = 15;
let isPlaying = false;
let isResting = false;
let totalCalories = 0;
let totalElapsedTime = 0;
let timer;
let videoElement;

// ==================== INITIALIZATION ====================
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('maxtraining_user');
    if (savedUser) {
        userData = JSON.parse(savedUser);
    }
    initCalendar();
});

// Show splash screen then welcome screen
setTimeout(() => {
    showScreen('welcome');
}, 2000);

// ==================== SCREEN NAVIGATION ====================
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    // Auto-transition from member-area to home
    if (screenId === 'member-area') {
        setTimeout(() => {
            showScreen('home');
        }, 2000);
    }
    
    // Initialize workout when entering workout screen
    if (screenId === 'workout-session') {
        initWorkout();
    }
    
    // Stop workout when leaving
    if (screenId !== 'workout-session') {
        stopWorkout();
    }
}

// ==================== CALENDAR ====================
const monthNamesShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthNamesFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

let calendarCurrentDate = new Date();
let selectedCalendarDate = new Date();

function initCalendar() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const prevBtn = document.getElementById('prevMonthBtn');
    const nextBtn = document.getElementById('nextMonthBtn');

    if (!monthSelect || !yearSelect || !prevBtn || !nextBtn) return;

    monthSelect.innerHTML = '';
    monthNamesShort.forEach((name, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = name;
        monthSelect.appendChild(option);
    });

    yearSelect.innerHTML = '';
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 1; y <= currentYear + 2; y++) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }

    monthSelect.value = calendarCurrentDate.getMonth();
    yearSelect.value = calendarCurrentDate.getFullYear();

    monthSelect.addEventListener('change', () => {
        calendarCurrentDate.setMonth(parseInt(monthSelect.value, 10));
        renderCalendar();
    });

    yearSelect.addEventListener('change', () => {
        calendarCurrentDate.setFullYear(parseInt(yearSelect.value, 10));
        renderCalendar();
    });

    prevBtn.addEventListener('click', () => {
        calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
        monthSelect.value = calendarCurrentDate.getMonth();
        yearSelect.value = calendarCurrentDate.getFullYear();
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
        monthSelect.value = calendarCurrentDate.getMonth();
        yearSelect.value = calendarCurrentDate.getFullYear();
        renderCalendar();
    });

    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const todayLabel = document.getElementById('calendarToday');
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');

    if (!grid || !todayLabel || !monthSelect || !yearSelect) return;

    const year = parseInt(yearSelect.value, 10);
    const month = parseInt(monthSelect.value, 10);

    grid.innerHTML = '';

    const dayLabels = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
    dayLabels.forEach(label => {
        const div = document.createElement('div');
        div.className = 'calendar-day-label';
        div.textContent = label;
        grid.appendChild(div);
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();

    let startIndex = firstDay.getDay() - 1;
    if (startIndex < 0) startIndex = 6;

    for (let i = 0; i < startIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        grid.appendChild(emptyCell);
    }

    const today = new Date();

    for (let day = 1; day <= lastDay; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        cell.textContent = day;

        const cellDate = new Date(year, month, day);

        if (
            cellDate.getFullYear() === today.getFullYear() &&
            cellDate.getMonth() === today.getMonth() &&
            cellDate.getDate() === today.getDate()
        ) {
            cell.classList.add('today');
        }

        if (
            cellDate.getFullYear() === selectedCalendarDate.getFullYear() &&
            cellDate.getMonth() === selectedCalendarDate.getMonth() &&
            cellDate.getDate() === selectedCalendarDate.getDate()
        ) {
            cell.classList.add('selected');
        }

        cell.addEventListener('click', () => selectDay(cell, cellDate));
        grid.appendChild(cell);
    }

    todayLabel.textContent = `Aujourd'hui, ${today.getDate()} ${monthNamesFull[today.getMonth()]} ${today.getFullYear()}`;
}

function selectDay(dayElement, dateObj) {
    const days = document.querySelectorAll('.calendar-day');
    days.forEach(day => {
        day.classList.remove('selected');
    });
    if (!dayElement.classList.contains('empty')) {
        dayElement.classList.add('selected');
        selectedCalendarDate = dateObj;
    }
}

// ==================== SIGNUP ====================
function proceedToProfile() {
    userData.lastName = document.getElementById('lastName').value;
    userData.firstName = document.getElementById('firstName').value;
    userData.email = document.getElementById('email').value;
    userData.password = document.getElementById('password').value;
    
    if (!userData.lastName || !userData.firstName || !userData.email || !userData.password) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        alert('Veuillez entrer une adresse email valide');
        return;
    }
    
    if (userData.password.length < 6) {
        alert('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    showScreen('signup-profile');
}

function completeSignup() {
    userData.height = document.getElementById('height').value;
    userData.weight = document.getElementById('weight').value;
    userData.age = document.getElementById('age').value;
    userData.gender = document.getElementById('gender').value;
    
    const selectedGoal = document.querySelector('input[name="goal"]:checked');
    if (selectedGoal) {
        userData.goal = selectedGoal.value;
    }
    
    if (!userData.height || !userData.weight || !userData.age || !userData.gender || !userData.goal) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    if (userData.age < 13 || userData.age > 120) {
        alert('Veuillez entrer un âge valide');
        return;
    }
    
    if (userData.height < 100 || userData.height > 250) {
        alert('Veuillez entrer une taille valide (100-250 cm)');
        return;
    }
    
    if (userData.weight < 30 || userData.weight > 300) {
        alert('Veuillez entrer un poids valide (30-300 kg)');
        return;
    }
    
    console.log('User registered:', userData);
    localStorage.setItem('maxtraining_user', JSON.stringify(userData));
    
    showScreen('member-area');
}

// ==================== WORKOUT SESSION ====================
function initWorkout() {
    currentExerciseIndex = 0;
    currentSet = 1;
    totalCalories = 0;
    totalElapsedTime = 0;
    isPlaying = false;
    isResting = false;
    
    videoElement = document.getElementById('workoutVideo');
    
    loadExercise();
    updateDisplay();
}

function loadExercise() {
    const exercise = workoutExercises[currentExerciseIndex];
    timeRemaining = exercise.duration;
    
    // Update UI
    document.getElementById('exerciseName').textContent = exercise.name;
    document.getElementById('exerciseDetails').textContent = 
        `${exercise.duration} secondes • Intensité ${exercise.intensity}`;
    document.getElementById('currentExercise').textContent = currentExerciseIndex + 1;
    
    // Update video source
    if (videoElement) {
        videoElement.src = exercise.video;
        videoElement.load();
    }
    
    updateDisplay();
    updateProgress();
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    const btn = document.getElementById('playPauseBtn');
    const icon = btn.querySelector('i');
    
    if (isPlaying) {
        icon.className = 'fas fa-pause';
        startTimer();
        if (videoElement) videoElement.play();
    } else {
        icon.className = 'fas fa-play';
        stopTimer();
        if (videoElement) videoElement.pause();
    }
}

function startTimer() {
    timer = setInterval(() => {
        if (isResting) {
            restTime--;
            document.getElementById('restTimer').textContent = restTime;
            
            if (restTime <= 0) {
                endRest();
            }
        } else {
            timeRemaining--;
            totalElapsedTime++;
            
            totalCalories += 0.15;
            document.getElementById('calories').textContent = Math.floor(totalCalories);
            
            updateDisplay();
            updateProgress();
            
            if (timeRemaining <= 0) {
                endSet();
            }
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function stopWorkout() {
    stopTimer();
    isPlaying = false;
    if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('mainTimer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('currentSet').textContent = currentSet;
}

function updateProgress() {
    const totalSets = workoutExercises.reduce((sum, ex) => sum + ex.sets, 0);
    const completedSets = workoutExercises.slice(0, currentExerciseIndex).reduce((sum, ex) => sum + ex.sets, 0) + (currentSet - 1);
    const progress = (completedSets / totalSets) * 100;
    
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressPercent').textContent = Math.floor(progress) + '%';
}

function endSet() {
    const currentExercise = workoutExercises[currentExerciseIndex];
    
    if (currentSet < currentExercise.sets) {
        currentSet++;
        startRest();
    } else {
        currentExerciseIndex++;
        currentSet = 1;
        
        if (currentExerciseIndex < workoutExercises.length) {
            startRest();
        } else {
            completeWorkout();
        }
    }
}

function startRest() {
    isResting = true;
    restTime = 15;
    document.getElementById('restScreen').classList.add('active');
    
    if (videoElement) videoElement.pause();
    
    if (currentExerciseIndex < workoutExercises.length) {
        document.getElementById('nextExerciseName').textContent = workoutExercises[currentExerciseIndex].name;
    } else if (currentSet <= workoutExercises[currentExerciseIndex - 1].sets) {
        document.getElementById('nextExerciseName').textContent = workoutExercises[currentExerciseIndex - 1].name;
    }
}

function endRest() {
    isResting = false;
    document.getElementById('restScreen').classList.remove('active');
    
    if (currentExerciseIndex < workoutExercises.length) {
        loadExercise();
        if (isPlaying && videoElement) videoElement.play();
    }
}

function skipRest() {
    stopTimer();
    endRest();
    if (isPlaying) {
        startTimer();
    }
}

function skipExercise() {
    stopTimer();
    currentExerciseIndex++;
    currentSet = 1;
    
    if (currentExerciseIndex < workoutExercises.length) {
        loadExercise();
        updateProgress();
        if (isPlaying) {
            startTimer();
            if (videoElement) videoElement.play();
        }
    } else {
        completeWorkout();
    }
}

function completeWorkout() {
    stopTimer();
    isPlaying = false;
    if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
    }
    
    const minutes = Math.floor(totalElapsedTime / 60);
    const seconds = totalElapsedTime % 60;
    document.getElementById('totalTime').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('totalCalories').textContent = Math.floor(totalCalories);
    document.getElementById('exercisesCompleted').textContent = workoutExercises.length;
    document.getElementById('setsCompleted').textContent = 
        workoutExercises.reduce((sum, ex) => sum + ex.sets, 0);
    
    document.getElementById('completedScreen').classList.add('active');
}

function confirmExit() {
    if (confirm('Voulez-vous vraiment quitter la séance ?')) {
        showScreen('home');
    }
}

function finishWorkout() {
    document.getElementById('completedScreen').classList.remove('active');
    showScreen('home');
}