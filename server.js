const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Connection string to MongoDB
mongoose.connect('mongodb://localhost:27017/studentDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Defining mongoose schema
const studentSchema = new mongoose.Schema({
  name: String,
  courseName: String,
  grade: String,
  score: Number,
  link: String
});

const Student = mongoose.model('Student', studentSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Routes
app.get('/', async (req, res) => {
  try {
    const students = await Student.find({});
    res.render('index', { students: students });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving students");
  }
});

// Add student
app.post('/addStudent', async (req, res) => {
  try {
    const newStudent = new Student({
      name: req.body.studentName,
      courseName: req.body.courseName,
      grade: req.body.grade,
      score: req.body.score,
      link: req.body.link
    });

    await newStudent.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding student");
  }
});

// Delete student
app.post('/deleteStudent', async (req, res) => {
  try {
    const id = req.body.id;
    await Student.findByIdAndDelete(id);
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting student");
  }
});

// Update student
app.post('/editStudent/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Student.findByIdAndUpdate(id, {
      name: req.body.studentName,
      courseName: req.body.courseName,
      grade: req.body.grade,
      score: req.body.score,
      link: req.body.link
    });
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating student");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
