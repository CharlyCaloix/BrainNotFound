import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import RiveScript from 'rivescript';

import {BotService} from "./model/BotService_LowDbImpl.mjs";
//import {BotService} from "./model/BotService_ArrayImpl.mjs";
let botServiceInstance;

const app = express();

//// Enable ALL CORS request
app.use(cors())
////

// Definition d'un utilisateur éventuel : inutilisé pour l'instant
// let mainUser = "local-user";

// bot 1
let mainBot = new RiveScript();
mainBot.loadFile("./../client/brains/baseBrain.rive").then(botLoaded).catch(botLoadingFailed);

// bot 2
let secondaryBot = new RiveScript();
secondaryBot.loadFile("./../client/brains/secondBrain.rive").then(bot2Loaded).catch(bot2LoadingFailed);



const port = 3001

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

app.get('/', (req, res)=>{
    try{
        res.sendFile('/client/index.html', { root: './..' })
    }
    catch(err){
        console.log(`Error ${err} thrown`);
        res.status(404).send('NOT FOUND');
    }
});

// End point pour obtenir tous les bots
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

//End point to get a bot in particular, of id  ":idddd" (GET method)
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

//End point to get an answer from baseBot
app.post('/example', async (req, res)=>{ // TODO

	let question = req.body.input;
	console.log("Question reçue par le serveur (bot 1): "+question);
	try{
		//let reponse = await mainBot.reply(mainUser, question);
		//let reponse = await secondaryBot.reply(mainUser, question);
		let reponse = await mainBot.reply(mainUser, question);
		console.log("Réponse du serveur : "+reponse);
		res.status(200).json(reponse);
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
});

//End point to get an answer from 2nd bot
app.post('/example2', async (req, res)=>{ // TODO

	let question = req.body.input;
	console.log("Question reçue par le serveur (bot 2): "+question);
	try{
		//let reponse = await mainBot.reply(mainUser, question);
		//let reponse = await secondaryBot.reply(mainUser, question);
		let reponse = await secondaryBot.reply(mainUser, question);
		console.log("Réponse du serveur : "+reponse);
		res.status(200).json(reponse);
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
});

// End point to delete a bot of a particular ID
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


// End point to create a new bot (POST method)
app.post('/bots/',(req,res)=>{
	let theBotToAdd = req.body;
	console.log(theBotToAdd);
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

// End point to modify a bot
app.patch('/bots/:id',(req,res)=>{
	let id = req.params.id;
	let botToPatch = req.body;

	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		botServiceInstance
			.updateBot(id, botToPatch)
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

// PUT endpoint, not used yet. Replaces an object with another.
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


BotService.create().then(ts=>{
	botServiceInstance=ts;
	app.listen(port, () => {
  		console.log(`Example app listening at http://localhost:${port}`)
	});
});

//BOT functions
function botLoaded(){
	console.log("Chatbot 1 is ready to play with.");
	mainBot.sortReplies();
}

function botLoadingFailed(){
	console.log("Chatbot 1 failed loading.");
}

function bot2Loaded(){
	console.log("Chatbot 2 is ready to play with.");
	secondaryBot.sortReplies();
}

function bot2LoadingFailed(){
	console.log("Chatbot 2 failed loading.");
}
// ---------------------------------------------
function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}


