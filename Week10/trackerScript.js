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
	pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.name], [req.query.reps]
	[req.query.weight], [req.query.date], [req.query.lbs], function(err, result)
	{
		if(err)
		{
			next(err);
			return;
		}
		context.results = "Inserted id " + result.insertId;
		res.render('MainPage',context);
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

app.listen(app.get('port'), function()
{
        console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});