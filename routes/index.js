var express = require('express');
const passport = require('passport');
var router = express.Router();
var usermodel=require("./users")

const ls=require("passport-local");
passport.use(new ls(usermodel.authenticate()));



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
  // res.send("hello")
});
router.get('/login', function(req, res, next) {
  res.render("login");
  // res.send("hello")
});

router.get("/read",isloggedin,function(req,res){
  usermodel.find().then(function(carduser){
res.render("read",{carduser})
  })

})
router.get("/likes/:id",function(req,res){
  usermodel.findOne({_id:req.params.id}).then(function(userlike){
    if(userlike.likes.indexOf(userlike._id)===-1){
      userlike.likes.push(userlike._id);
    }
    else{
      userlike.likes.splice(userlike.likes.indexOf(userlike._id),1);
    }
    userlike.save().then(function(){
      res.redirect("/read")
    })
   
  }) 
})
// router.post("/formcreate",function(req,res){
//   usermodel.create({
//     username:req.body.username,
//     email:req.body.email,
//     password:req.body.password,
//     photo:req.body.photo
//   }).then(function(creteduser){
//     res.send(creteduser)
//   })
// })

router.get("/edit/:id",function(req,res){
  // isse jis user ke edit button pr click hua wo pta chl gya
  usermodel.findOne({username:req.session.passport.user}).then(function(user){
    // or us user ki info sb edit page me send ho  jayegyi
    res.render("edit", {user});
    // ab ye user ki info sb edit page me use kr skte h wo empty text field me
  })
})
router.post('/update', function(req,res){
  usermodel.findOneAndUpdate({username:req.session.passport.user},{username: req.body.username,email: req.body.email ,photo:req.body.photo}).then(function(){
    res.redirect('/read');
  })
})
router.get('/delete', function(req,res){
  usermodel.findOneAndDelete({username:req.session.passport.user}).then(function(){
    res.redirect('/read');
  })
})

// findOneAndUpdate({1},{2})
// 1 ==> jisko find krna h
// 2 ==> jo info update krni h wo

//authentication and autherization

//start

router.post("/register",function(req,res,next){
  var kuchv=new usermodel({
    username:req.body.username,
    email:req.body.email,
    photo:req.body.photo
  })
  usermodel.register( kuchv,req.body.password).then(function(createduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/read")
    })
  }) 
})
router.post("/login",passport.authenticate("local",{
  successRedirect:"/read",
  failureRedirect:"/loginfailed"
}),function(req,res,next){})


router.get("/loginfailed",function(req,res,next){
  res.render("loginfailed")
})

function isloggedin(req,res,next){
  if(req.isAuthenticated()){
    return next();

  }else{
    res.redirect("/login")
  }
}

router.get("/logout",function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})

//end




module.exports = router;
