import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import {BotService} from "./model/BotService_LowDbImpl.mjs";
//import {BotService} from "./model/BotService_ArrayImpl.mjs";
let botServiceInstance;

import {PersonIdentifier,PersonService} from "./model/Persons.mjs";
let personServiceAccessPoint = new PersonService({url:"http://localhost",port:3002});
//Question : How do I assigne a task to a person? : It is a PATCH to a Task...

const app = express();


//// Enable ALL CORS request
app.use(cors())
////


const port = 3001

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 


app.get('/persons/', async (req, res) => {
	// Call person server to retrieve all persons
	let personsArray = await getAllPersons();
	res.status(200).json(personsArray);
})

app.get('/bots/', (req, res)=>{
	try{
		let myArrayOfBots;
		if( undefined == (myArrayOfBots = botServiceInstance.getBots() )){
			throw new Error("No bots to get");
		}
		res.status(200).json(myArrayOfBots);
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
});

//End point to get a task
app.get('/bots/:idddd', (req, res)=>{
	let id = req.params.idddd;
	if(!isInt(id)) {
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		try{
			let myBot = botServiceInstance.getBot(id);
			res.status(200).json(myBot);
		}
		catch(err){
			console.log(`Error ${err} thrown... stack is : ${err.stack}`);
			res.status(404).send('NOT FOUND');
		}
	}
});

//End point to get a word
app.post('/bots/word', (req, res)=>{
	let text = req.body.texte;
	console.log(text);
	try{
		res.status(200).json(text);
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
});

app.delete('/bots/:id',(req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		botServiceInstance
			.removeBot(id)
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


//create a new task (POST HTTP method)
app.post('/bots/',(req,res)=>{
	let theBotToAdd = req.body;
	botServiceInstance
		.addBots(theBotToAdd) 
		.then((returnString)=>{
			console.log(returnString);
			res.status(201).send('All is OK');
		})
		.catch((err)=>{
			console.log(`Error ${err} thrown... stack is : ${err.stack}`);
			res.status(400).send('BAD REQUEST');
		});	
});

app.patch('/bots/:id',(req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		let newValues = req.body; //the client is responsible for formating its request with proper syntax.
		botServiceInstance
			.updateBot(id, newValues)
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

app.patch('/bots/:idddd', async (req, res) =>{
/* #TODO
	try{
		let personID = req.body.personID;
		botServiceInstance.updateTask(id);
	}
	catch{

	}*/
});

app.put('/bots/:id',(req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		let newValues = req.body; //the client is responsible for formating its request with proper syntax.
		botServiceInstance
			.replaceBot(id, newValues)
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


let id = Math.floor(Math.random() * Math.floor(100000)) ;
let randomPerson = await getRandomPerson();
let aBot ={ //UGLY
	'id':id,
	'title':'Random Title',
	'assignement':randomPerson
};

BotService.create(personServiceAccessPoint).then(ts=>{
	botServiceInstance=ts;
	botServiceInstance
		.addBots(aBot)
		.catch((err)=>{console.log(err);});
	app.listen(port, () => {
  		console.log(`Example app listening at http://localhost:${port}`)
	});
});

//HELPER
async function getRandomPerson(){
	let tempArray = await personServiceAccessPoint.getAllPersons();
	let key = Math.floor(Math.random() * tempArray.length) ;
	return tempArray[key];
}

async function getAllPersons(){
	return await personServiceAccessPoint.getAllPersons();
}

async function getAPerson(id){
	return await personServiceAccessPoint.getPersonById(id);
}

function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}


