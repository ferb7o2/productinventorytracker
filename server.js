const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const cors = require('cors');

PORT=8080;

// connect to db
let db;
(async () => {
	db = await open({
		filename: 'data.sqlite',
		driver: sqlite3.Database
	});
})();

app = express();
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(cors());

app.get('/data', async (req,res) => {

	//res.set('Access-Control-Allow-Origin','*')

	//const sql_query_instructor='SELECT * FROM instructor;';
	//const sql_query_course='SELECT * FROM course;';
	//const sql_query_cInstructor='SELECT * FROM course_instructor;';

	//let list= {}
	//let instructor= await db.all(sql_query_instructor);
	//let course= await db.all(sql_query_course);
	//let cInstructor= await db.all(sql_query_cInstructor);

	//list=[instructor,course,cInstructor]
	//letss goo yess

	//res.json(list)


});

app.post('/newSection', async (req,res) => {
	//const result= await db.run('INSERT INTO course_instructor(id,course_id,instructor_id) VALUES(?,?,?)', [req.body.id,req.body.course_id, req.body.instructor_id]);
	
	
	//if(result.changes==0)
	//	res.json({'status': 'NONE'});
	//else
	//	res.json({'status': 'OK', "lastID": result.lastID});

});

app.post('/changeSectionInstructor', async (req,res) => { ///////////////////////////////
	//const result= await db.run('UPDATE course_instructor SET instructor_id=? WHERE id=?', [req.body.instructor_id, req.body.id]);
	
	
//	if(result.changes==0)
	//	res.json({'status': 'NONE'});
	//else
	//	res.json({'status': 'OK', "lastID": result.lastID});

});

app.post('/removeSection', async (req,res) => { ////////////////////
	//const result= await db.run('DELETE FROM course_instructor where id=?', [req.body.id]);
	
	
	//if(result.changes==0)
	//	res.json({'status': 'NONE'});
	//else
	//	res.json({'status': 'OK', "lastID": result.lastID});

});


app.post('/newCourse', async (req,res) => {
	//const result= await db.run('INSERT INTO course(id,name) VALUES(?,?)', [req.body.id,req.body.name]);
	
	//if(result.changes==0)
	//	res.json({'status': 'NONE'});
	//else
	//	res.json({'status': 'OK', "lastID": result.lastID});

});


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
