import {PersonIdentifier} from "./Persons.mjs";

class Bot{
  
  static id = this.id;
  static name = this.name;
  static startDate  = this.startDate;
  static pathToFile  = this.pathToFile;
  static tags = this.tags;
  static comment = this.comment;
  static discord_status=this.discord_status;
  static socket_status=this.socket_status;


  constructor(data){   //id, name, startDate, pathToFile

    if(undefined != data.id) {
      if(!isInt(data.id)){
        throw new Error("Task Creation : passed Id is not an integer");
      }
      this.id = parseInt(data.id);
    } else {
      this.id = parseInt(    Math.floor(Math.random() * Math.floor(100000))     );
    }

    if(undefined != data.name) {
      if(!isString(data.name)){
        throw new Error("Task Creation : passed Title is not a string");
      }
      this.name = data.name;
    } else {
      this.name = "Another Mark";
    }

    if(undefined != data.startDate) {
      if(!isDate(data.startDate)){
        throw new Error("Task Creation : passed startDate is not a date");
      }
      this.startDate = data.startDate;
    } else {
      this.startDate = new Date();
    }

    if(undefined != data.pathToFile) {
      if(!isString(data.pathToFile)){
        throw new Error("Task Creation : passed endDate is not a date");
      }
      this.pathToFile = data.pathToFile;
    } else {
      this.pathToFile = "/brains/baseBraine.rive";
    }

    if(undefined != data.tags) {
      if(!isArrayOfStrings(data.tags)){
        throw new Error("Task Creation : passed tags is not an array of strings");
      }
      this.tags = data.tags;
    } else {
      this.tags = new Array();
      this.tags.push("New !");
    }
  
    if(undefined != data.comment) {
      if(!isString(data.comment)){
        throw new Error("Task Creation : passed assignement is not a comment");
      }
      this.comment = data.comment;
    } else {
      // dummy Value
      this.comment = "This bot was not commented yet";
    }

    if(undefined != data.discord_status) {
      if(data.discord_status!=0 && data.discord_status!=1){ // no way to check bool status yet
        //console.log(data.discord_status);
        throw new Error("Task Creation : passed assignement is not a Socket Access value");
      }
      this.discord_status = parseInt(data.discord_status);
    } else {
      // dummy Value
      this.discord_status = 1;
    }

    if(undefined != data.socket_status) {
      if(data.socket_status!=0 && data.socket_status!=1){ // TODO
        //console.log(data.socket_status);
        throw new Error("Task Creation : passed assignement is not a Socket Access value");
      }
      this.socket_status = parseInt(data.socket_status);
    } else {
      // dummy Value
      this.socket_status = 1;
    }

  }

  static isBot(anObject){
    // check if mandatory fields are there
    let hasMandatoryProperties = Object.keys(this).every(key=> anObject.hasOwnProperty(key));
    // we should also check the property values (if are strings, etc ... as in constructor) 
    return hasMandatoryProperties;
  }

  static isValidProperty(propertyName,propertyValue) {
    if(!this.hasOwnProperty(propertyName)){
      return false;
    }
    // we should also check the property values (if are strings, etc ... as in constructor) 
    return true;
  }

}

function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

function isString(myVar) {
  return (typeof myVar === 'string' || myVar instanceof String) ;
}

function isDate (x) 
{ 
  return (null != x) && !isNaN(x) && ("undefined" !== typeof x.getDate); 
}

function isArrayOfStrings(value){
  if(!Array.isArray(value)) return false;
  for(let item of value){
    if(!isString(item)) return false;
  }
  return true;
}

export {Bot}