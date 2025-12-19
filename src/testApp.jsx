import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function TestApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  // タスク追加
  function handleAddTodo(e) {
    e.preventDefault();
    // --- バリデーションチェック関数を呼び出し ---
    if (!validateTaskInput(input)) {
      // --- 空欄の場合はアラートを表示 ---
      alert("タスク内容を入力してください。");
      return;
    }

    if (input.trim() === '') return;
    setTodos([
      ...todos,
      { text: input, completed: false, id: Date.now() }
    ]);
    setInput('');
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
  const version = "1.0.0";

  return (
    <div className="container py-4" style={{ background: '#fff', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="p-4 mb-4" style={{ background: '#e3f2fd', borderRadius: '8px' }}>
            <h2 className="mb-0">業務用Todo管理</h2>
            <small className="text-muted">バージョン: {version}</small>
          </div>
          <form onSubmit={handleAddTodo} className="input-group mb-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="新しいタスクを入力"
              className="form-control"
            />
            <button type="submit" className="btn btn-primary">追加</button>
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
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                    className="form-check-input me-2"
                  />
                  <span
                    style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#888' : '#222' }}
                  >{todo.text}</span>
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
