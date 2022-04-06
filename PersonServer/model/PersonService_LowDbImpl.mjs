import {Person} from "./Person.mjs";
import {Low, JSONFile} from 'lowdb';


class PersonService{
	constructor(data){ 
		this.db = {};
	}

	static async create(){ //since I cannot return a promise in a constructor
		const service = new PersonService();
		const adapter = new JSONFile("./model/db.json");
		service.db = new Low(adapter);
		await service.db.read();
		service.db.data = service.db.data || { persons: [] } //if db is null, create it.
		return service;
	}


	async addPerson(anObject){
		let newPerson;
		try{
  			newPerson = new Person(anObject);
		}catch(err){
			throw err; //throwing an error inside a Promise
		}
		this.db.data.persons.push(newPerson);
		await this.db.write();
		return `added person of id ${newPerson.id}`;
	}


	//from PUT
	async replacePerson(id, anObject){
		let index = this.db.data.persons.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the given Object is a Person
			if(Person.isPerson(anObject)){
				/// Just replace it already!
				this.db.data.persons.splice(index,1,anObject);
				await this.db.write();
				return "Done REPLACING";
			}
			throw new Error(`given object is not a Person : ${anObject}`);
		}
		throw new Error(`cannot find person of id ${id}`);
	}

	//from PATCH
	async updatePerson(id, anObject){
		let index = this.db.data.persons.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the fields of the given Object are from a Person
			for(let property in anObject){
				if(!Person.isValidProperty(property,anObject[property])){
					throw new Error(`given property is not a valid Person property : ${anObject}`);	
				}
			}
			//At this point, we are sure that all properties are valid and that we can make the update.
			for(let property in anObject){
				(this.db.data.persons)[index][property] = anObject[property];
			}
			await this.db.write();
			return "Done UPDATING";
		}
		throw new Error(`cannot find person of id ${id}`);
	}


	async removePerson(id){
		let index = this.db.data.persons.findIndex(e=> e.id == id);
		if(index >-1 ){
			this.db.data.persons.splice(index,1);
			await this.db.write();
			return `removed person of id ${id}`;
		}
		throw new Error(`cannot find person of id ${id}`);
	}

	getPerson(id){
		let index = this.db.data.persons.findIndex(e=> e.id == id);
		if(index >-1 ){
			return  (this.db.data.persons)[index];
		}
		throw new Error(`cannot find person of id ${id}`);	
	}

	getPersons(){
		console.log(`Asking for all Persons`);
		return this.db.data.persons;
	}

}

export {PersonService}