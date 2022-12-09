const router = require('express').Router();

// mypage 접속 전 미들웨어로 처리
// ** 개발자도구->세션 삭제 후, 테스트
// 
function 로그인했니(req, res, next){
    if (req.user){ // 세션 생성되면, req.user 항상 있음(Deserialize)
        next()
    } else {
        // res.send('로그인 안하셨는데요?')
        res.redirect('/login')
    }
}


//FIXME: 방법2 : 모든 URL 에 미들웨어 적용하기.
router.use(로그인했니)
//FIXME: 방법3 : 특정 /라우트만 미들웨어 적용.
// router.use('/shirts', 로그인했니)

router.get('/sports', function(요청, 응답){
    응답.send('스포츠 게시판');
});

router.get('/game', function(요청, 응답){
    응답.send('게임 게시판');
}); 
//TODO: 방법1: 라우트를 모으면, '로그인했니' 같은 미들웨어 사용 easy
// router.get('/sports',로그인했니, function(요청, 응답){
//     응답.send('스포츠 게시판');
//  });
 
//  router.get('/game',로그인했니, function(요청, 응답){
//     응답.send('게임 게시판');
//  }); 


 module.exports = router;