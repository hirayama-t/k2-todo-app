import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function TestApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('中');
  const [isImportant, setIsImportant] = useState(false);
  const [filter, setFilter] = useState('all');

  // タスク追加
  function handleAddTodo(e) {
    e.preventDefault();
    if (!validateTaskInput(input)) {
      alert("タスク内容を入力してください。");
      return;
    }
    setTodos([
      ...todos,
      {
        text: input,
        completed: false,
        id: Date.now(),
        dueDate,
        priority,
        isImportant
      }
    ]);
    setInput('');
    setDueDate('');
    setPriority('中');
    setIsImportant(false);
  }

  // 完了状態切替
  function handleToggleComplete(id) {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // タスク削除
  function handleDeleteTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  // フィルタリング
  function getFilteredTodos() {
    if (filter === 'active') return todos.filter(todo => !todo.completed);
    if (filter === 'completed') return todos.filter(todo => todo.completed);
    return todos;
  }

  // --- バリデーションチェック関数（シンプルな実装） ---
  function validateTaskInput(value) {
    return typeof value === "string" && value.trim() !== "";
  }
// --- ここまで ---


  // 件数取得
  const totalCount = todos.length;
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  // バージョン情報を追加する
  const version = "1.0.1";

  return (
    <div className="container py-4" style={{ background: '#fff', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="p-4 mb-4" style={{ background: '#e3f2fd', borderRadius: '8px' }}>
            <h2 className="mb-0">業務用Todo管理</h2>
            <small className="text-muted">バージョン: {version}</small>
          </div>
          <form onSubmit={handleAddTodo} className="row g-2 mb-3 align-items-end">
            <div className="col-md-4">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="新しいタスクを入力"
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="dueDateInput" className="form-label">期日</label>
              <input
                id="dueDateInput"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="form-control"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="prioritySelect" className="form-label">優先度</label>
              <select
                id="prioritySelect"
                className="form-select"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
            </div>
            <div className="col-md-2 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="importantCheck"
                checked={isImportant}
                onChange={e => setIsImportant(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="importantCheck">重要</label>
            </div>
            <div className="col-md-1">
              <button type="submit" className="btn btn-primary w-100">追加</button>
            </div>
          </form>
          <div className="mb-3 d-flex align-items-center gap-3">
            <button
              className={`btn btn-outline-primary btn-sm${filter === 'all' ? ' active' : ''}`}
              onClick={() => setFilter('all')}
            >全て ({totalCount})</button>
            <button
              className={`btn btn-outline-success btn-sm${filter === 'active' ? ' active' : ''}`}
              onClick={() => setFilter('active')}
            >未完了 ({activeCount})</button>
            <button
              className={`btn btn-outline-secondary btn-sm${filter === 'completed' ? ' active' : ''}`}
              onClick={() => setFilter('completed')}
            >完了 ({completedCount})</button>
          </div>
          <ul className="list-group">
            {getFilteredTodos().map(todo => (
              <li key={todo.id} className="list-group-item d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center w-100">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                    className="form-check-input me-2"
                    aria-label="完了チェック"
                  />
                  <span
                    style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#888' : '#222', fontWeight: todo.isImportant ? 'bold' : 'normal' }}
                  >
                    {todo.isImportant && <span className="badge bg-danger me-2">重要</span>}
                    {todo.text}
                  </span>
                  <span className="ms-3 text-secondary small">{todo.dueDate && `期日: ${todo.dueDate}`}</span>
                  <span className="ms-3 badge bg-info text-dark">優先度: {todo.priority}</span>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="btn btn-danger btn-sm"
                >削除</button>
              </li>
            ))}
            {getFilteredTodos().length === 0 && (
              <li className="list-group-item text-center text-muted">タスクがありません</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TestApp;
