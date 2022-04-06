import {Person} from "./Person.mjs";


class PersonService{
	constructor(data){ 
		this.array = new Array();
		this.db = {};
	}

	static async create(){ 
		return new PersonService();
	}

	async addPerson(anObject){
		let newPerson;
		try{
  			newPerson = new Person(anObject);
		}catch(err){
			throw err; //throwing an error inside a Promise
		}
		this.array.push(newPerson);
		return `added person of id ${newPerson.id}`;
	}

	//from PUT
	async replacePerson(id, anObject){
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the given Object is a Person
			if(Person.isPerson(anObject)){
				/// Just replace it already!
				this.array.splice(index,1,anObject);
				return "Done REPLACING";
			}
			throw new Error(`given object is not a Person : ${anObject}`);
		}
		throw new Error(`cannot find person of id ${id}`);
	}

	//from PATCH
	async updatePerson(id, anObject){
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the fields of the given Object are from a Person
			for(let property in anObject){
				if(!Person.isValidProperty(property,anObject[property])){
					throw new Error(`given property is not a valid Person property : ${anObject}`);	
				}
			}
			//At this point, we are sure that all properties are valid and that we can make the update.
			for(let property in anObject){
				(this.array)[index][property] = anObject[property];
			}
			return "Done UPDATING";
		}
		throw new Error(`cannot find person of id ${id}`);
	}

	async removePerson(id){
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			this.array.splice(index,1);
			return `removed person of id ${id}`;
		}
		throw new Error(`cannot find person of id ${id}`);
		
	}

	getPerson(id){
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			return  (this.array)[index];
		}
		throw new Error(`cannot find person of id ${id}`);	
	}

	getPersons(){
		return this.array;
	}

}

export {PersonService}