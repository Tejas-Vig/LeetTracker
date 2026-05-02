/**
 * LeetTracker - Frontend Application Logic
 * Complete CRUD, filtering, searching, and analytics
 */

// API Configuration
const API_BASE = 'http://localhost:8080/api';

// Global State
let allProblems = [];
let filteredProblems = [];
let currentEditId = null;
let allTopics = [];

// DOM Elements
const problemForm = document.getElementById('problemForm');
const problemNameInput = document.getElementById('problemName');
const problemDifficultyInput = document.getElementById('problemDifficulty');
const problemTopicInput = document.getElementById('problemTopic');
const problemStatusInput = document.getElementById('problemStatus');
const problemAttemptsInput = document.getElementById('problemAttempts');
const problemTimeTakenInput = document.getElementById('problemTimeTaken');
const problemNotesInput = document.getElementById('problemNotes');
const submitBtn = document.getElementById('submitBtn');
const resetFormBtn = document.getElementById('resetFormBtn');

const searchInput = document.getElementById('searchInput');
const filterDifficulty = document.getElementById('filterDifficulty');
const filterTopic = document.getElementById('filterTopic');
const filterStatus = document.getElementById('filterStatus');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const sortBy = document.getElementById('sortBy');

const problemsTableBody = document.getElementById('problemsTableBody');
const noProblemsMsg = document.getElementById('noProblemsMsg');

const problemModal = document.getElementById('problemModal');
const modalClose = document.querySelector('.modal-close');

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadProblems();
    setupEventListeners();
    renderProblems();
    updateAnalytics();
});

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Form
    problemForm.addEventListener('submit', handleFormSubmit);
    resetFormBtn.addEventListener('click', resetForm);
    
    // Search & Filter
    searchInput.addEventListener('input', applyFilters);
    filterDifficulty.addEventListener('change', applyFilters);
    filterTopic.addEventListener('change', applyFilters);
    filterStatus.addEventListener('change', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
    sortBy.addEventListener('change', applyFilters);
    
    // Modal
    modalClose.addEventListener('click', closeModal);
    problemModal.addEventListener('click', (e) => {
        if (e.target === problemModal) closeModal();
    });
}

// ============================================
// CRUD Operations
// ============================================

async function loadProblems() {
    try {
        const response = await fetch(`${API_BASE}/problems`);
        allProblems = await response.json();
        filteredProblems = [...allProblems];
        extractTopics();
        updateTopicFilters();
    } catch (error) {
        console.error('Error loading problems:', error);
        showError('Failed to load problems');
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showError('Please fill in all required fields');
        return;
    }
    
    const problemData = {
        name: problemNameInput.value,
        difficulty: problemDifficultyInput.value,
        topic: problemTopicInput.value,
        status: problemStatusInput.value,
        notes: problemNotesInput.value,
        attempts: parseInt(problemAttemptsInput.value) || 0,
        timeTaken: parseInt(problemTimeTakenInput.value) || 0
    };
    
    try {
        let response;
        
        if (currentEditId) {
            // Update existing problem
            response = await fetch(`${API_BASE}/problems?id=${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(problemData)
            });
            showSuccess('Problem updated successfully! ✨');
        } else {
            // Create new problem
            response = await fetch(`${API_BASE}/problems`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(problemData)
            });
            showSuccess('Problem added successfully! 🚀');
        }
        
        if (response.ok) {
            resetForm();
            currentEditId = null;
            submitBtn.textContent = 'Add Problem';
            await loadProblems();
            renderProblems();
            updateAnalytics();
        }
    } catch (error) {
        console.error('Error saving problem:', error);
        showError('Failed to save problem');
    }
}

async function deleteProblem(id) {
    if (confirm('Are you sure you want to delete this problem?')) {
        try {
            const response = await fetch(`${API_BASE}/problems?id=${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showSuccess('Problem deleted successfully!');
                await loadProblems();
                renderProblems();
                updateAnalytics();
            }
        } catch (error) {
            console.error('Error deleting problem:', error);
            showError('Failed to delete problem');
        }
    }
}

function editProblem(id) {
    const problem = allProblems.find(p => p.id === id);
    
    if (problem) {
        problemNameInput.value = problem.name;
        problemDifficultyInput.value = problem.difficulty;
        problemTopicInput.value = problem.topic;
        problemStatusInput.value = problem.status;
        problemAttemptsInput.value = problem.attempts;
        problemTimeTakenInput.value = problem.timeTaken;
        problemNotesInput.value = problem.notes;
        
        currentEditId = id;
        submitBtn.textContent = 'Update Problem';
        
        // Scroll to form
        problemForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function viewProblem(id) {
    const problem = allProblems.find(p => p.id === id);
    
    if (problem) {
        const modalBody = document.getElementById('modalBody');
        const modalTitle = document.getElementById('modalTitle');
        
        modalTitle.textContent = problem.name;
        
        const difficultyClass = problem.difficulty.toLowerCase();
        const statusClass = problem.status.toLowerCase();
        
        modalBody.innerHTML = `
            <div class="problem-details">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.25rem;">Difficulty</p>
                        <span class="badge ${difficultyClass}">${problem.difficulty}</span>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.25rem;">Status</p>
                        <span class="badge ${statusClass}">${problem.status}</span>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.25rem;">Topic</p>
                        <p style="font-weight: 600;">${problem.topic}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.25rem;">Date Added</p>
                        <p style="font-weight: 600;">${problem.dateAdded}</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.25rem;">Attempts</p>
                        <p style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${problem.attempts}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.25rem;">Time Taken</p>
                        <p style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${problem.timeTaken} min</p>
                    </div>
                </div>
                
                <div>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem;">Notes & Approach</p>
                    <div style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: 0.5rem; white-space: pre-wrap; word-break: break-word;">
                        ${problem.notes || 'No notes added'}
                    </div>
                </div>
                
                <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem;">
                    <button class="btn btn-primary btn-sm" onclick="editProblem(${problem.id}); closeModal();">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProblem(${problem.id}); closeModal();">Delete</button>
                </div>
            </div>
        `;
        
        problemModal.classList.add('active');
    }
}

// ============================================
// Rendering
// ============================================

function renderProblems() {
    problemsTableBody.innerHTML = '';
    
    if (filteredProblems.length === 0) {
        noProblemsMsg.classList.remove('hidden');
        return;
    }
    
    noProblemsMsg.classList.add('hidden');
    
    filteredProblems.forEach(problem => {
        const row = createTableRow(problem);
        problemsTableBody.appendChild(row);
    });
}

function createTableRow(problem) {
    const tr = document.createElement('tr');
    
    const difficultyClass = problem.difficulty.toLowerCase();
    const statusClass = problem.status.toLowerCase();
    const dateAdded = new Date(problem.dateAdded).toLocaleDateString();
    
    tr.innerHTML = `
        <td><strong>${problem.name}</strong></td>
        <td><span class="badge ${difficultyClass}">${problem.difficulty}</span></td>
        <td>${problem.topic}</td>
        <td><span class="badge ${statusClass}">${problem.status}</span></td>
        <td><strong>${problem.attempts}</strong></td>
        <td>${problem.timeTaken} min</td>
        <td><small>${dateAdded}</small></td>
        <td>
            <div class="actions">
                <button class="btn-edit btn-sm" onclick="viewProblem(${problem.id})">View</button>
                <button class="btn-delete btn-sm" onclick="deleteProblem(${problem.id})">Delete</button>
            </div>
        </td>
    `;
    
    return tr;
}

// ============================================
// Filtering & Searching
// ============================================

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const difficultyFilter = filterDifficulty.value;
    const topicFilter = filterTopic.value;
    const statusFilter = filterStatus.value;
    const sortOption = sortBy.value;
    
    // Filter
    filteredProblems = allProblems.filter(problem => {
        const matchSearch = problem.name.toLowerCase().includes(searchTerm);
        const matchDifficulty = !difficultyFilter || problem.difficulty === difficultyFilter;
        const matchTopic = !topicFilter || problem.topic === topicFilter;
        const matchStatus = !statusFilter || problem.status === statusFilter;
        
        return matchSearch && matchDifficulty && matchTopic && matchStatus;
    });
    
    // Sort
    if (sortOption === 'name') {
        filteredProblems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'difficulty') {
        const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        filteredProblems.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
    } else if (sortOption === 'dateAdded') {
        filteredProblems.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }
    
    renderProblems();
}

function resetFilters() {
    searchInput.value = '';
    filterDifficulty.value = '';
    filterTopic.value = '';
    filterStatus.value = '';
    sortBy.value = 'dateAdded';
    filteredProblems = [...allProblems];
    renderProblems();
}

// ============================================
// Analytics
// ============================================

async function updateAnalytics() {
    try {
        const response = await fetch(`${API_BASE}/analytics`);
        const analytics = await response.json();
        
        // Update sidebar stats
        document.getElementById('statTotal').textContent = analytics.totalProblems;
        document.getElementById('statSolved').textContent = analytics.solvedCount;
        document.getElementById('statPending').textContent = analytics.pendingCount;
        document.getElementById('statRevision').textContent = analytics.revisionCount;
        document.getElementById('statWeakest').textContent = analytics.weakestTopic || '-';
        
        // Update difficulty chart
        renderDifficultyChart(analytics.difficultyDistribution);
        
        // Update status chart
        renderStatusChart(analytics.statusDistribution);
        
        // Update topic chart
        renderTopicChart(analytics.topicDistribution);
    } catch (error) {
        console.error('Error updating analytics:', error);
    }
}

function renderDifficultyChart(data) {
    const total = data.Easy + data.Medium + data.Hard;
    
    updateBar('easyBar', 'easyCount', data.Easy, total);
    updateBar('mediumBar', 'mediumCount', data.Medium, total);
    updateBar('hardBar', 'hardCount', data.Hard, total);
}

function renderStatusChart(data) {
    const total = data.Solved + data.Pending + data.Revision;
    
    updateBar('solvedBar', 'solvedCount', data.Solved, total);
    updateBar('pendingBar', 'pendingCount', data.Pending, total);
    updateBar('revisionBar', 'revisionCount', data.Revision, total);
}

function updateBar(barId, countId, value, total) {
    const percentage = total === 0 ? 0 : (value / total) * 100;
    const bar = document.getElementById(barId);
    const count = document.getElementById(countId);
    
    if (bar) {
        bar.style.width = percentage + '%';
    }
    if (count) {
        count.textContent = value;
    }
}

function renderTopicChart(data) {
    const topicChart = document.getElementById('topicChart');
    
    if (Object.keys(data).length === 0) {
        topicChart.innerHTML = '<p class="empty">No topics yet</p>';
        return;
    }
    
    topicChart.innerHTML = Object.entries(data)
        .map(([topic, count]) => `
            <div class="topic-item">
                <span class="topic-name">${topic}</span>
                <span class="topic-count">${count} problems</span>
            </div>
        `)
        .join('');
}

// ============================================
// Form Utilities
// ============================================

function validateForm() {
    return problemNameInput.value.trim() &&
           problemDifficultyInput.value &&
           problemTopicInput.value.trim() &&
           problemStatusInput.value;
}

function resetForm() {
    problemForm.reset();
    currentEditId = null;
    submitBtn.textContent = 'Add Problem';
}

function extractTopics() {
    const topicsSet = new Set(allProblems.map(p => p.topic));
    allTopics = Array.from(topicsSet).sort();
}

function updateTopicFilters() {
    const currentTopic = filterTopic.value;
    
    filterTopic.innerHTML = '<option value="">All Topics</option>' +
        allTopics.map(topic => `<option value="${topic}">${topic}</option>`).join('');
    
    filterTopic.value = currentTopic;
}

// ============================================
// Modal
// ============================================

function closeModal() {
    problemModal.classList.remove('active');
}

// ============================================
// UI Feedback
// ============================================

function showSuccess(message) {
    const div = document.createElement('div');
    div.className = 'success-message';
    div.textContent = message;
    
    const formSection = document.querySelector('.form-section');
    formSection.insertAdjacentElement('afterbegin', div);
    
    setTimeout(() => div.remove(), 3000);
}

function showError(message) {
    const div = document.createElement('div');
    div.className = 'error-message';
    div.textContent = message;
    
    const formSection = document.querySelector('.form-section');
    formSection.insertAdjacentElement('afterbegin', div);
    
    setTimeout(() => div.remove(), 3000);
}

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
    // Escape to close modal
    if (e.key === 'Escape' && problemModal.classList.contains('active')) {
        closeModal();
    }
    
    // Ctrl+S to save (form)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (problemForm) {
            problemForm.dispatchEvent(new Event('submit'));
        }
    }
});

// ============================================
// Auto-refresh Analytics (every 5 seconds)
// ============================================

setInterval(() => {
    updateAnalytics();
}, 5000);
