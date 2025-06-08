import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  GOOGLE_SCRIPT_URL,
  MOCK_TODOS,
  LOCAL_STORAGE_TODO_KEY,
} from "./constants";
import TodoList from "./components/TodoList";
import ProgressDisplay from "./components/ProgressDisplay";
import SkillsGained from "./components/SkillsGained";
import EmailReminderControls from "./components/EmailReminderControls";
import Button from "./components/Button";
import SectionCard from "./components/SectionCard";

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => new Date().toISOString().split("T")[0];

const App = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState("");
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskSkills, setNewTaskSkills] = useState("");

  const [currentDateDisplay, setCurrentDateDisplay] = useState("");
  const [timeToEndOfDay, setTimeToEndOfDay] = useState("");

  useEffect(() => {
    // Set current date display
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDateDisplay(today.toLocaleDateString(undefined, options));

    // Countdown timer
    const calculateTimeRemaining = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999); // Set to end of current day

      const diff = endOfDay.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeToEndOfDay("Day has ended!");
        return false; // Stop timer
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeToEndOfDay(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} left today`
      );
      return true; // Continue timer
    };

    if (calculateTimeRemaining()) {
      const timerInterval = setInterval(() => {
        if (!calculateTimeRemaining()) {
          clearInterval(timerInterval);
        }
      }, 1000);
      return () => clearInterval(timerInterval); // Cleanup interval on component unmount
    }
  }, []);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Try loading from local storage first
    const storedTodos = localStorage.getItem(LOCAL_STORAGE_TODO_KEY);
    if (
      storedTodos &&
      GOOGLE_SCRIPT_URL ===
        "https://script.google.com/macros/s/AKfycbycaCqaUo9bOQMCE2MbyrsWkFmI1iYSy5QBvyEnXzOhrC1E0QjzZRJWkOy_Q6T_Xz8f6Q/exec"
    ) {
      // Only use LS if no real backend
      try {
        setTodos(JSON.parse(storedTodos));
        setIsLoading(false);
        console.log("Loaded todos from local storage.");
        return;
      } catch (e) {
        console.warn("Could not parse todos from local storage", e);
        localStorage.removeItem(LOCAL_STORAGE_TODO_KEY); // Clear corrupted data
      }
    }

    // If Google Script URL is the placeholder, use mock data
    if (
      GOOGLE_SCRIPT_URL ===
      "https://script.google.com/macros/s/AKfycbycaCqaUo9bOQMCE2MbyrsWkFmI1iYSy5QBvyEnXzOhrC1E0QjzZRJWkOy_Q6T_Xz8f6Q/exec"
    ) {
      console.warn(
        "Google Apps Script URL is not set (still placeholder). Using mock data."
      );
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      setTodos(MOCK_TODOS);
      setIsLoading(false);
      return;
    }

    // Otherwise, try fetching from the actual Google Script URL
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getTodos`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch todos: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.todos)) {
        setTodos(
          data.todos.map((todo) => ({
            ...todo,
            skills: todo.skills
              ? typeof todo.skills === "string"
                ? todo.skills.split(",").map((s) => s.trim())
                : todo.skills
              : [],
          }))
        );
      } else {
        throw new Error(data.message || "Invalid data format from API.");
      }
    } catch (err) {
      console.error("Error fetching todos from Google Apps Script:", err);
      setError(
        err.message || "An unknown error occurred while fetching todos."
      );
      // Fallback to mock data on error if desired, or show error message prominently
      setTodos(MOCK_TODOS);
      // Or: setTodos([]); // to show an empty list on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Save to local storage when todos change, but only if not using the real backend or if real backend failed
  useEffect(() => {
    if (
      !isLoading &&
      (GOOGLE_SCRIPT_URL ===
        "https://script.google.com/macros/s/AKfycbycaCqaUo9bOQMCE2MbyrsWkFmI1iYSy5QBvyEnXzOhrC1E0QjzZRJWkOy_Q6T_Xz8f6Q/exec" ||
        error)
    ) {
      localStorage.setItem(LOCAL_STORAGE_TODO_KEY, JSON.stringify(todos));
      console.log("Saved todos to local storage.");
    }
  }, [todos, isLoading, error]);

  const handleToggleComplete = useCallback(
    async (id) => {
      const originalTodos = [...todos];
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                status: todo.status === "Completed" ? "Pending" : "Completed",
              }
            : todo
        )
      );

      if (
        GOOGLE_SCRIPT_URL ===
        "https://script.google.com/macros/s/AKfycbycaCqaUo9bOQMCE2MbyrsWkFmI1iYSy5QBvyEnXzOhrC1E0QjzZRJWkOy_Q6T_Xz8f6Q/exec"
      ) {
        console.log(
          "URL is placeholder, not updating server for toggle complete."
        );
        return; // Don't attempt server update if URL is placeholder
      }

      const todoToUpdate = todos.find((t) => t.id === id); // Find the original state before optimistic update
      if (!todoToUpdate) return;

      // The status for the server should be the status *after* the optimistic update
      const newStatusForServer =
        todoToUpdate.status === "Completed" ? "Pending" : "Completed";

      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          // mode: 'cors', // Keep if your Apps Script needs it, often default works
          headers: { "Content-Type": "application/json" }, // Or 'text/plain' if Apps Script expects that
          body: JSON.stringify({
            action: "updateTodoStatus",
            id,
            status: newStatusForServer,
          }),
        });
        const resultText = await response.text(); // Read as text first for debugging
        try {
          const result = JSON.parse(resultText);
          if (!result.success) {
            console.error(
              "Failed to update todo status on server:",
              result.message
            );
            setTodos(originalTodos); // Revert on failure
            alert(`Error updating task: ${result.message || "Server error"}`);
          }
        } catch (parseError) {
          console.error(
            "Failed to parse JSON response from server:",
            resultText
          );
          setTodos(originalTodos); // Revert on failure
          alert("Error updating task: Received non-JSON response from server.");
        }
      } catch (error) {
        console.error("Network error updating todo:", error);
        setTodos(originalTodos); // Revert on failure
        alert(
          "Failed to sync update with server. Please check your connection."
        );
      }
    },
    [todos]
  );

  const handleAddTask = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newTaskDescription.trim()) {
        alert("Task description cannot be empty.");
        return;
      }
      const newTodoClient = {
        // Use a different name to avoid confusion with server response
        id: String(Date.now()), // Temporary ID for client-side optimistic update
        taskDescription: newTaskDescription.trim(),
        status: "Pending",
        dueDate: newTaskDueDate || null, // Send null if empty, or handle in Apps Script
        skills: newTaskSkills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        assignedDate: getTodayDateString(),
      };

      const originalTodos = [...todos];
      setTodos((prevTodos) => [newTodoClient, ...prevTodos]); // Optimistic update

      if (
        GOOGLE_SCRIPT_URL ===
        "https://script.google.com/macros/s/AKfycbycaCqaUo9bOQMCE2MbyrsWkFmI1iYSy5QBvyEnXzOhrC1E0QjzZRJWkOy_Q6T_Xz8f6Q/exec"
      ) {
        console.log("URL is placeholder, not adding task to server.");
        setNewTaskDescription("");
        setNewTaskDueDate("");
        setNewTaskSkills("");
        setShowAddTaskForm(false);
        return;
      }

      try {
        const payloadForServer = { ...newTodoClient };
        delete payloadForServer.id; // Server should generate ID

        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "addTodo", task: payloadForServer }),
        });
        const resultText = await response.text();
        try {
          const result = JSON.parse(resultText);
          if (!result.success || !result.id) {
            console.error("Failed to add todo on server:", result.message);
            setTodos(originalTodos); // Revert
            alert(
              `Error adding task: ${
                result.message || "Server error or no ID returned"
              }`
            );
          } else {
            // Update the temporary ID with the actual ID from the server
            setTodos((prev) =>
              prev.map((t) =>
                t.id === newTodoClient.id ? { ...t, id: result.id } : t
              )
            );
          }
        } catch (parseError) {
          console.error(
            "Failed to parse JSON response from server (addTodo):",
            resultText
          );
          setTodos(originalTodos);
          alert("Error adding task: Received non-JSON response from server.");
        }
      } catch (error) {
        console.error("Network error adding todo:", error);
        setTodos(originalTodos); // Revert
        alert(
          "Failed to sync new task with server. Please check your connection."
        );
      }

      setNewTaskDescription("");
      setNewTaskDueDate("");
      setNewTaskSkills("");
      setShowAddTaskForm(false);
    },
    [newTaskDescription, newTaskDueDate, newTaskSkills, todos]
  );

  const handleDeleteTodo = useCallback(
    async (id) => {
      if (!confirm("Are you sure you want to delete this task?")) return;

      const originalTodos = [...todos];
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id)); // Optimistic update

      if (
        GOOGLE_SCRIPT_URL ===
        "https://script.google.com/macros/s/AKfycbycaCqaUo9bOQMCE2MbyrsWkFmI1iYSy5QBvyEnXzOhrC1E0QjzZRJWkOy_Q6T_Xz8f6Q/exec"
      ) {
        console.log("URL is placeholder, not deleting task from server.");
        return;
      }

      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "deleteTodo", id }),
        });
        const resultText = await response.text();
        try {
          const result = JSON.parse(resultText);
          if (!result.success) {
            console.error("Failed to delete todo on server:", result.message);
            setTodos(originalTodos); // Revert
            alert(`Error deleting task: ${result.message || "Server error"}`);
          }
        } catch (parseError) {
          console.error(
            "Failed to parse JSON response from server (deleteTodo):",
            resultText
          );
          setTodos(originalTodos);
          alert("Error deleting task: Received non-JSON response from server.");
        }
      } catch (error) {
        console.error("Network error deleting todo:", error);
        setTodos(originalTodos); // Revert
        alert(
          "Failed to sync deletion with server. Please check your connection."
        );
      }
    },
    [todos]
  );

  const handleSendReminder = useCallback(async (type) => {
    setIsSendingEmail(true);
    setEmailStatusMessage("");

    if (
      GOOGLE_SCRIPT_URL ===
      "https://script.google.com/macros/s/AKfycbycaCqaUo9bOQMCE2MbyrsWkFmI1iYSy5QBvyEnXzOhrC1E0QjzZRJWkOy_Q6T_Xz8f6Q/exec"
    ) {
      console.log(
        `Simulating sending ${type} email reminder (URL is placeholder)...`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmailStatusMessage(`Mock ${type} reminder email "sent" successfully!`);
    } else {
      console.log(
        `Attempting to send ${type} email reminder via Apps Script...`
      );
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "sendEmailReminder", type }),
        });
        const resultText = await response.text();
        try {
          const result = JSON.parse(resultText);
          if (result.success) {
            setEmailStatusMessage(
              result.message || `${type} reminder email sent successfully!`
            );
          } else {
            throw new Error(
              result.message || `Failed to send ${type} reminder.`
            );
          }
        } catch (parseError) {
          console.error(
            "Failed to parse JSON response from server (sendReminder):",
            resultText
          );
          throw new Error(
            "Received non-JSON response from server during reminder."
          );
        }
      } catch (err) {
        console.error(err);
        setEmailStatusMessage(`Error sending ${type} reminder: ${err.message}`);
      }
    }

    setIsSendingEmail(false);
    setTimeout(() => setEmailStatusMessage(""), 5000); // Clear message after 5 seconds
  }, []);

  const filteredTodos = useMemo(() => {
    if (filter === "pending")
      return todos.filter((todo) => todo.status !== "Completed");
    if (filter === "completed")
      return todos.filter((todo) => todo.status === "Completed");
    return todos;
  }, [todos, filter]);

  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.status === "Completed"),
    [todos]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-sky-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-3 text-lg text-slate-700">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Oops! Something went wrong.
          </h2>
          <p className="text-slate-700 mb-2">{error}</p>
          <p className="text-sm text-slate-500 mb-6">
            If using Google Apps Script, ensure the URL in `constants.js` is
            correct, the script is deployed correctly (accessible to "Anyone"),
            and your Google Sheet has the correct headers and permissions.
          </p>
          <Button onClick={fetchTodos} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 sm:text-5xl">
          My To-Do Tracker
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
          Stay organized and track your progress. Powered by Google Sheets.
        </p>
      </header>

      <main className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <SectionCard title="Task Summary">
              <ProgressDisplay todos={todos} />
            </SectionCard>
            <SectionCard title="Skills Acquired">
              <SkillsGained completedTodos={completedTodos} />
            </SectionCard>
            <SectionCard title="Reminders">
              <EmailReminderControls
                onSendReminder={handleSendReminder}
                isSending={isSendingEmail}
              />
              {emailStatusMessage && (
                <p
                  className={`mt-2 text-sm text-center p-2 rounded-md ${
                    emailStatusMessage.startsWith("Error")
                      ? "bg-red-100 text-red-700"
                      : "bg-sky-50 text-sky-700"
                  }`}
                >
                  {emailStatusMessage}
                </p>
              )}
            </SectionCard>
          </div>

          <div className="md:col-span-2">
            <SectionCard title="Your Tasks">
              <div className="p-4 bg-slate-50 rounded-t-md border-b border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-sky-700">
                    {currentDateDisplay}
                  </h3>
                  <p className="text-sm text-slate-600 bg-sky-100 px-3 py-1 rounded-full">
                    {timeToEndOfDay}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex space-x-2">
                    {["all", "pending", "completed"].map((f) => (
                      <Button
                        key={f}
                        onClick={() => setFilter(f)}
                        variant={filter === f ? "primary" : "secondary"}
                        className="capitalize px-4 py-1.5 text-sm"
                      >
                        {f}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={() => setShowAddTaskForm(!showAddTaskForm)}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    {showAddTaskForm ? "Cancel" : "+ Add New Task"}
                  </Button>
                </div>
              </div>

              {showAddTaskForm && (
                <form
                  onSubmit={handleAddTask}
                  className="p-4 border-b border-slate-200 bg-white space-y-4"
                >
                  <div>
                    <label
                      htmlFor="newTaskDescription"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Task Description
                    </label>
                    <input
                      id="newTaskDescription"
                      type="text"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      placeholder="What do you need to do?"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="newTaskDueDate"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Due Date (Optional)
                      </label>
                      <input
                        id="newTaskDueDate"
                        type="date"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="newTaskSkills"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Skills (comma-separated, Optional)
                      </label>
                      <input
                        id="newTaskSkills"
                        type="text"
                        value={newTaskSkills}
                        onChange={(e) => setNewTaskSkills(e.target.value)}
                        placeholder="e.g., React, Writing"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Add Task
                  </Button>
                </form>
              )}

              <TodoList
                todos={filteredTodos}
                onToggleComplete={handleToggleComplete}
                onDeleteTodo={handleDeleteTodo}
              />
            </SectionCard>
          </div>
        </div>
      </main>

      <footer className="text-center text-sm text-slate-500 mt-12 pb-8">
        &copy; {new Date().getFullYear()} Your To-Do Tracker. Stay Productive!
      </footer>
    </div>
  );
};

export default App;
