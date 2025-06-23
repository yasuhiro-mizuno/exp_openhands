class TodoApp {
    constructor() {
        this.todos = [];
        this.editingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTodos();
    }

    bindEvents() {
        // フォーム送信
        document.getElementById('todoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // 編集フォーム送信
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateTodo();
        });

        // モーダル関連
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeModal();
        });

        // モーダル外クリックで閉じる
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('editModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    async loadTodos() {
        try {
            const response = await fetch('/api/todos');
            this.todos = await response.json();
            this.renderTodos();
        } catch (error) {
            console.error('ToDoの読み込みに失敗しました:', error);
        }
    }

    async addTodo() {
        const title = document.getElementById('title').value.trim();
        const deadline = document.getElementById('deadline').value;

        if (!title || !deadline) {
            alert('タスク名と期限を入力してください');
            return;
        }

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, deadline }),
            });

            if (response.ok) {
                document.getElementById('todoForm').reset();
                this.loadTodos();
            } else {
                alert('ToDoの追加に失敗しました');
            }
        } catch (error) {
            console.error('ToDoの追加に失敗しました:', error);
            alert('ToDoの追加に失敗しました');
        }
    }

    async updateTodo() {
        const title = document.getElementById('editTitle').value.trim();
        const deadline = document.getElementById('editDeadline').value;
        const completed = document.getElementById('editCompleted').checked;

        if (!title || !deadline) {
            alert('タスク名と期限を入力してください');
            return;
        }

        try {
            const response = await fetch(`/api/todos/${this.editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, deadline, completed }),
            });

            if (response.ok) {
                this.closeModal();
                this.loadTodos();
            } else {
                alert('ToDoの更新に失敗しました');
            }
        } catch (error) {
            console.error('ToDoの更新に失敗しました:', error);
            alert('ToDoの更新に失敗しました');
        }
    }

    async deleteTodo(id) {
        if (!confirm('このToDoを削除しますか？')) {
            return;
        }

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                this.loadTodos();
            } else {
                alert('ToDoの削除に失敗しました');
            }
        } catch (error) {
            console.error('ToDoの削除に失敗しました:', error);
            alert('ToDoの削除に失敗しました');
        }
    }

    openEditModal(todo) {
        this.editingId = todo.id;
        document.getElementById('editTitle').value = todo.title;
        document.getElementById('editDeadline').value = todo.deadline;
        document.getElementById('editCompleted').checked = todo.completed;
        document.getElementById('editModal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingId = null;
    }

    isUrgent(deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const timeDiff = deadlineDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff <= 1 && daysDiff >= 0;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDeadline(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    renderTodos() {
        const container = document.getElementById('todoItems');
        
        if (this.todos.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #7f8c8d; font-style: italic;">タスクがありません</p>';
            return;
        }

        container.innerHTML = this.todos.map(todo => {
            const isUrgent = this.isUrgent(todo.deadline);
            const urgentClass = isUrgent ? 'urgent' : '';
            const completedClass = todo.completed ? 'completed' : '';
            
            return `
                <div class="todo-item ${urgentClass} ${completedClass}">
                    <div class="todo-header">
                        <div class="todo-title">${this.escapeHtml(todo.title)}</div>
                        <div class="todo-actions">
                            <button class="edit-btn" onclick="app.openEditModal(${JSON.stringify(todo).replace(/"/g, '&quot;')})">
                                編集
                            </button>
                            <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">
                                削除
                            </button>
                        </div>
                    </div>
                    <div class="todo-meta">
                        <span>作成日: ${this.formatDate(todo.createdAt)}</span>
                        <span class="deadline">期限: ${this.formatDeadline(todo.deadline)}</span>
                        ${todo.completed ? '<span style="color: #27ae60; font-weight: bold;">✓ 完了済み</span>' : ''}
                        ${isUrgent && !todo.completed ? '<span style="color: #e74c3c; font-weight: bold;">⚠ 期限間近！</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// アプリケーション初期化
const app = new TodoApp();