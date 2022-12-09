# 왜 24개의 문자열.
문자2개->256가지(2^8=16^2=256)
16진수 2글자(=16^2=2^8=256)
16진수 문자 2개로 256가지 표현(8비트)

12byte의 값이 헥사형태 로 표현된 것입니다
1byte는 8bit죠, 총 12byte를 헥사로 표현할때 24개의 문자열로 표현이 되는것이지요

4바이트는 유닉스 타임스탬프
5바이트는 프로세스별로 한번 생성되는 랜덤한 값
3바이트는 자동증가하는카운터

```javascript
const {mongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID(); // 유니크한 새로운 객체 생성
console.log(obj);


var user = {
    name: "Yuliya",
    age: 34,
    location: "Hong Kong"

var {name} = user;

};
```
