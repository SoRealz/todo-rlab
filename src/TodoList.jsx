import React, { useState, useReducer } from 'react';
import './TodoList.css'; // Import CSS file for styling

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [{ id: Date.now(), text: action.payload, complete: false }, ...state];
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, complete: !todo.complete } : todo
      );
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    case 'EDIT_TODO':
      return state.map(todo =>
        todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
      );
    default:
      return state;
  }
}

function TodoList() {
  const [todos, dispatch] = useReducer(reducer, []);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      dispatch({ type: 'ADD_TODO', payload: newTodo });
      setNewTodo('');
      // Reverse the array after adding a new todo
      dispatch({ type: 'REVERSE_TODOS' });
    }
  };

  const handleToggleTodo = id => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const handleDeleteTodo = id => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const handleEditTodo = id => {
    setEditingTodo(id);
    const todoToEdit = todos.find(todo => todo.id === id);
    setEditedText(todoToEdit.text);
  };

  const handleSaveEdit = id => {
    dispatch({ type: 'EDIT_TODO', payload: { id, text: editedText } });
    setEditingTodo(null);
  };

  return (
    <div className="center-container">
      <div className="todo-list-container">
        <h1>Todo List</h1>
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
        <button onClick={handleAddTodo}>Add Todo</button>
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.complete}
                onChange={() => handleToggleTodo(todo.id)}
              />
              {editingTodo === todo.id ? (
                <input
                  type="text"
                  value={editedText}
                  onChange={e => setEditedText(e.target.value)}
                />
              ) : (
                <span style={{ textDecoration: todo.complete ? 'line-through' : 'none' }}>
                  {todo.text}
                </span>
              )}
              {editingTodo === todo.id ? (
                <button onClick={() => handleSaveEdit(todo.id)}>Save</button>
              ) : (
                <>
                  <button onClick={() => handleEditTodo(todo.id)}>Edit</button>
                  <button onClick={() => handleDeleteTodo(todo.id)} disabled={!todo.complete}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
