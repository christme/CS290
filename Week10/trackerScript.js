//*********************************************************************************
// Elya Christman
// CS 290, Spring 2016
// Week 10 Assignment - Database Interactions and UI
// trackerScript.js - generates table based on database contents.
//*********************************************************************************

var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

var mysql = require('mysql');
var pool = mysql.createPool(
{
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

app.get('/WorkoutTracker',function(req,res,next)
{
	var context = {};
	var data = {name: req.query.name, reps: req.query.reps, weight: req.query.weight, date: req.query.date, lbs: req.query.lbs}
	pool.query("INSERT INTO workouts SET ?", data, function(err, result)
	{
		if(err)
		{
			next(err);
			return;
		}
	});
	pool.query('SELECT * FROM workouts', function(err, rows, fields)
	{
		if(err)
		{
			next(err);
			return;
		}
		context.results = rows;
		res.render('MainPage', context);
	});	
});

app.get('/reset-table',function(req,res,next)
{
	var context = {};
	pool.query("DROP TABLE IF EXISTS workouts", function(err)
	{
		var createString = "CREATE TABLE workouts("+
		"id INT PRIMARY KEY AUTO_INCREMENT,"+
		"name VARCHAR(255) NOT NULL,"+
		"reps INT,"+
		"weight INT,"+
		"date DATE,"+
		"lbs BOOLEAN)";
		pool.query(createString, function(err)
		{
			context.results = "Table reset";
			res.render('MainPage',context);
		})
	});
});

app.post('/WorkoutTracker',function(req,res,next)
{
	var context = {};
	pool.query("DELETE FROM workout WHERE id = ?", [req.id] ,function(err, result)
	{
		if(err)
		{
			next(err);
			return;
		}
	});
}

app.listen(app.get('port'), function()
{
        console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});