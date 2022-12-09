const {mongoClient, ObjectId} = require('mongodb');

let obj = new ObjectId(); // 유니크한 새로운 객체 생성
console.log(obj);


let user = {
    name: "Yuliya",
    age: 34,
    location: "Hong Kong"
};
let {name} = user;
console.log(name);
