from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Database initialization
def init_db():
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS tasks 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  title TEXT NOT NULL, 
                  description TEXT, 
                  completed BOOLEAN)''')
    conn.commit()
    conn.close()

# Get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    c.execute('SELECT * FROM tasks')
    tasks = [{'id': row[0], 'title': row[1], 'description': row[2], 'completed': bool(row[3])} 
             for row in c.fetchall()]
    conn.close()
    return jsonify(tasks)

# Create task
@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    c.execute('INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
              (data['title'], data.get('description', ''), False))
    conn.commit()
    task_id = c.lastrowid
    conn.close()
    return jsonify({'id': task_id, 'title': data['title'], 
                   'description': data.get('description', ''), 'completed': False}), 201

# Update task
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    c.execute('UPDATE tasks SET title=?, description=?, completed=? WHERE id=?',
              (data['title'], data.get('description', ''), data['completed'], task_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task updated'})

# Delete task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    c.execute('DELETE FROM tasks WHERE id=?', (task_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task deleted'})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)