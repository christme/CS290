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
		context.results = function(rows)
		{
			var table = document.createElement('table');
			var header = document.createElement('th');
			var row = document.createElement('tr');
			var tableData = document.createElement('td');
			
			table.style.border = "double";
			header.style.border = "1px solid black";
			tableData.style.border = "1px solid black";
			
			//generate the table header
			row.appendChild(header.cloneNode());
			row.lastChild.textContent = "Name";
			row.appendChild(header.cloneNode());
			row.lastChild.textContent = "Reps";
			row.appendChild(header.cloneNode());
			row.lastChild.textContent = "Weight";
			row.appendChild(header.cloneNode());
			row.lastChild.textContent = "Date";
			row.appendChild(header.cloneNode());
			row.lastChild.textContent = "In Pounds";
			
			table.appendChild(row);
			
			for (var i = 0; i < rows.length; i ++)
			{
				row.appendChild(tableData.cloneNode());
				row.lastChild.textContent = rows[i].name;
				row.appendChild(tableData.cloneNode());
				row.lastChild.textContent = rows[i].reps;
				row.appendChild(tableData.cloneNode());
				row.lastChild.textContent = rows[i].weight;
				row.appendChild(tableData.cloneNode());
				row.lastChild.textContent = rows[i].date;
				row.appendChild(tableData.cloneNode());
				row.lastChild.textContent = rows[i].lbs;
				table.appendChild(row);
			}	
			return table;
		};
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

app.listen(app.get('port'), function()
{
        console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});