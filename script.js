/**
 * FitCoach - Personal Fitness Tracker
 * Vanilla JS with localStorage persistence
 */

(function() {
  'use strict';

  // ============================================
  // EXERCISES DATA
  // ============================================
  const exercises = [
    {
      id: 'push-ups',
      name: 'Push-Ups',
      description: 'Classic upper body exercise targeting chest, shoulders, and triceps.',
      focus: 'upper',
      difficulty: 'beginner',
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop',
      demoTips: ['Keep your core tight', 'Lower until chest nearly touches floor', 'Exhale as you push up'],
      defaultSets: 3,
      defaultReps: 10
    },
    {
      id: 'squats',
      name: 'Squats',
      description: 'Fundamental lower body exercise for quads, glutes, and hamstrings.',
      focus: 'lower',
      difficulty: 'beginner',
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop',
      demoTips: ['Keep knees over toes', 'Go as low as comfortable', 'Drive through your heels'],
      defaultSets: 3,
      defaultReps: 15
    },
    {
      id: 'plank',
      name: 'Plank',
      description: 'Core stability exercise that strengthens the entire midsection.',
      focus: 'core',
      difficulty: 'beginner',
      imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&h=300&fit=crop',
      demoTips: ['Keep body in straight line', 'Engage your core', 'Breathe steadily'],
      defaultSets: 3,
      defaultReps: 30
    },
    {
      id: 'lunges',
      name: 'Lunges',
      description: 'Unilateral leg exercise improving balance and lower body strength.',
      focus: 'lower',
      difficulty: 'beginner',
      imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=300&fit=crop',
      demoTips: ['Keep front knee at 90 degrees', 'Step forward with control', 'Alternate legs'],
      defaultSets: 3,
      defaultReps: 12
    },
    {
      id: 'burpees',
      name: 'Burpees',
      description: 'High-intensity full body exercise combining squat, plank, and jump.',
      focus: 'full',
      difficulty: 'intermediate',
      imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&h=300&fit=crop',
      demoTips: ['Explode up from the squat', 'Land softly', 'Keep a steady rhythm'],
      defaultSets: 3,
      defaultReps: 8
    },
    {
      id: 'mountain-climbers',
      name: 'Mountain Climbers',
      description: 'Dynamic core and cardio exercise performed in plank position.',
      focus: 'core',
      difficulty: 'intermediate',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
      demoTips: ['Keep hips level', 'Drive knees to chest', 'Move quickly but controlled'],
      defaultSets: 3,
      defaultReps: 20
    },
    {
      id: 'dips',
      name: 'Tricep Dips',
      description: 'Upper body exercise targeting triceps using a chair or bench.',
      focus: 'upper',
      difficulty: 'intermediate',
      imageUrl: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=400&h=300&fit=crop',
      demoTips: ['Keep elbows close to body', 'Lower until arms at 90 degrees', 'Press through palms'],
      defaultSets: 3,
      defaultReps: 10
    },
    {
      id: 'glute-bridges',
      name: 'Glute Bridges',
      description: 'Isolation exercise for glutes and hamstrings performed on the floor.',
      focus: 'lower',
      difficulty: 'beginner',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      demoTips: ['Squeeze glutes at the top', 'Keep core engaged', 'Feet flat on floor'],
      defaultSets: 3,
      defaultReps: 15
    },
    {
      id: 'bicycle-crunches',
      name: 'Bicycle Crunches',
      description: 'Dynamic ab exercise targeting obliques and rectus abdominis.',
      focus: 'core',
      difficulty: 'beginner',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      demoTips: ['Touch elbow to opposite knee', 'Keep lower back pressed down', 'Control the motion'],
      defaultSets: 3,
      defaultReps: 20
    },
    {
      id: 'jumping-jacks',
      name: 'Jumping Jacks',
      description: 'Classic cardio warm-up exercise that elevates heart rate.',
      focus: 'full',
      difficulty: 'beginner',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
      demoTips: ['Land softly on feet', 'Keep arms straight', 'Maintain steady pace'],
      defaultSets: 3,
      defaultReps: 25
    },
    {
      id: 'pike-push-ups',
      name: 'Pike Push-Ups',
      description: 'Advanced push-up variation targeting shoulders and upper chest.',
      focus: 'upper',
      difficulty: 'advanced',
      imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=300&fit=crop',
      demoTips: ['Form an inverted V shape', 'Lower head toward floor', 'Push through shoulders'],
      defaultSets: 3,
      defaultReps: 8
    },
    {
      id: 'pistol-squats',
      name: 'Pistol Squats',
      description: 'Single-leg squat requiring strength, balance, and flexibility.',
      focus: 'lower',
      difficulty: 'advanced',
      imageUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=400&h=300&fit=crop',
      demoTips: ['Extend one leg forward', 'Descend slowly with control', 'Use wall for support if needed'],
      defaultSets: 3,
      defaultReps: 5
    }
  ];

  // ============================================
  // STARTER ROUTINES
  // ============================================
  const routines = [
    {
      id: 'full-body',
      name: 'Full Body Blast',
      description: 'Complete workout hitting all major muscle groups',
      exercises: ['jumping-jacks', 'squats', 'push-ups', 'lunges', 'plank', 'burpees']
    },
    {
      id: 'upper-body',
      name: 'Upper Body Focus',
      description: 'Strengthen your chest, shoulders, and arms',
      exercises: ['push-ups', 'dips', 'pike-push-ups', 'plank', 'mountain-climbers']
    },
    {
      id: 'lower-body',
      name: 'Lower Body Burner',
      description: 'Build leg strength and power',
      exercises: ['squats', 'lunges', 'glute-bridges', 'jumping-jacks']
    },
    {
      id: 'core-crusher',
      name: 'Core Crusher',
      description: 'Intense core workout for abs and stability',
      exercises: ['plank', 'bicycle-crunches', 'mountain-climbers', 'glute-bridges']
    },
    {
      id: 'quick-hiit',
      name: 'Quick HIIT',
      description: '15-minute high intensity session',
      exercises: ['burpees', 'mountain-climbers', 'jumping-jacks', 'squats']
    }
  ];

  // ============================================
  // MOTIVATIONAL MESSAGES
  // ============================================
  const motivationalMessages = [
    "You're doing amazing! 💪",
    "Keep pushing, champion! 🔥",
    "Every rep counts! 🎯",
    "Stronger every day! 💥",
    "You've got this! 🚀",
    "Crushing it! 🏆",
    "No stopping you now! ⚡",
    "Beast mode activated! 🦁",
    "Progress over perfection! 📈",
    "One more rep! 💯"
  ];

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const STORAGE_KEY = 'fitcoach_state_v1';

  const defaultState = {
    activeRoutine: null,
    completedSets: {},
    streak: 0,
    lastWorkoutDate: null,
    history: [],
    notes: {},
    currentFilter: 'all',
    workoutPlan: [],
    tipsIndex: 0
  };

  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    return { ...defaultState };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }

  function updateState(updates) {
    state = { ...state, ...updates };
    saveState();
    render();
  }

  // ============================================
  // STREAK CALCULATION
  // ============================================
  function calculateStreak() {
    if (!state.lastWorkoutDate) return 0;
    
    const lastDate = new Date(state.lastWorkoutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) return 0;
    return state.streak;
  }

  function updateStreak() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (state.lastWorkoutDate) {
      const lastDate = new Date(state.lastWorkoutDate);
      lastDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return state.streak;
      } else if (diffDays === 1) {
        return state.streak + 1;
      }
    }
    return 1;
  }

  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
      <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
    });
    
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ============================================
  // TIPS CAROUSEL
  // ============================================
  const allTips = [
    "Stay hydrated! Drink water before, during, and after your workout.",
    "Focus on form over speed to prevent injuries.",
    "Rest days are essential for muscle recovery.",
    "Set realistic goals and celebrate small wins.",
    "Warm up before and cool down after every session.",
    "Consistency beats intensity - show up every day!",
    "Listen to your body and don't push through pain.",
    "Track your progress to stay motivated.",
    "Mix up your routine to avoid plateaus.",
    "Sleep 7-9 hours for optimal recovery."
  ];

  let tipsInterval = null;

  function startTipsCarousel() {
    const tipsElement = document.getElementById('tips-carousel');
    if (!tipsElement) return;
    
    function updateTip() {
      state.tipsIndex = (state.tipsIndex + 1) % allTips.length;
      tipsElement.style.opacity = '0';
      setTimeout(() => {
        tipsElement.textContent = allTips[state.tipsIndex];
        tipsElement.style.opacity = '1';
      }, 300);
    }
    
    tipsElement.textContent = allTips[state.tipsIndex];
    if (tipsInterval) clearInterval(tipsInterval);
    tipsInterval = setInterval(updateTip, 5000);
  }

  // ============================================
  // RENDER FUNCTIONS
  // ============================================
  function getExerciseById(id) {
    return exercises.find(e => e.id === id);
  }

  function getRandomMotivation() {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  }

  function renderExerciseCard(exercise) {
    const inPlan = state.workoutPlan.some(p => p.exerciseId === exercise.id);
    
    return `
      <article class="exercise-card" data-exercise-id="${exercise.id}" data-focus="${exercise.focus}" tabindex="0">
        <div class="exercise-image">
          <img src="${exercise.imageUrl}" alt="${exercise.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(exercise.name)}'">
          <span class="difficulty-badge difficulty-${exercise.difficulty}">${exercise.difficulty}</span>
        </div>
        <div class="exercise-content">
          <h3 class="exercise-name">${exercise.name}</h3>
          <p class="exercise-description">${exercise.description}</p>
          <div class="exercise-meta">
            <span class="focus-tag focus-${exercise.focus}">${exercise.focus}</span>
            <span class="sets-reps">${exercise.defaultSets} sets × ${exercise.defaultReps} reps</span>
          </div>
          <div class="exercise-tips">
            <strong>Tips:</strong>
            <ul>
              ${exercise.demoTips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
          <button class="btn btn-add-plan ${inPlan ? 'in-plan' : ''}" 
                  data-action="add-to-plan" 
                  data-exercise-id="${exercise.id}"
                  aria-pressed="${inPlan}">
            ${inPlan ? '✓ In Plan' : '+ Add to Plan'}
          </button>
        </div>
      </article>
    `;
  }

  function renderExerciseGrid() {
    const container = document.getElementById('exercise-grid');
    if (!container) return;
    
    const filter = state.currentFilter;
    const filteredExercises = filter === 'all' 
      ? exercises 
      : exercises.filter(e => e.focus === filter);
    
    container.innerHTML = filteredExercises.map(renderExerciseCard).join('');
  }

  function renderRoutineCards() {
    const container = document.getElementById('routine-cards');
    if (!container) return;
    
    container.innerHTML = routines.map(routine => `
      <div class="routine-card ${state.activeRoutine === routine.id ? 'active' : ''}" 
           data-routine-id="${routine.id}" tabindex="0">
        <h4>${routine.name}</h4>
        <p>${routine.description}</p>
        <span class="exercise-count">${routine.exercises.length} exercises</span>
        <button class="btn btn-start-routine" data-action="start-routine" data-routine-id="${routine.id}">
          ${state.activeRoutine === routine.id ? 'Active' : 'Start'}
        </button>
      </div>
    `).join('');
  }

  function renderWorkoutPlan() {
    const container = document.getElementById('workout-plan');
    const emptyState = document.getElementById('plan-empty-state');
    const controls = document.getElementById('workout-controls');
    
    if (!container) return;
    
    if (state.workoutPlan.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (controls) controls.style.display = 'none';
      return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    if (controls) controls.style.display = 'flex';
    
    const totalSets = state.workoutPlan.reduce((sum, p) => sum + p.targetSets, 0);
    const completedSets = state.workoutPlan.reduce((sum, p) => sum + (state.completedSets[p.exerciseId] || 0), 0);
    const progress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
    
    container.innerHTML = `
      <div class="workout-progress">
        <div class="progress-header">
          <span>Workout Progress</span>
          <span class="progress-text">${completedSets}/${totalSets} sets</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <p class="motivation-text">${progress >= 100 ? '🎉 Workout Complete!' : getRandomMotivation()}</p>
      </div>
      <ul class="plan-list">
        ${state.workoutPlan.map(planItem => {
          const exercise = getExerciseById(planItem.exerciseId);
          if (!exercise) return '';
          
          const completed = state.completedSets[planItem.exerciseId] || 0;
          const itemProgress = Math.round((completed / planItem.targetSets) * 100);
          const isComplete = completed >= planItem.targetSets;
          
          return `
            <li class="plan-item ${isComplete ? 'complete' : ''}" data-exercise-id="${planItem.exerciseId}">
              <div class="plan-item-header">
                <span class="plan-exercise-name">${exercise.name}</span>
                <button class="btn-remove" data-action="remove-from-plan" data-exercise-id="${planItem.exerciseId}" 
                        aria-label="Remove ${exercise.name} from plan">×</button>
              </div>
              <div class="plan-item-progress">
                <div class="mini-progress-bar">
                  <div class="mini-progress-fill" style="width: ${itemProgress}%"></div>
                </div>
                <span class="set-counter">${completed}/${planItem.targetSets} sets</span>
              </div>
              <div class="set-controls">
                <button class="btn btn-set btn-undo" 
                        data-action="undo-set" 
                        data-exercise-id="${planItem.exerciseId}"
                        ${completed === 0 ? 'disabled' : ''}
                        aria-label="Undo set for ${exercise.name}">
                  − Undo
                </button>
                <button class="btn btn-set btn-complete" 
                        data-action="complete-set" 
                        data-exercise-id="${planItem.exerciseId}"
                        ${isComplete ? 'disabled' : ''}
                        aria-label="Complete set for ${exercise.name}">
                  + Complete Set
                </button>
              </div>
            </li>
          `;
        }).join('')}
      </ul>
    `;
  }

  function renderHistory() {
    const container = document.getElementById('history-list');
    if (!container) return;
    
    if (state.history.length === 0) {
      container.innerHTML = '<p class="empty-history">No workout history yet. Complete your first workout!</p>';
      return;
    }
    
    const sortedHistory = [...state.history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    container.innerHTML = sortedHistory.map(entry => {
      const date = new Date(entry.timestamp);
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return `
        <div class="history-entry" data-history-id="${entry.id}">
          <div class="history-header">
            <span class="history-date">${formattedDate}</span>
            <span class="history-sets">${entry.totalSets} sets completed</span>
          </div>
          <div class="history-exercises">
            ${entry.exercises.map(e => `<span class="history-exercise-tag">${e.name}: ${e.completed}/${e.target}</span>`).join('')}
          </div>
          ${entry.note ? `<p class="history-note">"${entry.note}"</p>` : ''}
          <button class="btn-delete-history" data-action="delete-history" data-history-id="${entry.id}" 
                  aria-label="Delete this workout entry">🗑️</button>
        </div>
      `;
    }).join('');
  }

  function renderStreakIndicator() {
    const container = document.getElementById('streak-indicator');
    if (!container) return;
    
    const currentStreak = calculateStreak();
    container.innerHTML = `
      <div class="streak-display">
        <span class="streak-flame">🔥</span>
        <span class="streak-count">${currentStreak}</span>
        <span class="streak-label">day streak</span>
      </div>
    `;
  }

  function renderStats() {
    const totalWorkouts = state.history.length;
    const totalSets = state.history.reduce((sum, h) => sum + h.totalSets, 0);
    const currentStreak = calculateStreak();
    
    const statsContainer = document.getElementById('stats-summary');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-card">
          <span class="stat-value">${totalWorkouts}</span>
          <span class="stat-label">Workouts</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${totalSets}</span>
          <span class="stat-label">Total Sets</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${currentStreak}</span>
          <span class="stat-label">Day Streak</span>
        </div>
      `;
    }
  }

  function render() {
    renderExerciseGrid();
    renderRoutineCards();
    renderWorkoutPlan();
    renderHistory();
    renderStreakIndicator();
    renderStats();
    updateFilterButtons();
  }

  function updateFilterButtons() {
    const buttons = document.querySelectorAll('[data-filter]');
    buttons.forEach(btn => {
      const isActive = btn.dataset.filter === state.currentFilter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================
  function handleAddToPlan(exerciseId) {
    const exercise = getExerciseById(exerciseId);
    if (!exercise) return;
    
    const exists = state.workoutPlan.some(p => p.exerciseId === exerciseId);
    if (exists) {
      showToast(`${exercise.name} is already in your plan`, 'info');
      return;
    }
    
    const newPlan = [...state.workoutPlan, {
      exerciseId: exercise.id,
      targetSets: exercise.defaultSets,
      targetReps: exercise.defaultReps
    }];
    
    updateState({ 
      workoutPlan: newPlan,
      completedSets: { ...state.completedSets, [exerciseId]: 0 }
    });
    
    showToast(`${exercise.name} added to plan! 💪`);
  }

  function handleRemoveFromPlan(exerciseId) {
    const exercise = getExerciseById(exerciseId);
    const newPlan = state.workoutPlan.filter(p => p.exerciseId !== exerciseId);
    const newCompleted = { ...state.completedSets };
    delete newCompleted[exerciseId];
    
    updateState({ 
      workoutPlan: newPlan,
      completedSets: newCompleted
    });
    
    if (exercise) {
      showToast(`${exercise.name} removed from plan`);
    }
  }

  function handleCompleteSet(exerciseId) {
    const exercise = getExerciseById(exerciseId);
    const planItem = state.workoutPlan.find(p => p.exerciseId === exerciseId);
    if (!planItem) return;
    
    const current = state.completedSets[exerciseId] || 0;
    if (current >= planItem.targetSets) return;
    
    const newCompleted = { ...state.completedSets, [exerciseId]: current + 1 };
    updateState({ completedSets: newCompleted });
    
    const newCount = current + 1;
    if (newCount === planItem.targetSets) {
      showToast(`${exercise.name} complete! 🎉`);
    } else {
      showToast(`Set ${newCount}/${planItem.targetSets} done!`);
    }
  }

  function handleUndoSet(exerciseId) {
    const current = state.completedSets[exerciseId] || 0;
    if (current === 0) return;
    
    const newCompleted = { ...state.completedSets, [exerciseId]: current - 1 };
    updateState({ completedSets: newCompleted });
    showToast('Set undone');
  }

  function handleStartRoutine(routineId) {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;
    
    const newPlan = routine.exercises.map(exId => {
      const exercise = getExerciseById(exId);
      return exercise ? {
        exerciseId: exercise.id,
        targetSets: exercise.defaultSets,
        targetReps: exercise.defaultReps
      } : null;
    }).filter(Boolean);
    
    const newCompleted = {};
    newPlan.forEach(p => { newCompleted[p.exerciseId] = 0; });
    
    updateState({
      activeRoutine: routineId,
      workoutPlan: newPlan,
      completedSets: newCompleted
    });
    
    showToast(`${routine.name} loaded! Let's go! 🚀`);
  }

  function handleFinishWorkout() {
    const noteInput = document.getElementById('workout-note');
    const note = noteInput ? noteInput.value.trim() : '';
    
    const totalCompleted = Object.values(state.completedSets).reduce((a, b) => a + b, 0);
    
    if (totalCompleted === 0) {
      showToast('Complete at least one set first!', 'error');
      return;
    }
    
    const exerciseSummary = state.workoutPlan.map(p => {
      const exercise = getExerciseById(p.exerciseId);
      return {
        name: exercise ? exercise.name : 'Unknown',
        completed: state.completedSets[p.exerciseId] || 0,
        target: p.targetSets
      };
    });
    
    const historyEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      totalSets: totalCompleted,
      exercises: exerciseSummary,
      note: note || null
    };
    
    const newStreak = updateStreak();
    
    updateState({
      history: [...state.history, historyEntry],
      streak: newStreak,
      lastWorkoutDate: new Date().toISOString(),
      workoutPlan: [],
      completedSets: {},
      activeRoutine: null
    });
    
    if (noteInput) noteInput.value = '';
    
    showToast(`Workout saved! ${newStreak} day streak! 🔥`);
  }

  function handleClearPlan() {
    if (state.workoutPlan.length === 0) return;
    
    updateState({
      workoutPlan: [],
      completedSets: {},
      activeRoutine: null
    });
    
    showToast('Workout plan cleared');
  }

  function handleClearHistory() {
    if (state.history.length === 0) return;
    
    if (confirm('Are you sure you want to clear all workout history? This cannot be undone.')) {
      updateState({ history: [], streak: 0, lastWorkoutDate: null });
      showToast('History cleared');
    }
  }

  function handleDeleteHistoryEntry(historyId) {
    const newHistory = state.history.filter(h => h.id !== historyId);
    updateState({ history: newHistory });
    showToast('Entry deleted');
  }

  function handleFilter(focus) {
    updateState({ currentFilter: focus });
  }

  // ============================================
  // KEYBOARD ACCESSIBILITY
  // ============================================
  function handleKeyboard(e) {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal.open');
      modals.forEach(modal => modal.classList.remove('open'));
    }
    
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target;
      if (target.classList.contains('exercise-card') || target.classList.contains('routine-card')) {
        e.preventDefault();
        const btn = target.querySelector('button');
        if (btn) btn.click();
      }
    }
  }

  // ============================================
  // EVENT DELEGATION
  // ============================================
  function handleClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    const exerciseId = target.dataset.exerciseId;
    const routineId = target.dataset.routineId;
    const historyId = target.dataset.historyId;
    
    switch (action) {
      case 'add-to-plan':
        handleAddToPlan(exerciseId);
        break;
      case 'remove-from-plan':
        handleRemoveFromPlan(exerciseId);
        break;
      case 'complete-set':
        handleCompleteSet(exerciseId);
        break;
      case 'undo-set':
        handleUndoSet(exerciseId);
        break;
      case 'start-routine':
        handleStartRoutine(routineId);
        break;
      case 'finish-workout':
        handleFinishWorkout();
        break;
      case 'clear-plan':
        handleClearPlan();
        break;
      case 'clear-history':
        handleClearHistory();
        break;
      case 'delete-history':
        handleDeleteHistoryEntry(historyId);
        break;
    }
  }

  function handleFilterClick(e) {
    const target = e.target.closest('[data-filter]');
    if (target) {
      handleFilter(target.dataset.filter);
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Create main app structure if it doesn't exist
    const appContainer = document.getElementById('app') || document.body;
    
    if (!document.getElementById('fitcoach-app')) {
      appContainer.innerHTML = generateAppHTML();
    }
    
    // Attach event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('click', handleFilterClick);
    document.addEventListener('keydown', handleKeyboard);
    
    // Initial render
    render();
    startTipsCarousel();
    
    console.log('FitCoach initialized! 💪');
  }

  function generateAppHTML() {
    return `
      <div id="fitcoach-app">
        <div id="toast-container" aria-live="polite"></div>
        
        <header class="app-header">
          <div class="container">
            <div class="header-content">
              <h1 class="app-title">
                <span class="title-icon">💪</span>
                FitCoach
              </h1>
              <div id="streak-indicator"></div>
            </div>
            <p class="app-tagline">Your personal workout companion</p>
            <div class="tips-banner">
              <span class="tips-icon">💡</span>
              <span id="tips-carousel" class="tips-text"></span>
            </div>
          </div>
        </header>
        
        <main class="app-main">
          <div class="container">
            <section id="stats-summary" class="stats-section" aria-label="Workout Statistics"></section>
            
            <section class="routines-section">
              <h2 class="section-title">Quick Start Routines</h2>
              <div id="routine-cards" class="routine-grid"></div>
            </section>
            
            <section class="workout-section">
              <div class="workout-header">
                <h2 class="section-title">Your Workout Plan</h2>
                <div id="workout-controls" class="workout-actions" style="display: none;">
                  <input type="text" id="workout-note" class="note-input" placeholder="Add a note about this workout..." maxlength="200">
                  <button class="btn btn-finish" data-action="finish-workout">
                    ✓ Finish Workout
                  </button>
                  <button class="btn btn-clear" data-action="clear-plan">
                    Clear Plan
                  </button>
                </div>
              </div>
              <div id="plan-empty-state" class="empty-state">
                <p>No exercises in your plan yet.</p>
                <p>Browse exercises below or pick a routine to get started!</p>
              </div>
              <div id="workout-plan" class="workout-plan"></div>
            </section>
            
            <section class="exercises-section">
              <div class="exercises-header">
                <h2 class="section-title">Exercise Guide</h2>
                <div class="filter-buttons" role="group" aria-label="Filter exercises by focus">
                  <button class="btn btn-filter active" data-filter="all" aria-pressed="true">All</button>
                  <button class="btn btn-filter" data-filter="upper" aria-pressed="false">Upper Body</button>
                  <button class="btn btn-filter" data-filter="lower" aria-pressed="false">Lower Body</button>
                  <button class="btn btn-filter" data-filter="core" aria-pressed="false">Core</button>
                  <button class="btn btn-filter" data-filter="full" aria-pressed="false">Full Body</button>
                </div>
              </div>
              <div id="exercise-grid" class="exercise-grid"></div>
            </section>
            
            <section class="history-section">
              <div class="history-header">
                <h2 class="section-title">Workout History</h2>
                <button class="btn btn-clear-history" data-action="clear-history">
                  Clear All
                </button>
              </div>
              <div id="history-list" class="history-list"></div>
            </section>
          </div>
        </main>
        
        <footer class="app-footer">
          <div class="container">
            <p>&copy; ${new Date().getFullYear()} FitCoach. Stay strong! 💪</p>
          </div>
        </footer>
      </div>
      
      <style>
        :root {
          --primary: #6366f1;
          --primary-dark: #4f46e5;
          --secondary: #10b981;
          --danger: #ef4444;
          --warning: #f59e0b;
          --bg: #0f172a;
          --bg-card: #1e293b;
          --bg-hover: #334155;
          --text: #f1f5f9;
          --text-muted: #94a3b8;
          --border: #334155;
          --radius: 12px;
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: var(--bg);
          color: var(--text);
          line-height: 1.6;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        /* Header */
        .app-header {
          background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
          padding: 30px 0;
          text-align: center;
        }
        
        .header-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .app-title {
          font-size: 2.5rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .title-icon {
          font-size: 2rem;
        }
        
        .app-tagline {
          opacity: 0.9;
          margin-top: 5px;
        }
        
        .tips-banner {
          background: rgba(255,255,255,0.15);
          padding: 12px 20px;
          border-radius: var(--radius);
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
        }
        
        .tips-text {
          transition: opacity 0.3s ease;
        }
        
        /* Streak */
        .streak-display {
          background: rgba(255,255,255,0.2);
          padding: 8px 16px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }
        
        .streak-flame {
          font-size: 1.2rem;
        }
        
        .streak-count {
          font-size: 1.3rem;
        }
        
        .streak-label {
          font-size: 0.85rem;
          opacity: 0.9;
        }
        
        /* Stats */
        .stats-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin: 30px 0;
        }
        
        .stat-card {
          background: var(--bg-card);
          padding: 20px;
          border-radius: var(--radius);
          text-align: center;
          border: 1px solid var(--border);
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
          display: block;
        }
        
        .stat-label {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        /* Section titles */
        .section-title {
          font-size: 1.5rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        /* Routines */
        .routines-section {
          margin-bottom: 40px;
        }
        
        .routine-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 15px;
        }
        
        .routine-card {
          background: var(--bg-card);
          padding: 20px;
          border-radius: var(--radius);
          border: 2px solid var(--border);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .routine-card:hover, .routine-card:focus {
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        
        .routine-card.active {
          border-color: var(--secondary);
          background: rgba(16, 185, 129, 0.1);
        }
        
        .routine-card h4 {
          font-size: 1.1rem;
          margin-bottom: 8px;
        }
        
        .routine-card p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 10px;
        }
        
        .exercise-count {
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        .btn-start-routine {
          margin-top: 15px;
          width: 100%;
        }
        
        /* Buttons */
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .btn-add-plan {
          background: var(--primary);
          color: white;
          width: 100%;
        }
        
        .btn-add-plan:hover:not(:disabled) {
          background: var(--primary-dark);
        }
        
        .btn-add-plan.in-plan {
          background: var(--secondary);
        }
        
        .btn-finish {
          background: var(--secondary);
          color: white;
        }
        
        .btn-finish:hover {
          background: #059669;
        }
        
        .btn-clear, .btn-clear-history {
          background: transparent;
          color: var(--danger);
          border: 1px solid var(--danger);
        }
        
        .btn-clear:hover, .btn-clear-history:hover {
          background: var(--danger);
          color: white;
        }
        
        .btn-filter {
          background: var(--bg-card);
          color: var(--text);
          border: 1px solid var(--border);
          padding: 8px 16px;
          font-size: 0.85rem;
        }
        
        .btn-filter.active {
          background: var(--primary);
          border-color: var(--primary);
        }
        
        .btn-filter:hover:not(.active) {
          background: var(--bg-hover);
        }
        
        .btn-set {
          padding: 8px 16px;
          font-size: 0.9rem;
        }
        
        .btn-complete {
          background: var(--primary);
          color: white;
        }
        
        .btn-complete:hover:not(:disabled) {
          background: var(--primary-dark);
        }
        
        .btn-undo {
          background: var(--bg-hover);
          color: var(--text);
        }
        
        .btn-undo:hover:not(:disabled) {
          background: var(--border);
        }
        
        .btn-start-routine {
          background: var(--primary);
          color: white;
        }
        
        /* Workout section */
        .workout-section {
          margin-bottom: 40px;
        }
        
        .workout-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .workout-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .note-input {
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 10px 15px;
          border-radius: 8px;
          width: 250px;
          font-size: 0.9rem;
        }
        
        .note-input::placeholder {
          color: var(--text-muted);
        }
        
        .note-input:focus {
          outline: none;
          border-color: var(--primary);
        }
        
        .empty-state {
          background: var(--bg-card);
          padding: 40px;
          border-radius: var(--radius);
          text-align: center;
          color: var(--text-muted);
          border: 2px dashed var(--border);
        }
        
        .empty-state p {
          margin-bottom: 10px;
        }
        
        /* Workout progress */
        .workout-progress {
          background: var(--bg-card);
          padding: 20px;
          border-radius: var(--radius);
          margin-bottom: 20px;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        
        .progress-bar {
          height: 12px;
          background: var(--border);
          border-radius: 6px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          transition: width 0.3s ease;
          border-radius: 6px;
        }
        
        .motivation-text {
          margin-top: 10px;
          text-align: center;
          font-weight: 600;
          color: var(--primary);
        }
        
        /* Plan list */
        .plan-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .plan-item {
          background: var(--bg-card);
          padding: 20px;
          border-radius: var(--radius);
          border-left: 4px solid var(--primary);
          transition: all 0.2s ease;
        }
        
        .plan-item.complete {
          border-left-color: var(--secondary);
          opacity: 0.8;
        }
        
        .plan-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .plan-exercise-name {
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .btn-remove {
          background: transparent;
          border: none;
          color: var(--danger);
          font-size: 1.5rem;
          cursor: pointer;
          line-height: 1;
          padding: 5px;
        }
        
        .btn-remove:hover {
          opacity: 0.7;
        }
        
        .plan-item-progress {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .mini-progress-bar {
          flex: 1;
          height: 8px;
          background: var(--border);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .mini-progress-fill {
          height: 100%;
          background: var(--primary);
          transition: width 0.3s ease;
        }
        
        .plan-item.complete .mini-progress-fill {
          background: var(--secondary);
        }
        
        .set-counter {
          color: var(--text-muted);
          font-size: 0.9rem;
          white-space: nowrap;
        }
        
        .set-controls {
          display: flex;
          gap: 10px;
        }
        
        /* Exercise grid */
        .exercises-section {
          margin-bottom: 40px;
        }
        
        .exercises-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .exercise-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .exercise-card {
          background: var(--bg-card);
          border-radius: var(--radius);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid var(--border);
        }
        
        .exercise-card:hover, .exercise-card:focus {
          transform: translateY(-4px);
          box-shadow: var(--shadow);
          outline: none;
          border-color: var(--primary);
        }
        
        .exercise-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        
        .exercise-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .difficulty-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .difficulty-beginner {
          background: var(--secondary);
          color: white;
        }
        
        .difficulty-intermediate {
          background: var(--warning);
          color: #1a1a1a;
        }
        
        .difficulty-advanced {
          background: var(--danger);
          color: white;
        }
        
        .exercise-content {
          padding: 20px;
        }
        
        .exercise-name {
          font-size: 1.2rem;
          margin-bottom: 8px;
        }
        
        .exercise-description {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 12px;
        }
        
        .exercise-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .focus-tag {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .focus-upper { background: #3b82f6; color: white; }
        .focus-lower { background: #8b5cf6; color: white; }
        .focus-core { background: #ec4899; color: white; }
        .focus-full { background: #f59e0b; color: #1a1a1a; }
        
        .sets-reps {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        
        .exercise-tips {
          background: var(--bg);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 0.85rem;
        }
        
        .exercise-tips strong {
          color: var(--primary);
        }
        
        .exercise-tips ul {
          margin-top: 8px;
          padding-left: 18px;
          color: var(--text-muted);
        }
        
        .exercise-tips li {
          margin-bottom: 4px;
        }
        
        /* History */
        .history-section {
          margin-bottom: 40px;
        }
        
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .empty-history {
          background: var(--bg-card);
          padding: 40px;
          border-radius: var(--radius);
          text-align: center;
          color: var(--text-muted);
        }
        
        .history-entry {
          background: var(--bg-card);
          padding: 20px;
          border-radius: var(--radius);
          position: relative;
        }
        
        .history-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        
        .history-date {
          font-weight: 600;
        }
        
        .history-sets {
          color: var(--secondary);
          font-weight: 500;
        }
        
        .history-exercises {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
        }
        
        .history-exercise-tag {
          background: var(--bg);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
        }
        
        .history-note {
          color: var(--text-muted);
          font-style: italic;
          font-size: 0.9rem;
        }
        
        .btn-delete-history {
          position: absolute;
          top: 15px;
          right: 15px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        
        .btn-delete-history:hover {
          opacity: 1;
        }
        
        /* Toast */
        #toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .toast {
          background: var(--bg-card);
          padding: 15px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          transform: translateX(120%);
          transition: transform 0.3s ease;
          border-left: 4px solid var(--secondary);
        }
        
        .toast-show {
          transform: translateX(0);
        }
        
        .toast-success {
          border-left-color: var(--secondary);
        }
        
        .toast-error {
          border-left-color: var(--danger);
        }
        
        .toast-info {
          border-left-color: var(--primary);
        }
        
        .toast-icon {
          font-size: 1.2rem;
        }
        
        .toast-success .toast-icon { color: var(--secondary); }
        .toast-error .toast-icon { color: var(--danger); }
        .toast-info .toast-icon { color: var(--primary); }
        
        /* Footer */
        .app-footer {
          background: var(--bg-card);
          padding: 30px 0;
          text-align: center;
          color: var(--text-muted);
          border-top: 1px solid var(--border);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .app-title {
            font-size: 1.8rem;
          }
          
          .header-content {
            flex-direction: column;
          }
          
          .workout-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .workout-actions {
            flex-direction: column;
          }
          
          .note-input {
            width: 100%;
          }
          
          .exercises-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .filter-buttons {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 10px;
          }
          
          .exercise-grid {
            grid-template-columns: 1fr;
          }
          
          .routine-grid {
            grid-template-columns: 1fr;
          }
          
          .set-controls {
            flex-direction: column;
          }
          
          .set-controls .btn {
            width: 100%;
          }
        }
        
        /* Focus states for accessibility */
        .btn:focus-visible,
        .exercise-card:focus-visible,
        .routine-card:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      </style>
    `;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
