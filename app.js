//npm init -y
//npm i express
//npm i bcrypt jsonwebtoken cookie-parser
//npm i ejs
//npm i express-session connect-flash

//what we'll do--->
//user post likh payenge
//user create krne hai
//login and register
//logout 
//post creation
//post like
//post delete option sirf ussi ko denge joh uska owner hoga 


const express=require('express');
const app=express();
const userModel=require('./models/user');
const postModel=require('./models/post');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');

//Flash messages are temporary messages stored in the session.
//They last only for one request, and disappear after being displayed.
//Showing success messages (e.g., “Registered successfully!”) , Showing error messages (e.g., “Invalid password”)
//AUTOMATICALLY DISAPPEARED AFTER ONE RELOAD 
const session=require('express-session');
const flash=require('connect-flash');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
//add session after cookie parser always
app.use(session({
    secret:"secretkey",//this secret can be different from jwt secret key which is "shhhh" and it is recommened to make them different as hacker can't hack
    resave:true,//if we have data of user then save it
    saveUninitialized:false //if we dont have then don't save it 
}))
app.use(flash());
//making a middleware which give error and success to global access for all ejs files and in middleware we must give next with req and res
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();// YOU must call next, otherwise request stops here and won't go to next middleware or route and on running browser p circle gol gol ghoomta reh jayega
})
/*Makes flash messages available in ALL EJS files automatically

res.locals is a special object.
Anything you put in it becomes available to every EJS template without manually passing data in res.render().that is res.render("index", { success: req.flash("success") });
 */




app.get('/',(req,res)=>{
    res.render('index');
})
app.post('/register',async (req,res)=>{
    let{email,password,username,name,age}=req.body;
    let user= await userModel.findOne({email});
    if(user){
        req.flash("error", "User already exists!");
        return res.redirect("/");
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt,async function(err, hash) {
            let user=await userModel.create({
                name,
                username,
                password:hash,
                email,
                age
            })
            let token = jwt.sign({email:email,userid:user._id}, 'shhhhh');
            res.cookie("token",token);
            req.flash("success", "Logged in successfully!");//success is key/name which store value logged in successfully
            res.send("registered");
            
        });
    });
    
})

//making login page
app.get('/login',(req,res)=>{
    res.render('login');
})
app.post('/login',async(req,res)=>{
    let{email,password}=req.body;
    let user=await userModel.findOne({email});
    if(!user){
        req.flash("error","something went wrong");
        return res.redirect('/login');
    }
    bcrypt.compare(password,user.password,(err,result)=>{//password woh h joh user n daala h and user.password wo h joh DB m save h.
        if(!result){
            req.flash("error","Wrong email or password");
            return res.redirect('/login');
        }
        req.flash("success","You are logged in!");
        let token = jwt.sign({email:email,userid:user._id}, 'shhhhh');
        res.cookie("token",token);
        return res.redirect('/profile');  // IMPORTANT !!!
    })
})

//making logout page--->
app.get('/logout',(req,res)=>{ //when we write /logout in browser then our cookie get empty and we get logout
    res.cookie("token","");
    res.redirect("/login");
})


//making protected route through middleware--->
app.get('/profile',isLoggedIn,async (req,res)=>{
    //after writing /profile in route it will go to isLoggedIn middleware then execute what inside the /profile route
    
    //now we have req.user as we just passed from isLoggedIn jaha p woh tha
    console.log(req.user);//it give only email id and iat 
    //to get whole data of user we need to find from DB
    let user=await userModel.findOne({email:req.user.email}).populate("posts"); //.populate yahi lgega remember
    // Get all posts from this user
    //see posts array m post ki id's hai but we don't want to show id on ui we want to show post so we do populate so joh bhi id uske andr hogi woh saari poora content bnn jayegi uss id k andr k content so abb USER k posts array m hr index p post k content h instead of postID
    res.render('profile',{user});
})
//middleware-->
function isLoggedIn(req,res,next){
    if(req.cookies.token==""){//if there is no token cookie value then it means user is logged out 
        // res.send("you must be logged in to visit profile")
        return res.redirect("/login");
    }
    else{
        let data=jwt.verify(req.cookies.token,"shhhhh")//chekcing the token user have in cookie is matching with secret key if it is valid then we get payload data from token that is in our case--> email and _id as we gave only these two so we get only these two in data variable

        req.user=data;//sending data to req.user 

        next();//!!!important and it must execute ,whenever we make manmade middleware we must write next() through which we proceed further in other route coming forward
    } 
} 
//post tbhi hona chahiye jb ham loggedin ho mtln jb koi post krna chahega and if woh loggedIn nhi hoga toh woh redirect o jayega login page through isLoggedIn middleware-->
app.post('/post',isLoggedIn,async (req,res)=>{

    let user=await userModel.findOne({email:req.user.email});
    let post =await postModel.create({
        user:user._id,
        content:req.body.content,

    })
    
    user.posts.push(post._id);//user ko bhi btana pdega n ki post kaun h
    await user.save();
    res.redirect('/profile')
})
app.get('/like/:id',isLoggedIn,async(req,res)=>{
    let post=await postModel.findOne({_id:req.params.id}).populate("user")//user: m user k id tha but after populate user we get the content of user in user feild
    console.log(req.user);//we get req.user from middleware isLoggedIn IMPORTANT in user we have userid
    if(post.likes.indexOf(req.user.userid)===-1){//-1 because array has initial index=0 and here it means ki likes k array m woh bnda(user) nhi h toh ek like bdha do
        post.likes.push(req.user.userid);
        
    }
    else{//after liking when we again click like button we want to remove user id which is unlike
        post.likes.splice(post.likes.indexOf(req.user.userid),1)//it means yeh user jis index p h uss index p seh 1 cut krdo ek user hta do that will be that user itself
    }
    await post.save();
    res.redirect('/profile')
})

//to edit post--->
app.get('/edit/:id',isLoggedIn,async(req,res)=>{
    let post=await postModel.findOne({_id:req.params.id});
    res.render("edit",{post});
})
app.post('/update/:id',isLoggedIn,async(req,res)=>{
    let post=await postModel.findOneAndUpdate({_id:req.params.id},{content:req.body.content})
    res.redirect('/profile')
})

app.listen(3000);


//without populate--.
// {
//   user: "678abc1234df090909090",
//   content: "hello"
// }

//with populate--->
// {
//    user: {
//       name: "Wahaj",
//       username: "wahaj420",
//       email: "wahaj@gmail.com"
//    },
//    content: "hello"
// }
