// Importaciones necesarias
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Inicialización de Express
const app = express();

// Configuración de MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tasks'
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Para servir archivos estáticos

// Configuración de EJS
app.set('view engine', 'ejs');

// Rutas
app.get('/', (req, res) => {
  connection.query('SELECT * FROM tasks', (error, results, fields) => {
    if (error) throw error;
    res.render('index', { tasks: results });
  });
});

app.post('/add', (req, res) => {
  const { task } = req.body;
  connection.query('INSERT INTO tasks (description) VALUES (?)', [task], (error, results, fields) => {
    if (error) throw error;
    res.redirect('/');
  });
});

app.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM tasks WHERE id = ?', [id], (error, results, fields) => {
    if (error) throw error;
    res.redirect('/');
  });
});

app.post('/update/:id', (req, res) => {
  const taskId = req.params.id;
  const newDescription = req.body.description;

  connection.query('UPDATE tasks SET description = ? WHERE id = ?', [newDescription, taskId], (error, results, fields) => {
    if (error) throw error;
    res.redirect('/');
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});