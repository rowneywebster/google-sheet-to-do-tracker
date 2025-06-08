import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onToggleComplete, onDeleteTodo }) => {
  if (todos.length === 0) {
    return <p className="text-center text-slate-500 py-4">No tasks yet. Add some!</p>;
  }

  return (
    <ul className="space-y-3" role="list">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggleComplete={onToggleComplete} onDelete={onDeleteTodo} />
      ))}
    </ul>
  );
};

export default TodoList;