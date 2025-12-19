// User data storage
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

// Show splash screen then welcome screen
setTimeout(() => {
    showScreen('welcome');
}, 2000);

// Screen navigation
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
}

// Calendar day selection
function selectDay(dayElement) {
    const days = document.querySelectorAll('.calendar-day');
    days.forEach(day => {
        day.classList.remove('selected');
    });
    dayElement.classList.add('selected');
}

// Save step 1 data and move to step 2
function proceedToProfile() {
    // Get form values
    userData.lastName = document.getElementById('lastName').value;
    userData.firstName = document.getElementById('firstName').value;
    userData.email = document.getElementById('email').value;
    userData.password = document.getElementById('password').value;
    
    // Validation
    if (!userData.lastName || !userData.firstName || !userData.email || !userData.password) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        alert('Veuillez entrer une adresse email valide');
        return;
    }
    
    // Password validation (minimum 6 characters)
    if (userData.password.length < 6) {
        alert('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    showScreen('signup-profile');
}

// Complete signup
function completeSignup() {
    // Get profile data
    userData.height = document.getElementById('height').value;
    userData.weight = document.getElementById('weight').value;
    userData.age = document.getElementById('age').value;
    userData.gender = document.getElementById('gender').value;
    
    // Get selected goal
    const selectedGoal = document.querySelector('input[name="goal"]:checked');
    if (selectedGoal) {
        userData.goal = selectedGoal.value;
    }
    
    // Validation
    if (!userData.height || !userData.weight || !userData.age || !userData.gender || !userData.goal) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    // Age validation
    if (userData.age < 13 || userData.age > 120) {
        alert('Veuillez entrer un âge valide');
        return;
    }
    
    // Height validation
    if (userData.height < 100 || userData.height > 250) {
        alert('Veuillez entrer une taille valide (100-250 cm)');
        return;
    }
    
    // Weight validation
    if (userData.weight < 30 || userData.weight > 300) {
        alert('Veuillez entrer un poids valide (30-300 kg)');
        return;
    }
    
    // Save user data (in real app, send to backend)
    console.log('User registered:', userData);
    localStorage.setItem('maxtraining_user', JSON.stringify(userData));
    
    // Show welcome screen
    showScreen('member-area');
}

// Load user data if exists
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('maxtraining_user');
    if (savedUser) {
        userData = JSON.parse(savedUser);
        // You can use this data to personalize the app
    }
});