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
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(screen.getByText('テストタスク')).toHaveStyle('text-decoration: line-through');
    const deleteBtn = screen.getByText('削除');
    fireEvent.click(deleteBtn);
    expect(screen.queryByText('テストタスク')).not.toBeInTheDocument();
  });

  test('フィルタボタンで表示切替', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力');
    const addBtn = screen.getByText('追加');
    fireEvent.change(input, { target: { value: 'A' } });
    fireEvent.click(addBtn);
    fireEvent.change(input, { target: { value: 'B' } });
    fireEvent.click(addBtn);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByText('未完了 (1)'));
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.queryByText('A')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('完了 (1)'));
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('全て (2)'));
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  test('空欄で追加しようとするとアラート', () => {
    window.alert = jest.fn();
    render(<TestApp />);
    const addBtn = screen.getByText('追加');
    fireEvent.click(addBtn);
    expect(window.alert).toHaveBeenCalledWith('タスク内容を入力してください。');
  });
});
