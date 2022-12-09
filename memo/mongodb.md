

삭제하는 방법은 세 가지가 있다.
### 1) deleteMany
### 2) deleteOne
### 3) findOneAndDelete
그럼 deleteOne과 findOneAndDelete 의 차이점은 무엇일까? deleteOne은 찾아서 하나를 지우는 것이다. 무엇이 지워질지 어떠한 순서로 들어가있는지 모르는 상태에서 단순히 하나가 지워지게 된다.
findOneAndDelete 는 sort과 filtering이 가능하며, 이를 통해서 원하는 곳에서 하나를 찾아서 지울 수 있게 된다. 그렇기 때문에 deleteOne보다는 findOneAndDelete를 항상 쓰는 것을 추천한다.

```javascript
const MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/TodoApp';

//parameter: url, callback function
MongoClient.connect(url, (err, db)=>{
    if (err) {
        return console.log('Unable to connect to MongoDB server', err);
    }
    console.log('Connected to MongoDB server');
    const mydb = db.db('TodoApp');

    //deleteMany
    mydb.collection('Todos').deleteMany({
        text: "Eat bab1"
    }).then((res)=>{
        console.log(res.result);
    }, (err)=>{
        if(err) console.log(err);
    });

    //deleteOne
    mydb.collection('Todos').deleteOne({
        text: "Eat bab1"
    }).then((res)=>{
        console.log(res.result);
    }, (err)=>{
        if(err) console.log(err);
    });

    //findOneAndDelete
    mydb.collection('Todos').findOneAndDelete({
        text: "Eat bab1"
    }).then((res)=>{
        console.log(res.result);
    }, (err)=>{
        if(err) console.log(err);
    });

    db.close();
});
```
지우는 방식은 find 찾는 방식과 거의 비슷하다. find는 필터를 통해서 찾는 것이고, delete는 필터를 통해서 찾아서 지우는 것이라고 볼 수 있다.