import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import TestApp from './testApp.jsx';

describe('App.js', () => {
  test('TestAppコンポーネントが描画される', () => {
    render(<App />);
    expect(screen.getByText('業務用Todo管理')).toBeInTheDocument();
  });
});

describe('index.js', () => {
  test('Appがクラッシュせずにレンダリングできる', () => {
    render(<App />);
    expect(screen.getByText('業務用Todo管理')).toBeInTheDocument();
  });
});

describe('TestApp.jsx', () => {
  test('初期表示でバージョンが表示される', () => {
    render(<TestApp />);
    expect(screen.getByText(/バージョン/)).toBeInTheDocument();
  });

  test('タスク追加・未完了・完了・削除ができる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力');
    const addBtn = screen.getByText('追加');
    fireEvent.change(input, { target: { value: 'テストタスク' } });
    fireEvent.click(addBtn);
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox', { name: '完了チェック' });
    fireEvent.click(checkboxes[0]);
    expect(screen.getByText('テストタスク')).toHaveStyle('text-decoration: line-through');
    const deleteBtn = screen.getByText('削除');
    fireEvent.click(deleteBtn);
    expect(screen.queryByText('テストタスク')).not.toBeInTheDocument();
  });

test('フィルタボタンで表示切替', async () => {
  render(<TestApp />);

  const input = screen.getByPlaceholderText('新しいタスクを入力');
  const addBtn = screen.getByText('追加');

  // タスク追加
  fireEvent.change(input, { target: { value: 'A' } });
  fireEvent.click(addBtn);

  fireEvent.change(input, { target: { value: 'B' } });
  fireEvent.click(addBtn);

  // Aを完了にする
  const checkboxes = screen.getAllByRole('checkbox', { name: '完了チェック' });
  fireEvent.click(checkboxes[0]);

  // 🔽 ここが重要（完全一致）
  const 未完了Btn = screen.getByRole('button', { name: /^未完了/ });
  const 完了Btn   = screen.getByRole('button', { name: /^完了/ });
  const 全てBtn   = screen.getByRole('button', { name: /^全て/ });

  // ---- 未完了 ----
  fireEvent.click(未完了Btn);
  expect(await screen.findByText('B')).toBeInTheDocument();
  expect(screen.queryByText('A')).not.toBeInTheDocument();

  // ---- 完了 ----
  fireEvent.click(完了Btn);
  expect(await screen.findByText('A')).toBeInTheDocument();
  expect(screen.queryByText('B')).not.toBeInTheDocument();

  // ---- 全て ----
  fireEvent.click(全てBtn);
  expect(await screen.findByText('A')).toBeInTheDocument();
  expect(await screen.findByText('B')).toBeInTheDocument();
});

  test('空欄で追加しようとするとアラート', () => {
    window.alert = jest.fn();
    render(<TestApp />);
    const addBtn = screen.getByText('追加');
    fireEvent.click(addBtn);
    expect(window.alert).toHaveBeenCalledWith('タスク内容を入力してください。');
  });
});

describe('TestApp.jsx 拡張機能', () => {
  test('期日・優先度・重要フラグ付きでタスク追加・表示', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力');
    const dateInput = screen.getByLabelText('期日');
    const prioritySelect = screen.getByLabelText('優先度');
    const importantCheck = screen.getByLabelText('重要');
    const addBtn = screen.getByText('追加');

    // 入力値セット
    fireEvent.change(input, { target: { value: '重要タスク' } });
    const today = new Date().toISOString().split('T')[0];
    fireEvent.change(dateInput, { target: { value: today } });
    fireEvent.change(prioritySelect, { target: { value: '高' } });
    fireEvent.click(importantCheck); // 重要フラグON
    fireEvent.click(addBtn);

    // 表示検証
    expect(screen.getByText('重要タスク')).toBeInTheDocument();
    expect(screen.getByText(`期日: ${today}`)).toBeInTheDocument();
    expect(screen.getByText(/優先度: 高/)).toBeInTheDocument();
    // 「重要」バッジのみを検証
    const badges = screen.getAllByText('重要');
    const badge = badges.find(el => el.className.includes('badge'));
    expect(badge).toHaveClass('badge');
    expect(screen.getByText('重要タスク')).toHaveStyle('font-weight: bold');
  });

  test('優先度・期日・重要フラグの初期値・変更', () => {
    render(<TestApp />);
    const prioritySelect = screen.getByLabelText('優先度');
    expect(prioritySelect.value).toBe('中');
    fireEvent.change(prioritySelect, { target: { value: '低' } });
    expect(prioritySelect.value).toBe('低');
    const dateInput = screen.getByLabelText('期日');
    expect(dateInput.value).toBe('');
    const importantCheck = screen.getByLabelText('重要');
    expect(importantCheck.checked).toBe(false);
    fireEvent.click(importantCheck);
    expect(importantCheck.checked).toBe(true);
  });
});
