const express = require('express');
const app = express();
// Express 4.16 이상은 body-parser포함
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs'); // res.render('list.ejs')
app.use('/public', express.static('public'))
//(폼에서 PUT, DELETE 요청 가능케함) npm install method-override 
// <form action="/edit?_method=PUT" method="POST">
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
// 로그인
// npm install passport passport-local express-session
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
// passport 가 제공하는 미들웨어
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
// process.env.DB_URL / PORT
require('dotenv').config()
// TODO: routes : 미들웨어. 전역으로 사용. ** app.get('/', 미들펑션, (req, res)=>{})
 //FIXME: shop에 라우트를 모음->미들웨어 easy-> 로그인했니 같은 함수
 app.use('/shop', require('./routes/shop.js') );
 app.use('/board/sub', require('./routes/board.js'));
 //routes export + const router = require('express').Router(); 
const router = express.Router();
//FIXME: 2022/12/08 (목)-05:50  
const multer = require('multer');
//FIXME: 2022/12/08 (목)-09:50
const { ObjectId } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;
// 설정변수
var storage = multer.diskStorage({

  destination : function(req, file, cb){
    cb(null, './public/image')
  },
  filename : function(req, file, cb){
    cb(null, file.originalname )
  }
})

var path = require('path');
// storage 설정변수
var upload = multer({storage:storage});
// FIXME: 업로드 제한 설정: 필드오류가 생겼었다...2022/12/08 (목)-04:02
// var upload = multer({
//     storage: storage,
//     fileFilter: function (req, file, callback) {
//         var ext = path.extname(file.originalname);
//         if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
//             return callback(new Error('PNG, JPG만 업로드하세요'))
//         }
//         callback(null, true)
//     },
//     limits:{
//         fileSize: 10240 * 10240
//     }
// });

app.get('/upload', function(요청, 응답){
    응답.render('upload.ejs')
});
app.post('/upload', upload.single('up_field'), function(요청, 응답){
    응답.send('업로드완료') // 업로드 하면서, db 에 작성자, 날짜, 이미지id등 필요.
  });
// TODO: 이미지 서버
app.get('/image/:imageName', function(요청, 응답){
응답.sendFile( __dirname + '/public/image/' + 요청.params.imageName )
})


// var db;
let db; // 페이지 전체에서 쓸 수 있는 전역 변수
MongoClient.connect(process.env.DB_URL, (error, client) => {
        // 1-1 DB 선택
        if (error) return console.log(error);
        db = client.db('todoapp');
        // 1-2 DB 조작. collection=테이블
        // db.collection('post').insertOne({이름: 'John', _id : 1}, (error, result)=>{
        //     console.log('insertOne 완료');
        // });
        // 0. 서버 가동
        app.listen(process.env.PORT, () => {
            console.log('listening on 8080');
        });
    });

    app.get('/', (req, res)=>{
        // res.sendFile(__dirname+'/index.html')
        // '/' 없
        res.render('index.ejs', {data:'ejs로'})
    });

    // list
    // findeOne(조건, (e, d)=>{})
    // find().toArray(e, d)=>{res.render};
    //FIXME: skip((page-1)*2) -> 최신순으로 한 페이지당 2개씩
    //TODO: page: 전체 페이지수, page10 - 1 이면 9 page 출력. * 2는 한페이지당 레코드(글)수. skip 은 생략할 데이터 수.
    app.get('/list', (req,res)=>{
        db.collection('post').find().sort({"_id": -1}).limit(20).toArray((error, data)=>{
            if (error) {console.log(error)}
            //FIXME: join으로 login컬렉션에서 login을 함께 넣으려면?
            res.render('list.ejs', {posts: data, user: req.user})
            // console.log(data);
        });        
    })

  
    // detail/1 로 접속시,
    app.get('/detail/:id', (req, res)=>{
        db.collection('post').findOne({_id : parseInt(req.params.id)}, (error, query)=>{
            console.log("detail/:id->params.id로 조회한 값", query);
            res.render('detail.ejs', {posts: query}); // data에 담아서 render
        })
    });
    app.get('/login',(req, res)=>{
        res.render('login.ejs')
})
// 1 단계: app.post('/login',, (req, res)=>{});
// 2 단계 : passport라이브러리로 인증 요청 넣기.
app.post('/login', passport.authenticate('local', {failureRedirect : '/fail'}),(req, res)=>{
    res.redirect('/mypage')
});

// mypage : 로그인했는지 검사하는 미들웨어 만들기.
app.get('/mypage', 로그인했니, (req, res)=>{
    console.log(req.user); // <-- deserialize 찾은 정보 req.user
    //TODO: mypage 커스텀
    db.collection('post').find({작성자:req.user._id}).toArray((error, data)=>{
        if (error) {console.log(error)}
        console.log('mypage_내가 쓴 글은? ', data);
        res.render('mypage.ejs', {user: req.user, posts: data})
    })
});
// mypage 접속 전 미들웨어로 처리
// ** 개발자도구->세션 삭제 후, 테스트
function 로그인했니(req, res, next){
    if (req.user){ // 세션 생성되면, req.user 항상 있음(Deserialize)
        next()
    } else {
        // res.send('로그인 안하셨는데요?')
        res.redirect('/login')
    }
}
// 3 단계: 어떻게 인증할건지 검사하는 코드. 복붙으로 쓰자.
passport.use(new LocalStrategy({
    usernameField: 'id', // 폼에서 전송받은 body.id-> 입력한아이디
    passwordField: 'pw', // -> 입력한비번
    session: true, // 세션 사용 여부. 당연히 true
    passReqToCallback: false,
    // 4 단계: DB 와 비교! 핵심!
}, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
    // null: 서버에러
    // false: 
    if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
      // id 가 폼 id와 일치하면,
      if (입력한비번 == 결과.pw) { 
          return done(null, 결과) // 세션데이터를 만들고, id정보로 쿠키에 저장
      } else {
        return done(null, false, { message: '비번틀렸어요' })
    }
    })
  }));
  
  // 5 단계: 세션에 등록-유지하고, 로그인 유지하기
  // serializeUser 와 deserializeUser
  // 1) user 로 세션을 만들어서, user.id 에 저장. --> deserializeUser((아이디))->req.user
  passport.serializeUser((user, done)=>{
    done(null, user.id)
  });

  // 이 세션 데이터를 가진 사람을 불러와주셈. mypage
  // user.id->아이디->req.user
  //db에서 user.id로 유저를 찾은 , 유저 정보를 넣음
  passport.deserializeUser((아이디, done)=>{ //아이디<--user.id
    db.collection('login').findOne({id:아이디}, (error, result)=>{
        done(null, result)
    })
  });
  
  app.get('/search', (req, res)=>{
      console.log(req.query); // list 에서 전송받은 검색어 req.query
    // 전부 다 검색 -> index 사용으로 변경
    // db.collection('post').find({title:req.query.value}).toArray((error, result)=>{
        db.collection('post').find({title:req.query.value}).toArray((error, result)=>{
        console.log(result); //[ { _id: 83, title: 'test', date: 'test' } ]
        console.log(result[0]);
        //응답 안해주면, 클라이언트는 대기. 멈춘다.
        res.render('search.ejs', {posts: result[0]})
    })
  });

app.post('/register', (req,res)=>{
    db.collection('login').insertOne({id:req.body.id, pw: req.body.pw}, (error, result)=>{
        res.redirect('/login')
    })
} );

app.get('/write', (req, res)=>{
    // res.sendFile(__dirname + '/write.html')
    res.render('write.ejs')
});
// TODO: add- req.user._id
app.post('/add', (req, res) => {
    console.log('req.user', req.user);
    // res.send("res.send안보내면, 무한로딩200")
    res.redirect('/list')
    // 1 카운터 가져오기
    // 2. 카운터의 칼럼값+body로 입력하기.
    // 3. 삽입 후, counter에 + 1 해주기.
    // :todo console.log(req);
    // form에 담긴 값... 히든폼으로 req.body.name. req.user??
    db.collection('counter').findOne({name:'게시물갯수'},(error,결과)=>{
        // console.log(결과);
        let totalPost = 결과.totalPost;
        // TODO: 로그인한 req.user 활용 ======= 로그인 안했으면? 오류
        db.collection('post').insertOne({작성자: req.user._id, _id: totalPost + 1, title: req.body.title , date: req.body.date },(e, 결과)=>{
            if (e) { console.log(e)}
        }); 
        console.log("req.user._id: ", req.user.id, req.user,req.user_id,req.user.pw)
   
        db.collection('counter').updateOne({name: '게시물갯수'},{$inc:{totalPost:1}},(error,결과)=>{
            console.log('$inc: 오퍼레이터 사용.updateOne완료')
        });
        db.collection('counter').findOne({name:'게시물갯수'},(e,결과)=>{
            console.log(`업데이트된 counter: ${결과.totalPost}`)
            // db.collection('post').find().toArray((e,d)=>{
            //     console.log(`${d[0]}`)
            // });
        });
    })
    });

    // 1. 인덱스가 있는 counter에서, name이 게시물갯수인 것 가져오기(findOne)-> data.totalPost로 사용
    // 2. InsertOne : 카운터 테이블의 게시물갯수와 폼에서 받은 body.data 이용.
    // 3. updateOne : counter: totalPost 업데이트( + 1) : updateOne({키:값}, {$오퍼레이터 : {키:오퍼값}}, ()=>{});
// 오퍼레이터 : $set: $inc:
  // list.ejs에서 ajax delete 요청. data : {_id: 1} --> req.body,  
  // ajax 요청시, _id : 1 이 문자로 전달->숫자변환
app.delete('/delete', (req, res)=>{
    console.log('삭제 요청', req.body);
    // TODO: req.user 의 위엄!!!!
    console.log('세션 정보', req.user, req.user._id, req.user.pw)
    // res.send('delete')
    req.body._id = parseInt(req.body._id);
    // FIXME: 저장된 id 와 로그인 세션 req.user._id 가 일치해야만 
    var 삭제할데이터 = {_id: req.body._id, 작성자: req.user._id}
    // db.collection('post').deleteOne({_id : 2}, ()=>{})
    db.collection('post').deleteOne(삭제할데이터, (error, data)=>{
        // 서버에서 status 응답 해줘야함 -> .done() .fail() 실행
        console.log('삭제 완료')
        res.status(200).send({message : '성공했어요'}); 
        // res.status(400).send({message : '실패'});
        if (error) {console.log('삭제 실패하면:::: 에러메세지 보여주셈:::', error)} 
        console.log(data); // { acknowledged: true, deletedCount: 0 } < int X -> 삭제 실패
    }) //
});
    
// FIXME: 저장된 id 와 req.user._id 가 일치해야만 
// 글 수정
app.get('/edit/:id', (req, res)=>{
    console.log(req.params.id);
    // TODO: post 에 작성자는 user테이블의 고유한 req.user._id 데이터가 저장됨. user.id는 test 처럼 username 이 저장돼있음.
    db.collection('post').findOne({_id : parseInt(req.params.id), 작성자 : req.user._id}, (error, result)=>{
        res.render('edit.ejs', {data:result})
    })
});
//******put****글 수정-update
app.put('/update', (req, res)=>{
    let id = req.body;
    console.log(id);
    db.collection('post').updateOne({_id: parseInt(req.body.id)},{$set: {title:req.body.title, date: req.body.date }},(error, result)=>{
    res.redirect('/list')
    });
});

//TODO: 미들웨어 app.use('/', require('./routes/shop......))
//shop.js --> module.exports = router(변수명)
//전역 미들웨어 app.use('/', require('./routes/shop.js') );

// app.get('/shop/shirts', (req, res)=>{
//     res.send('셔츠 가게')
// });

// app.get('/shop/pants', (req, res)=>{
//     res.send('pants 가게')
// });
//FIXME: 2022/12/08 (목)-09:13 ajax로 요청. POST
// TODO: member 에 배열로 [body글작성자(login._id)와 내 _id(req.user._id) 를 저장]
app.post('/chatroom', function(요청, 응답){
    let with_id=요청.body.당한사람id;
    console.log('요청.body.당한사람id : ', with_id);
    console.log('ObjectId(with_id) : ', ObjectId(with_id));

    db.collection('login').find({'_id':ObjectId(with_id)}).toArray().then((결과)=>{
       console.log('with_id로 조회(결과가 배열에 담김) : ', 결과);
       var 저장할거 = {
           title : `${결과[0].id} 님과의 대화`,
           member : [ObjectId(요청.body.당한사람id), 요청.user._id],
           date : new Date()
        }
        db.collection('chatroom').insertOne(저장할거).then(function(결과){
          응답.send('저장완료')
        });
    });
    
  });

app.get('/chat', 로그인했니, function(요청, 응답){ 
    //TODO: chatroom { member: Array {0:ObjectId(), 1:_____}}
    // 요청.user._id(현재 세션 login 컬렉션의 _id 와 같은 chatroom)
    db.collection('chatroom').find({ member : 요청.user._id }).toArray().then((결과)=>{
        console.log('chat/ 결과[0]', 결과[0]);    
        응답.render('chat.ejs', {data : 결과, user : 요청})
        // 결국, data.member 는 요청.user._id 와 동일한 값을 갖는다.
    })
}); 

app.post('/message', 로그인했니, function(요청, 응답){
    var 저장할거 = {
        parent : 요청.body.parent, // 채팅방 게시물
        content : 요청.body.content,
        userid : 요청.user._id,
        date: new Date(),
    }
    db.collection('message').insertOne(저장할거).then(()=>{
        console.log('성공');
        응답.send('채팅 저장할거 DB 저장 성공')
    })
});

app.get('/aggre', (req, res)=>{
    // db.collection('post').find().toArray().then((결과)=>{
    //     console.log('애그리게이션. 룩업. 아우터 조인')
    //find() 대신---> aggregate()사용
   db.collection('post').aggregate([
        // { $addFields: { username: "$작성자" } },
        {
          $lookup: {
            from: "login", // 조인할 컬렉션
            localField: "작성자", // 현재 post컬렉션에서 비교할 key값
            foreignField: "_id", // 조인할 컬렉션에서 비교할 키값
            as: "postInfo",
          },
        },
        { $unwind: "$postInfo" }, // [{}]배열 분리postInfo[0].username->
        // {
        //   $project: { // 조인 데이터중 필요한 필드만 사용시.
        //     product_id: 1,
        //     description: 1,
        //     title: "$productInfo.title",
        //     category: "$productInfo.category",
        //   },
        // },
      ]).toArray().then((result)=>{
        res.render('aggre.ejs', {posts: result, user: req.user})
        console.log(result)
        // .toArray((error, data)=>{
        //     if (error) {console.log(error)}
        //     res.render('list.ejs', {posts: data, user: req.user})
      })
      
      });

