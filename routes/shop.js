const router = require('express').Router();
//TODO: 미들웨어 app.use('/', require('./routes/shop......))
//shop.js --> module.exports = router(변수명)
//전역 미들웨어 app.use('/', require('./routes/shop.js') );
// FIXME: 
// app.get -> router.get
router.get('/shirts', (req, res)=>{
    res.send('셔츠 가게')
});

router.get('/pants', (req, res)=>{
    res.send('pants 가게')
});

module.exports = router;