
# apple_nodejs

# .env
DB_URL = mongodb+srv://아이디:비번@cluster0.4xfvd85.mongodb.net/shop
PORT = 8080
# 몽구스 사용X 몽고클라이언트 접속.
```javascript
let db; // 페이지 전체에서 쓸 수 있는 전역 변수
MongoClient.connect(process.env.DB_URL, (error, client) => {
        // 1-1 DB 선택
        if (error) return console.log(error);
        db = client.db('todoapp');
        app.listen(process.env.PORT, () => {
            console.log('listening on 8080');
        });
    });
```
# 몽고 db 조작
```
// 1-2 DB 조작. collection=테이블
// db.collection('post').insertOne({이름: 'John', _id : 1}, (error, result)=>{
//     console.log('insertOne 완료');
// });
// 0. 서버 가동
```
Error: listen EADDRINUSE: address already 에러

sudo lsof -i :8080
sudo kill -9 pid값