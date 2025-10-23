import React, { useState, useEffect } from 'react';
import './TodoList.css'; // Assuming we create this CSS file

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTimers, setActiveTimers] = useState({});

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    const newTodo = {
      id: Date.now(),
      task: inputValue,
      completed: false,
      timeSpent: 0,
      isTimerRunning: false,
      timerDuration: 25 * 60, // 25 minutes in seconds
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startTimer = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo || todo.isTimerRunning) return;

    const updatedTodos = todos.map(t =>
      t.id === id ? { ...t, isTimerRunning: true } : t
    );
    setTodos(updatedTodos);

    const interval = setInterval(() => {
      setTodos(prevTodos => {
        return prevTodos.map(t => {
          if (t.id === id) {
            const newTimeSpent = t.timeSpent + 1;
            if (newTimeSpent >= t.timerDuration) {
              clearInterval(interval);
              setActiveTimers(prev => {
                const newTimers = { ...prev };
                delete newTimers[id];
                return newTimers;
              });
              return { ...t, timeSpent: t.timerDuration, isTimerRunning: false };
            }
            return { ...t, timeSpent: newTimeSpent };
          }
          return t;
        });
      });
    }, 1000);

    setActiveTimers(prev => ({ ...prev, [id]: interval }));
  };

  const pauseTimer = (id) => {
    if (activeTimers[id]) {
      clearInterval(activeTimers[id]);
      setActiveTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[id];
        return newTimers;
      });
      setTodos(todos.map(t =>
        t.id === id ? { ...t, isTimerRunning: false } : t
      ));
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'uncompleted') return !todo.completed;
    return true;
  });

  const exportTasks = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-list-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importTasks = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        setTodos(importedTasks);
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const deleteAll = () => {
    setTodos([]);
  };

  return (
    <div className="todo-container">
      <h2>Todo List</h2>
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button type="submit" className="todo-button">Add Todo</button>
      </form>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('uncompleted')} className={filter === 'uncompleted' ? 'active' : ''}>Active</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
      </div>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-content">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
              />
              <span>{todo.task}</span>
              <div className="timer-display">
                {Math.floor(todo.timeSpent / 60)}:{(todo.timeSpent % 60).toString().padStart(2, '0')} / {Math.floor(todo.timerDuration / 60)}:00
              </div>
              <button onClick={() => todo.isTimerRunning ? pauseTimer(todo.id) : startTimer(todo.id)} className="timer-button">
                {todo.isTimerRunning ? 'Pause' : 'Start'} Timer
              </button>
            </div>
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p className="no-todo-item">No todos yet. Add one above!</p>}
      <div className="action-buttons">
        <button onClick={exportTasks} className="export-btn">Export Tasks</button>
        <label className="import-btn">
          Import Tasks
          <input type="file" accept=".json" onChange={importTasks} style={{ display: 'none' }} />
        </label>
        <button onClick={deleteAll} className="delete-all-btn">Delete All</button>
      </div>
    </div>
  );
};

export default TodoList;
