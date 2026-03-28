import sqlite3
from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wpm INTEGER,
            accuracy INTEGER,
            mode TEXT,
            date DATE DEFAULT (DATE('now'))
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    today = datetime.now().strftime('%Y-%m-%d')
    cursor.execute('SELECT COUNT(*) FROM scores WHERE date = ?', (today,))
    tests_today = cursor.fetchone()[0]
    conn.close()
    return render_template('index.html', tests_today=tests_today)

@app.route('/save_score', methods=['POST'])
def save_score():
    data = request.json
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO scores (wpm, accuracy, mode) VALUES (?, ?, ?)',
                   (data['wpm'], data['accuracy'], data['mode']))
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)