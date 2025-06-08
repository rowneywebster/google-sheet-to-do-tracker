// IMPORTANT: This should be your actual Google Apps Script Web App URL
// Replace 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE' if you haven't already.
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycaCqaUo9bOQMCE2MbyrsWkFmI1iYSy5QBvyEnXzOhrC1E0QjzZRJWkOy_Q6T_Xz8f6Q/exec';

export const INITIAL_TODOS = [];

export const MOCK_TODOS = [
  { id: '1', taskDescription: 'Setup Google Apps Script for Todos', status: 'Completed', dueDate: '2024-07-25', skills: ['Google Apps Script', 'API Development'] },
  { id: '2', taskDescription: 'Develop React Frontend UI', status: 'In Progress', dueDate: '2024-07-28', skills: ['React', 'TailwindCSS'] },
  { id: '3', taskDescription: 'Integrate Fetch Logic', status: 'Pending', dueDate: '2024-07-30', skills: ['API Integration'] },
  { id: '4', taskDescription: 'Test Email Reminder Simulation', status: 'Pending', dueDate: '2024-08-01', skills: ['Testing'] },
  { id: '5', taskDescription: 'Deploy Application', status: 'Pending', skills: ['Deployment', 'CI/CD'] },
];

export const LOCAL_STORAGE_TODO_KEY = 'googleSheetTodos';