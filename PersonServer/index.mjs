import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


import {PersonService} from "./model/PersonService_LowDbImpl.mjs";
//import {PersonService} from "./model/PersonService_ArrayImpl.mjs";

let personServiceInstance;

const app = express();

//// Enable ALL CORS request
app.use(cors())
////


const port = 3002

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

app.get('/', (req, res)=>{
	console.log("GET / : reached");
	try{
		let myArrayOfPersons;
		if( undefined == (myArrayOfPersons = personServiceInstance.getPersons() )){
			throw new Error("No persons to get");
		}
		res.status(200).json(myArrayOfPersons);
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
});

//End point to get a person
app.get('/:idddd', (req, res)=>{
	let id = req.params.idddd;
	if(!isInt(id)) {
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		try{
			let myPerson = personServiceInstance.getPerson(id);
			res.status(200).json(myPerson);
		}
		catch(err){
			console.log(`Error ${err} thrown... stack is : ${err.stack}`);
			res.status(404).send('NOT FOUND');
		}
	}
});

app.delete('/:id',(req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		personServiceInstance
			.removePerson(id)
			.then((returnString)=>{
				console.log(returnString);
				res.status(201).send('All is OK');
			})
			.catch((err)=>{
				console.log(`Error ${err} thrown... stack is : ${err.stack}`);
				res.status(400).send('BAD REQUEST');
			});	
	}	
});

//create a new person (POST HTTP method)
app.post('/',(req,res)=>{
	let thePersonToAdd = req.body;
	personServiceInstance
		.addPerson(thePersonToAdd) 
		.then((returnString)=>{
			console.log(returnString);
			res.status(201).send('All is OK');
		})
		.catch((err)=>{
			console.log(`Error ${err} thrown... stack is : ${err.stack}`);
			res.status(400).send('BAD REQUEST');
		});	
});

app.patch('/:id',(req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		let newValues = req.body; //the client is responsible for formating its request with proper syntax.
		personServiceInstance
			.updatePerson(id, newValues)
			.then((returnString)=>{
				console.log(returnString);
				res.status(201).send('All is OK');
			})
			.catch((err)=>{
				console.log(`Error ${err} thrown... stack is : ${err.stack}`);
				res.status(400).send('BAD REQUEST');
			});	
	}	
});

app.put('/:id',(req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		let newValues = req.body; //the client is responsible for formating its request with proper syntax.
		personServiceInstance
			.replacePerson(id, newValues)
			.then((returnString)=>{
				console.log(returnString);
				res.status(201).send('All is OK');
			})
			.catch((err)=>{
				console.log(`Error ${err} thrown... stack is : ${err.stack}`);
				res.status(400).send('BAD REQUEST');
			});	
	}	
});



PersonService.create().then(ts=>{
	personServiceInstance=ts;
	personServiceInstance
		.addPerson({"login":"Curtis NEWTON"})
		.catch((err)=>{console.log(err);});
	app.listen(port, () => {
  		console.log(`Person service is listening at http://localhost:${port}`)
	});
});


function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

