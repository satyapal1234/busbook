const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const session=require("express-session");
const ejs=require("ejs");
const nodemailer=require("nodemailer");
var springedge = require('springedge');
const Insta = require('instamojo-nodejs');


const app=express();
app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(session({secret: 'sssaaa',saveUninitialized: true,resave: true}));
mongoose.connect("mongodb://localhost:27017/bus_book",{useNewUrlParser:true});
app.use(function(req, res, next)
  { res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); 
    next(); 
  });

var sess;
var name;

const CustomerSchema=new mongoose.Schema({
	username:String,
	email:String,
    address:String,
    contact:Number,
    password:String,
    rand:Number
})

const Customer=new mongoose.model("Customer",CustomerSchema);

const OperatorSchema=new mongoose.Schema({
  operatorname:String,
  email:String,
  address:String,
  contact:Number,
  password:String,
  bus:String
})


const Operator=new mongoose.model("Operator",OperatorSchema);






const PrinceTravelSchema=new mongoose.Schema({
  booker_name:String,
  booker_contact:Number,
  booker_address:String,
  booking_date:String,
  from:String,
  to:String,
  sleeper:Number,
  nonWindowSeat:Number,
  windowSeat:Number,
  mode:String,
  AmountPayable:Number,
  payment_id:String,
  payment_status:String
})
const PrinceTravel=new mongoose.model("PrinceTravel",PrinceTravelSchema);



const NilanchalTravelSchema=new mongoose.Schema({
  booker_name:String,
  booker_contact:Number,
  booker_address:String,
  booking_date:String,
  from:String,
  to:String,
  sleeper:Number,
  nonWindowSeat:Number,
  windowSeat:Number,
  mode:String,
  AmountPayable:Number,
   payment_id:String,
  payment_status:String
})
const NilanchalTravel=new mongoose.model("NilanchalTravel",NilanchalTravelSchema);



const MaharajaTravelSchema=new mongoose.Schema({
  booker_name:String,
  booker_contact:Number,
  booker_address:String,
  booking_date:String,
  from:String,
  to:String,
  sleeper:Number,
  nonWindowSeat:Number,
  windowSeat:Number,
  mode:String,
  AmountPayable:Number,
  payment_id:String,
  payment_status:String
})
const MaharajaTravel=new mongoose.model("MaharajaTravel",MaharajaTravelSchema);



const RatnagiriTravelSchema=new mongoose.Schema({
  booker_name:String,
  booker_contact:Number,
  booker_address:String,
  booking_date:String,
  from:String,
  to:String,
  sleeper:Number,
  nonWindowSeat:Number,
  windowSeat:Number,
  mode:String,
  AmountPayable:Number,
  payment_id:String,
  payment_status:String
})
const RatnagiriTravel=new mongoose.model("RatnagiriTravel",RatnagiriTravelSchema);


const BusbookingSchema=new mongoose.Schema({
  booker_name:String,
  booker_contact:Number,
  booker_address:String,
  booking_date:String,
  from:String,
  to:String,
  sleeper:Number,
  nonWindowSeat:Number,
  windowSeat:Number,
  mode:String,
  AmountPayable:Number,
  payment_id:String,
  payment_status:String,
  busname:String
}) 

const Busbooking=new mongoose.model("Busbooking",BusbookingSchema);


const CabBookSchema=new mongoose.Schema({
   name:String,
   contact:Number,
   from:String,
   to:String,
   date:String,
   time:String,
   payment_id:String,
   payment_status:String,
   email:String
})

const CabBook=new mongoose.model("CabBook",CabBookSchema);
app.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        
        res.redirect('/');
    });

});




app.get('/',function(req,res)
{
  sess=req.session;
  if(sess.email)
	  {
      res.render("home",{name:sess.name,val:1});
    }
    else
    {
      res.render("home",{val:0});
    }
})


app.get('/about',function(req,res){
	res.render("about");
})


app.get('/superadminwork',function(req,res){

  sess=req.session;
  console.log('ok'+ sess.email);
  if(sess.email==='superadmin@gmail.com')
  {   
       Customer.find({},function(err,foundlist)
       {
          if(err){console.log('err');}
           else
           { 
              Busbooking.find({},function(err2,foundlist2)
              {
                if(err){console.log('err2');}
                else
                {
                    Operator.find({},function(err3,foundlist3)
                     {
                       if(err3){console.log('err3')}
                      else
                       {
                          CabBook.find({},function(err4,foundlist4){
                             if(err4){console.log('err4');}
                             else
                             {
                               res.render("superadminwork",{foundlist,foundlist2,foundlist3,foundlist4});
                             }
                          })
                           
                       }
                     })
            
                 }
              })
       
            }
        })
     }
  else
  {
      res.write('<h1>You need to login first for acceess</h1>');
       res.end('<a href='+'/superadminLogin'+'>Login</a>');
  }

  
  // res.render("superadminwork");
})








app.get('/superadminLogin',function(req,res){
   res.render("superadminlogin");
})

app.post('/superadminlog',function (req,res) {
  // body...
  const email=req.body.email;
  const password=req.body.password;
  console.log(email+" "+password);
  if(email==='superadmin@gmail.com' && password== 12345678)
  {
    sess=req.session;
    sess.email=email;
    sess.name='superadmin';
    res.end('done');
  }
  else
  {
     res.end('wrong');
  }
 
 // 
})





app.get('/contact',function(req,res){
	res.render("contact");
})


app.get("/customer_register",function(req,res){

	res.render("customer_register");
})

app.get('/services',function(req,res){
  res.render("services");
})


app.get('/firstverify',function(req,res){
  res.render("firstverify");
})











app.post('/cutomer_verification',function(req,res)
{
  const email=req.body.email;
  const otp=req.body.otp;
  console.log(email+" "+otp);
   Customer.findOne({email:email},function(err,foundlist){
     if(err){console.log('error is there');}
     else if(!foundlist)
     {
      console.log('no');
       res.end('notfound');
     }
     else
     {
       
       if(foundlist.rand==otp)
        { 
          Customer.findOneAndUpdate({email:email},{rand:0},function(err,foundlist){

          })
          sess=req.session;
          console.log('yes');
          sess.email=req.body.email;
          sess.name=foundlist.username;
          res.end('success');
        }
       else
       {
        res.end("notmatched");
       }
     }
   })
})















app.post('/customer_login',function(req,res){
  const email=req.body.email;
  const password=req.body.password;
  console.log(email+" "+password);
  Customer.findOne({email:email,password:password},function(err,foundlist){
    if(err){console.log('error in login');}
    else if(!foundlist)
    {
      res.end('notfound');
    }
    else
    {
       if(foundlist.rand!=0)
       {
         res.end('notverified')
       }
       else
       {
           sess=req.session;
          sess.email=email;
          sess.name=foundlist.username;
          res.end('success');
       }
     
    }
  })

})










app.get('/princetravelTask',function(req,res) {
    sess=req.session;
    if(sess.email)
    {
      PrinceTravel.find({},function(err,foundlist2){
          if(err){console.log('err');}
          else
          {
              res.render("princetravelTask",{foundlist2}); 
          }
      })
     
    }
    else
    {
      res.write('<h1>You need to login first</h1>');
       res.end('<a href='+'/'+'>login</a>');
    }
})






app.get('/nilanchaltravelTask',function(req,res) {
    sess=req.session;
    if(sess.email)
    {
      NilanchalTravel.find({},function(err,foundlist2){
          if(err){console.log('err');}
          else
          {
              res.render("nilanchaltravelTask",{foundlist2}); 
          }
      })
     
    }
    else
    {
      res.write('<h1>You need to login first</h1>');
       res.end('<a href='+'/'+'>login</a>');
    }
})









app.get('/maharajatravelTask',function(req,res) {
    sess=req.session;
    if(sess.email)
    {
      MaharajaTravel.find({},function(err,foundlist2){
          if(err){console.log('err');}
          else
          {
              res.render("maharajatravelTask",{foundlist2}); 
          }
      })
     
    }
    else
    {
      res.write('<h1>You need to login first</h1>');
       res.end('<a href='+'/'+'>login</a>');
    }
})
















app.get('/ratnagiritravelTask',function(req,res) {
    sess=req.session;
    if(sess.email)
    {
      RatnagiriTravel.find({},function(err,foundlist2){
          if(err){console.log('err');}
          else
          {
              res.render("ratnagiritravelTask",{foundlist2}); 
          }
      })
     
    }
    else
    {
      res.write('<h1>You need to login first</h1>');
       res.end('<a href='+'/'+'>login</a>');
    }
})















app.get('/operatorLogin',function(req,res)
{
  res.render("operatorLogin");
})



app.post('/operatorLogin',function(req,res){
   const email=req.body.email;
   const password=req.body.password;
  console.log(email+" "+password);
   Operator.findOne({email:email,password:password},function(err,foundlist){
      if(err){console.log('error man');}
      else if(!foundlist)
      {
        res.end('notfound');
      }
      else
      {
        sess=req.session;
        sess.email=email;
        sess.name=foundlist.operatorname;
        console.log(foundlist.bus);
        if(foundlist.bus==='prince Travel')
          {
            console.log('sfjsjflsjfs');
            res.end('prince');
          }

          if(foundlist.bus==='nilanchal Travel')
          {
            console.log('sfjsjflsjfs');
            res.end('nilanchal');
          }

          if(foundlist.bus==='maharaja Travel')
          {
            console.log('sfjsjflsjfs');
            res.end('maharaja');
          }

          if(foundlist.bus==='ratnagiri Travel')
          {
            console.log('sfjsjflsjfs');
            res.end('ratnagiri');
          }
      }
   })
})

















app.post('/customer_register',function(req,res){
	const username=req.body.username;
	const email=req.body.email;
	const password=req.body.password;
	const address=req.body.address;
	console.log('whta');
	console.log(username+ " "+email+" "+password+" "+address);
    var rand=Math.floor((Math.random() * 10000) + 1);
    console.log(rand);
	var msg=' your one time otp is'+rand;

  Customer.findOne({email:email},function(err,foundlist){
  	 if(err){console.log('error something');}
  	 else if(!foundlist)
  	 {
          
           var transporter = nodemailer.createTransport(
            {
               service: 'gmail',
                  auth: 
                 {
                    user: 'jeesatyapal@gmail.com',
                    pass: 770605441956
                 }
            });

             var mailOptions = 
   			 {
     		   from: 'jeesatyapal@gmail.com',
       		     to: email,
            subject: "OTP FOR SATYA TRAVELS✔",
               html:"your one time password is <h1>"+rand+"<h1>"
             };

              transporter.sendMail(mailOptions, function(error, info)
  			 {
    			 if (error) 
    			 {
      				 console.log(error);
      			 } 
     			else
                 {
                   console.log('Email sent: ' + info.response);
                   var newcustomer=Customer({
                   	  username:username,
                   	  email:email,
                   	  password:password,
                   	  address:address,
                      rand:rand
                    })
                   newcustomer.save();
                 }
             });

              res.end('success');

      }
  	 else
  	 {
  	 	res.end("present");
  	 }
  })	
  
})













app.post('/addOperator',function(req,res)
{
   const operatorname=req.body.operatorname;
   const email=req.body.email;
   const phone=req.body.phone;
   const bus=req.body.bus;
   const address=req.body.address;
   const password=req.body.password;


   Operator.findOne({email:email},function(err,foundlist)
   {
       if(err){console.log('err');}
       else if(!foundlist)
       {
           var newoperator=Operator(
             {
                 operatorname:operatorname,
                 email:email,
                 address:address,
                 contact:phone,
                  password:password,
                  bus:bus
              })
            newoperator.save();
            var msg=' your password is'+password;
            var params =
            {
              'apikey': '6n7h4wv5yte7t87qxp4vmrfh96tu0el7', // API Key
              'sender': 'SEDEMO', // Sender Name
                'to': phone,
           'message': 'Hi, this is a test message '+operatorname+msg,
            'format': 'json'
          };

           springedge.messages.send(params, 5000, function (err, response) {
              if (err)
               {
                  return console.log(err);
               }
              console.log(response);
             });  

           res.render("success");
       }
       else
       {
         res.write("<h1>SORRY THIS HAS BEEN ALREADY TAKEN</h1>")
       }
   })
   
       
       
})








app.post('/searchSeat',function(req,res){
  const arrivaldate=req.body.arrivaldate;

  const from=req.body.from;
  const to=req.body.to;
  const btn=req.body.button;
  var noOfSleeper=0;
  var noOfwindowSeat=0;
  var noOfnonWindowSeat=0;
  console.log(arrivaldate+" "+from+" "+to+" "+btn);
    




    if(btn==='prince_travel')
    {
         var values=cost(from,to);
         console.log(values[1]);
      PrinceTravel.find({booking_date:arrivaldate,from:from,to:to},function(err,foundlist){
          if(err){console.log('error in finding');}
          else
          {
            console.log(foundlist.length);
             for(var i=0;i<foundlist.length;i++)
             {
                  noOfSleeper+=foundlist[i].sleeper;
                  noOfnonWindowSeat+=foundlist[i].nonWindowSeat;
                  noOfwindowSeat+=foundlist[i].windowSeat;
                  console.log(noOfSleeper+" "+noOfnonWindowSeat+" "+noOfwindowSeat);
             }
             res.render("seatAvailability",{foundlist,
              avlsleepers:14-noOfSleeper,
              avlnonwindowseats:22-noOfnonWindowSeat,
              avlwindowseats:22-noOfwindowSeat,
              name:"Prince Travel",arrivaldate:arrivaldate,from:from,to:to,
              slcost:values[0],wincost:values[1],nonwincost:values[2]})
            // console.log(noOfSleeper+" "+noOfSeat);
          }
      })
    }





    if(btn==='nilanchal_travel')
    {
          var values=cost(from,to);
          console.log(values[1]);
        NilanchalTravel.find({booking_date:arrivaldate,from:from,to:to},function(err,foundlist){
          if(err){console.log('error in finding');}
          else
          {
             for(var i=0;i<foundlist.length;i++)
             {
                  noOfSleeper+=foundlist[i].sleeper;
                  noOfnonWindowSeat+=foundlist[i].nonWindowSeat;
                  noOfwindowSeat+=foundlist[i].windowSeat;
             }
             res.render("seatAvailability",{foundlist,
              avlsleepers:18-noOfSleeper,
              avlnonwindowseats:24-noOfnonWindowSeat,
              avlwindowseats:24-noOfwindowSeat,
              name:"Nilanchal Travel",arrivaldate:arrivaldate,from:from,to:to,
              slcost:values[0],wincost:values[1],nonwincost:values[2]})
            // console.log(noOfSleeper+" "+noOfSeat);
          }
      })
    }





    if(btn==='maharaja_travel')
    {
         var values=costjsrkol(from,to);
         console.log(values[1]);
        MaharajaTravel.find({booking_date:arrivaldate,from:from,to:to},function(err,foundlist){
          if(err){console.log('error in finding');}
          else
          { console.log(foundlist.length);
             for(var i=0;i<foundlist.length;i++)
             {
                  noOfSleeper+=foundlist[i].sleeper;
                  noOfnonWindowSeat+=foundlist[i].nonWindowSeat;
                  noOfwindowSeat+=foundlist[i].windowSeat;
                  console.log(noOfSleeper+" "+noOfnonWindowSeat+" "+noOfwindowSeat);
             }
             res.render("seatAvailability",{foundlist,
              avlsleepers:16-noOfSleeper,
              avlnonwindowseats:32-noOfnonWindowSeat,
              avlwindowseats:32-noOfwindowSeat,
              name:"Maharaja Travel",arrivaldate:arrivaldate,from:from,to:to,
              slcost:values[0],wincost:values[1],nonwincost:values[2]})
            // console.log(noOfSleeper+" "+noOfSeat);
          }
      })
    }

   
    if(btn==='ratnagiri_travel')
    {
         var values=costptndrb(from,to);
         console.log(values[1]);
        RatnagiriTravel.find({booking_date:arrivaldate,from:from,to:to},function(err,foundlist){
          if(err){console.log('error in finding');}
          else
          {
             for(var i=0;i<foundlist.length;i++)
             {
                  noOfSleeper+=foundlist[i].sleeper;
                  noOfnonWindowSeat+=foundlist[i].nonWindowSeat;
                  noOfwindowSeat+=foundlist[i].windowSeat;
             }
             res.render("seatAvailability",{foundlist,
              avlsleepers:18-noOfSleeper,
              avlnonwindowseats:35-noOfnonWindowSeat,
              avlwindowseats:35-noOfwindowSeat,
              name:"Ratnagiri Travel",arrivaldate:arrivaldate,from:from,to:to,
              slcost:values[0],wincost:values[1],nonwincost:values[2]})
            // console.log(noOfSleeper+" "+noOfSeat);
          }
      })
    }


})















app.get('/successfulpaymentonline',function(req,res){

    if(ouser  && oarrival && ofrom && oto && osleeper && owindows && obusname && ocontact && ononwindow && 
      ocostsleeper && ocostwindow && ocostnonwindow && oprices && req.query.payment_id && req.query.payment_status)
     {
          var newbookingxxx=Busbooking({
                 booker_name:ouser,
                 booker_contact:ocontact,
                 booking_date:oarrival,
                 from:ofrom,
                 to:oto,
                 sleeper:osleeper,
                 nonWindowSeat:ononwindow,
                 windowSeat:owindows,
                 mode:omode,
                 AmountPayable:oprices,
                 payment_id:req.query.payment_id,
                 payment_status:req.query.payment_status,
                 busname:obusname
                
              })
              newbookingxxx.save();
        if(obusname==="Prince Travel")
           {
              console.log("prin");
              var newbooking=PrinceTravel({
                 booker_name:ouser,
                 booker_contact:ocontact,
                 booking_date:oarrival,
                 from:ofrom,
                 to:oto,
                 sleeper:osleeper,
                 nonWindowSeat:ononwindow,
                 windowSeat:owindows,
                 mode:omode,
                 AmountPayable:oprices,
                 payment_id:req.query.payment_id,
                 payment_status:req.query.payment_status,
                
              })
              newbooking.save();
           }


           if(obusname==="Nilanchal Travel")
           {
              console.log("prin");
              var newbooking=PrinceTravel({
                 booker_name:ouser,
                 booker_contact:ocontact,
                 booking_date:oarrival,
                 from:ofrom,
                 to:oto,
                 sleeper:osleeper,
                 nonWindowSeat:ononwindow,
                 windowSeat:owindows,
                 mode:omode,
                 AmountPayable:oprices,
                 payment_id:req.query.payment_id,
                 payment_status:req.query.payment_status,
                
              })
              newbooking.save();
           }


            if(obusname==="Maharaja Travel")
           {
              console.log("prin");
              var newbooking=PrinceTravel({
                 booker_name:ouser,
                 booker_contact:ocontact,
                 booking_date:oarrival,
                 from:ofrom,
                 to:oto,
                 sleeper:osleeper,
                 nonWindowSeat:ononwindow,
                 windowSeat:owindows,
                 mode:omode,
                 AmountPayable:oprices,
                 payment_id:req.query.payment_id,
                 payment_status:req.query.payment_status,
                
              })
              newbooking.save();
           }

            if(obusname==="Ratnagiri Travel")
           {
              console.log("prin");
              var newbooking=PrinceTravel({
                 booker_name:ouser,
                 booker_contact:ocontact,
                 booking_date:oarrival,
                 from:ofrom,
                 to:oto,
                 sleeper:osleeper,
                 nonWindowSeat:ononwindow,
                 windowSeat:owindows,
                 mode:omode,
                 AmountPayable:oprices,
                 payment_id:req.query.payment_id,
                 payment_status:req.query.payment_status,
                
              })
              newbooking.save();
           }

           res.render("successfulpaymentonline");
     }

})














app.get('/congrats_offline_book',function(req,res){
   console.log(cuser+" "+carrival+" "+cfrom+" "+cto+" "+csleeper+" "+cwindows+" "+cbusname+" "+ccontact);
   if(cuser && carrival && cfrom && cto && csleeper && cwindows && cbusname && ccontact && cnonwindow)
   {  
       var price=(csleeper*ccostsleeper)+(cwindows*ccostwindow)+(cnonwindow*ccostnonwindow);

      res.render("congrats_offline_book",{cuser,cfrom,cto,cwindows,csleeper,cbusname,ccontact,price,carrival});   
      cuser=null;
      carrival=null;
      cfrom=null;
      cto=null;
      csleeper=null;
      cwindows=null;
      cnonwindow=null;
      cbusname=null;
      ccontact=null;
      ccostsleeper=null;
      ccostwindow=null;
      ccostnonwindow=null;
   }

   else
    { 
        
        res.write('<h1>You are not Authorisesd to acceess this page</h1>');
        res.end('<a href='+'/'+'>Go back to Main Page</a>');
    }
  
})








var cuser,ouser;
var carrival,oarrival;
var cfrom,ofrom;
var cto,oto;
var csleeper ,osleeper;
var cwindows, owindows;
var cnonwindow, ononwindow;
var cbusname,obusname;
var ccontact,ocontact;
var ccostsleeper,ocostsleeper;
var ccostwindow,ocostwindow;
var ccostnonwindow ,ocostnonwindow;
var obusname,oprices,omode;


app.post('/booknow',function(req,res){
  const username=req.body.username;
  const arrivaldate=req.body.arrivaldate;
  const from=req.body.from;
  const to=req.body.to;
  const sleeper=req.body.sleeper;
  const windows=req.body.window;
  const nonwindow=req.body.nonwindow;
  const mode=req.body.radio;
  const busname=req.body.busname;
  const contact=req.body.contact;
  const slcost=req.body.slcost;
  const wincost=req.body.wincost;
  const nonwincost=req.body.nonwincost;
  console.log(mode+ " "+contact);
  sess=req.session;
  if(sess.email)
  {
       if(mode==='cashondelivery')
       {
        var prices=(sleeper*slcost)+(windows*wincost)+(nonwindow*nonwincost);
             var newbookingxxx=Busbooking({
                 booker_name:username,
                 booker_contact:contact,
                 booking_date:arrivaldate,
                 from:from,
                 to:to,
                 sleeper:sleeper,
                 nonWindowSeat:nonwindow,
                 windowSeat:windows,
                 mode:mode,
                 AmountPayable:prices,
                 busname:busname
                
              })
              newbookingxxx.save();


           if(busname==="Prince Travel")
           {

            console.log("prin");
              var newbooking=PrinceTravel({
                 booker_name:username,
                 booker_contact:contact,
                 booking_date:arrivaldate,
                 from:from,
                 to:to,
                 sleeper:sleeper,
                 nonWindowSeat:nonwindow,
                 windowSeat:windows,
                 mode:mode,
                 AmountPayable:prices
                
              })
              newbooking.save();

           }

           if(busname==="Nilanchal Travel")
           {
                var newbooking=NilanchalTravel({
                 booker_name:username,
                 booker_contact:contact,
                 booking_date:arrivaldate,
                 from:from,
                 to:to,
                 sleeper:sleeper,
                 nonWindowSeat:nonwindow,
                 windowSeat:windows,
                 mode:mode,
                 AmountPayable:prices
              })
              newbooking.save();
           }

           if(busname==="Maharaja Travel")
           {
              var newbooking=MaharajaTravel({
                 booker_name:username,
                 booker_contact:contact,
                 booking_date:arrivaldate,
                 from:from,
                 to:to,
                 sleeper:sleeper,
                 nonWindowSeat:nonwindow,
                 windowSeat:windows,
                 mode:mode,
                 AmountPayable:prices
              })
              newbooking.save();  
           }
           if(busname==="Ratnagiri Travel")
           {
              var newbooking=RatnagiriTravel({
                 booker_name:username,
                 booker_contact:contact,
                 booking_date:arrivaldate,
                 from:from,
                 to:to,
                 sleeper:sleeper,
                 nonWindowSeat:nonwindow,
                 windowSeat:windows,
                 mode:mode,
                 AmountPayable:prices
              })
              newbooking.save();
           }

            cuser=username;
            carrival=arrivaldate;
            cfrom=from;
            cto=to;
            csleeper=sleeper;
            cwindows=windows;
            cbusname=busname;
            ccontact=contact;
            cnonwindow=nonwindow;
            ccostsleeper=slcost;
            ccostwindow=wincost;
            ccostnonwindow=nonwincost;
           res.render("demo",{valu:1});


          
       }

       if(mode==='onlineypayment')
       {
            ouser=username;
            oarrival=arrivaldate;
            ofrom=from;
            oto=to;
            osleeper=sleeper;
            owindows=windows;
            obusname=busname;
            ocontact=contact;
            ononwindow=nonwindow;
            ocostsleeper=slcost;
            ocostwindow=wincost;
            ocostnonwindow=nonwincost;
            obusname=busname;
            omode=mode;
            console.log(contact);
             oprices=(sleeper*slcost)+(windows*wincost)+(nonwindow*nonwincost);

             Insta.setKeys("e94079733b1bc454c6f80b9fe49892a7","febbce517aadfe67fb04dee8706228ae");
            var data = new Insta.PaymentData();
            data.purpose="bus booking";
            data.amount=9;
            data.currency                = 'INR';
            data.buyer_name              = username;
            data.email                   = sess.email;
            data.phone                   = contact;
            data.send_sms                = true
            data.send_email              = true
            data.allow_repeated_payments = false
            //data.webhook                 ="http://localhost:5000/success"
            data.redirect_url            = "http://localhost:5000/successfulpaymentonline";

            Insta.createPayment(data, function(error, response) 
            {
             if (error)
               {
                 console.log(error);
               }
              else 
              {
               var obj = JSON.parse(response);
              // console.log(obj);
                 
                  res.redirect(obj.payment_request.longurl);
                   console.log(obj.payment_request.longurl);
                 
                
              }
            });
       }
  }
  else
  {
      res.write('<h1>You need to login first</h1>');
       res.end('<a href='+'/'+'>login</a>');
  }

 /* console.log(username);
  console.log(arrivaldate);
  console.log(from);
  console.log(to);
  console.log(sleeper);
  console.log(windows);
  console.log(nonwindow);
  console.log(mode);*/
})







/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

app.get('/cabpage',function(req,res){
   sess=req.session;
  if(sess.email)
    {
      res.render("cabpage",{name:sess.name,val:1});
    }
    else
    {
      res.render("cabpage",{val:0});
    }
})


var cabfrom=null;
var cabto=null;
var cabdate=null;
var cabtime=null;
var cabcontact=null;
var cabname=null;
var cabemail=null;
app.post('/bookyourcab',function(req,res){
   const from=req.body.from;
   const to=req.body.to;
   const date=req.body.date;
   const time=req.body.time;
   const contact=req.body.contact;
   console.log(from+" "+to+" "+date+" "+time+" "+contact);
   sess=req.session;
    if(sess.email)
    {        
           cabfrom=from;
           cabto=to;
           cabdate=date;
           cabtime=time;
           cabcontact=contact;
           cabname=sess.name;
           cabemail=sess.email;


             Insta.setKeys("e94079733b1bc454c6f80b9fe49892a7","febbce517aadfe67fb04dee8706228ae");
            var data = new Insta.PaymentData();
            data.purpose="advanced payment";
            data.amount=9;
            data.currency                = 'INR';
            data.buyer_name              = sess.name
            data.email                   = sess.email;
            data.phone                   = contact;
            data.send_sms                = true
            data.send_email              = true
            data.allow_repeated_payments = false
            //data.webhook                 ="http://localhost:5000/success"
            data.redirect_url            = "http://localhost:5000/successfulpaymentforcabonline";

            Insta.createPayment(data, function(error, response) 
            {
             if (error)
               {
                 console.log('invalid phone no');
               }
              else 
              {
               var obj = JSON.parse(response);
              // console.log(obj);
                 
                  res.redirect(obj.payment_request.longurl);
                   console.log(obj.payment_request.longurl);
                 
                
              }
            });
        
    }
    else
    {

       res.write('<h1>You need to login first</h1>');
       res.end('<a href='+'/'+'>login</a>');
    }
})





app.get('/successfulpaymentforcabonline',function(req,res){
   if(cabfrom && cabto && cabdate && cabtime && cabname && cabemail)
   {
      var newcabbook=CabBook(
        {
            name:cabname,
            contact:cabcontact,
            from:cabfrom,
            to:cabto,
            date:cabdate,
            time:cabtime,
            payment_id:req.query.payment_id,
            payment_status:req.query.payment_status,
            email:cabemail
        })
        newcabbook.save();

        cabfrom=null;
        cabto=null;
        cabdate=null;
        cabtime=null;
        cabcontact=null;
        res.render("successfulpaymentforcabonline");
   }

    else
    { 
        
        res.write('<h1>You are not Authorisesd to acceess this page</h1>');
        res.end('<a href='+'/'+'>Go back to Main Page</a>');
    }
  
})

let port=process.env.PORT;
if(port==null||port==""){
  port=5000;
}

app.listen(port,function() //this is the dynamic port which heroku will define on go
{
   console.log("server has started listening on  port 5000");
});




////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function cost(from,to)
{
  if(from==='jamshedpur' && to==='aurangabad')
    return [300,250,250];
  if(from==='jamshedpur' && to==='dihri')
    return [350,300,300];
  if(from==='jamshedpur' && to==='sasaram')
    return [450,400,400];
  if(from==='jamshedpur' && to==='vikramganj')
    return [550,500,500];
  if(from==='jamshedpur' && to==='bhojpur')
    return [650,600,600];
  if(from==='jamshedpur' && to==='buxar')
    return [750,700,700];

  if(from==='ranchi' && to==='aurangabad')
    return [300,250,250];
  if(from==='ranchi' && to==='dihri')
    return [350,300,300];
  if(from==='ranchi' && to==='sasaram')
    return [450,400,400];
  if(from==='ranchi' && to==='vikramganj')
    return [550,500,500];
  if(from==='ranchi' && to==='bhojpur')
    return [650,600,600];
  if(from==='ranchi' && to==='buxar')
    return [750,700,700];


  if(from==='aurangabad' && to==='dihri')
    return [350,300,300];
  if(from==='aurangabad' && to==='sasaram')
    return [450,400,400];
  if(from==='aurangabad' && to==='vikramganj')
    return [550,500,500];
  if(from==='aurangabad' && to==='bhojpur')
    return [650,600,600];
  if(from==='aurangabad' && to==='buxar')
    return [750,700,700];



  if(from==='dihri' && to==='sasaram')
    return [450,400,400];
  if(from==='dihri' && to==='vikramganj')
    return [550,500,500];
  if(from==='dihri' && to==='bhojpur')
    return [650,600,600];
  if(from==='dihri' && to==='buxar')
    return [750,700,700];

  if(from==='sasaram' && to==='vikramganj')
    return [550,500,500];
  if(from==='sasaram' && to==='bhojpur')
    return [650,600,600];
  if(from==='sasaram' && to==='buxar')
    return [750,700,700];


  return[0,0,0];
}








function costjsrkol(from,to)
{
  if(from==='jamshedpur' && to==='gahmar')
    return [550,500,500];
  if(from==='jamshedpur' && to==='sultanpur')
    return [650,600,600];
  if(from==='jamshedpur' && to==='meruth')
    return [750,700,700];
  if(from==='jamshedpur' && to==='audi')
    return [550,500,500];
  if(from==='jamshedpur' && to==='julabipur')
    return [650,600,600];
  if(from==='jamshedpur' && to==='kolkata')
    return [750,700,700];

  if(from==='twinin' && to==='gahmar')
    return [550,500,500];
  if(from==='twinin' && to==='sultanpur')
    return [650,600,600];
  if(from==='twinin' && to==='meruth')
    return [750,700,700];
  if(from==='twinin' && to==='audi')
    return [550,500,500];
  if(from==='twinin' && to==='julabipur')
    return [650,600,600];
  if(from==='twinin' && to==='kolkata')
    return [750,700,700];

  if(from==='chhapra' && to==='gahmar')
    return [550,500,500];
  if(from==='chhapra' && to==='sultanpur')
    return [650,600,600];
  if(from==='chhapra' && to==='meruth')
    return [750,700,700];
  if(from==='chhapra' && to==='audi')
    return [550,500,500];
  if(from==='chhapra' && to==='julabipur')
    return [650,600,600];
  if(from==='chhapra' && to==='kolkata')
    return [750,700,700]; 

  if(from==='churchil' && to==='gahmar')
    return [550,500,500];
  if(from==='churchil' && to==='sultanpur')
    return [650,600,600];
  if(from==='churchil' && to==='meruth')
    return [750,700,700];
  if(from==='churchil' && to==='audi')
    return [550,500,500];
  if(from==='churchil' && to==='julabipur')
    return [650,600,600];
  if(from==='churchil' && to==='kolkata')
    return [750,700,700]; 


  return[0,0,0];
}





function costptndrb(from,to)
{
  if(from==='patna' && to==='dihri')
    return [550,500,500];
  if(from==='patna' && to==='dibrugarh')
    return [650,600,600];
  if(from==='patna' && to==='jamalpur')
    return [750,700,700];
  if(from==='patna' && to==='sonversa')
    return [550,500,500];
  if(from==='patna' && to==='darbhanga')
    return [650,600,600];

  if(from==='dihri' && to==='dihri')
    return [550,500,500];
  if(from==='dihri' && to==='dibrugarh')
    return [650,600,600];
  if(from==='dihri' && to==='jamalpur')
    return [750,700,700];
  if(from==='dihri' && to==='sonversa')
    return [550,500,500];
  if(from==='dihri' && to==='darbhanga')
    return [650,600,600];

  return[0,0,0];
}
/*
var params =
          {
            'apikey': '6n7h4wv5yte7t87qxp4vmrfh96tu0el7', // API Key
            'sender': 'SEDEMO', // Sender Name
                'to': ['917004155914'],
           'message': 'Hi, this is a test message '+username+msg,
            'format': 'json'
          };

           springedge.messages.send(params, 5000, function (err, response) {
              if (err)
               {
                  return console.log(err);
               }
              console.log(response);
             });  



*/