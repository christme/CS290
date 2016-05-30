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
app.set('port', 3050);

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
	mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result)
	{
		if(err)
		{
			next(err);
			return;
		}
		if(result.length == 1)
		{
			var curVals = result[0];
			mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ", [req.query.name || curVals.name, req.query.done || curVals.done, req.query.due || curVals.due, req.query.id],
			function(err, result)
			{
				if(err)
				{
					next(err);
					return;
				}	
				context.results = "Updated " + result.changedRows + " rows.";
				res.render('MainPage',context);
			});
		}
	});
});

app.get('/WorkoutTracker',function(req,res,next)
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
			res.render('home',context);
		})
	});
});

app.listen(app.get('port'), function()
{
        console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});