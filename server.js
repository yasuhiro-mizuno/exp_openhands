const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 12000;
const DATA_FILE = path.join(__dirname, 'todos.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// データファイルの初期化
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// ToDoリストを取得
app.get('/api/todos', (req, res) => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const todos = JSON.parse(data);
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'データの読み込みに失敗しました' });
    }
});

// ToDoを追加
app.post('/api/todos', (req, res) => {
    try {
        const { title, deadline } = req.body;
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const todos = JSON.parse(data);
        
        const newTodo = {
            id: Date.now(),
            title,
            deadline,
            createdAt: new Date().toISOString(),
            completed: false
        };
        
        todos.push(newTodo);
        fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
        res.json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'ToDoの追加に失敗しました' });
    }
});

// ToDoを更新
app.put('/api/todos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, deadline, completed } = req.body;
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const todos = JSON.parse(data);
        
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if (todoIndex === -1) {
            return res.status(404).json({ error: 'ToDoが見つかりません' });
        }
        
        todos[todoIndex] = {
            ...todos[todoIndex],
            title: title !== undefined ? title : todos[todoIndex].title,
            deadline: deadline !== undefined ? deadline : todos[todoIndex].deadline,
            completed: completed !== undefined ? completed : todos[todoIndex].completed
        };
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
        res.json(todos[todoIndex]);
    } catch (error) {
        res.status(500).json({ error: 'ToDoの更新に失敗しました' });
    }
});

// ToDoを削除
app.delete('/api/todos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const todos = JSON.parse(data);
        
        const filteredTodos = todos.filter(todo => todo.id !== id);
        if (filteredTodos.length === todos.length) {
            return res.status(404).json({ error: 'ToDoが見つかりません' });
        }
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(filteredTodos, null, 2));
        res.json({ message: 'ToDoが削除されました' });
    } catch (error) {
        res.status(500).json({ error: 'ToDoの削除に失敗しました' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});