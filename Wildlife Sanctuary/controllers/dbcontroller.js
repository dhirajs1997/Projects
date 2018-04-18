var oracledb = require('oracledb');
oracledb.autoCommit = true;

var md5 = require('md5');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false});





module.exports = function(app){

//index page
  app.get('/', function(req, res){
    res.render('index');
  });

  //Guide page
  app.get('/guide', function(req, res){
    res.render('guide');
  });
  
  app.get('/thisisforadminonly', function(req, res){
    res.render('thisisforadminonly');
  });

  //to book tickets
  app.get('/book',function(req,res){
    console.log(md5('test'));
    res.render('book');
  });

  app.get('/adminhome', function (req, res) {
    res.render('index');
  });
  app.get('/allbookings', function (req, res) {
    res.render('index');
  });
  app.get('/normalbookings', function (req, res) {
    res.render('index');
  });
  app.get('/plusbookings', function (req, res) {
    res.render('index');
  });

  app.post('/adminhome', urlencodedParser, function(req, res){
    if(req.body.adminname=='admin' && req.body.adminpass=='admin'){
      res.render('adminhome')
    }
    else{
      res.render('index')
    }
  });

  app.post('/allbookings', function(req, res){
    console.log(req.body);
    console.log('end parser');
    //Connection details for oracledb
    oracledb.getConnection(
      {
        user: "system",
        password: "Password1",
        connectString: "//localhost:1521/orcl"
      },
      function (err, connection) {
        if (err) {
          console.error(err.message);
          return;
        }
        connection.execute(
          `SELECT *
           FROM developer.booking`,
          function (err, result) {
            if (err) {
              console.error(err.message);
              // var resp = {err};
              res.render('bookings', { data: err });
              doRelease(connection);
              return;
            }
            console.log(result);
            res.render('bookings', { data: result });
            doRelease(connection);
          });
      });

    function doRelease(connection) {
      connection.close(
        function (err) {
          if (err)
            console.error(err.message);
        });
    }
  });
  app.post('/normalbookings', function(req, res){
    console.log(req.body);
    console.log('end parser');
    //Connection details for oracledb
    oracledb.getConnection(
      {
        user: "system",
        password: "Password1",
        connectString: "//localhost:1521/orcl"
      },
      function (err, connection) {
        if (err) {
          console.error(err.message);
          return;
        }
        connection.execute(
          `SELECT *
           FROM developer.admission`,
          function (err, result) {
            if (err) {
              console.error(err.message);
              // var resp = {err};
              res.render('bookings', { data: err });
              doRelease(connection);
              return;
            }
            console.log(result);
            res.render('bookings', { data: result });
            doRelease(connection);
          });
      });

    function doRelease(connection) {
      connection.close(
        function (err) {
          if (err)
            console.error(err.message);
        });
    }
  });
  app.post('/plusbookings', function(req, res){
    console.log(req.body);
    console.log('end parser');
    //Connection details for oracledb
    oracledb.getConnection(
      {
        user: "system",
        password: "Password1",
        connectString: "//localhost:1521/orcl"
      },
      function (err, connection) {
        if (err) {
          console.error(err.message);
          return;
        }
        connection.execute(
          `SELECT *
           FROM developer.admissionplus`,
          function (err, result) {
            if (err) {
              console.error(err.message);
              // var resp = {err};
              res.render('bookings', { data: err });
              doRelease(connection);
              return;
            }
            console.log(result);
            res.render('bookings', { data: result });
            doRelease(connection);
          });
      });

    function doRelease(connection) {
      connection.close(
        function (err) {
          if (err)
            console.error(err.message);
        });
    }
  });

//add user to booking table

app.post('/reserve', urlencodedParser, function(req, res){
  console.log(req.body);

  //changing date to oracle supported format
  var month = ['jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  var date = req.body.date;
  var arr = date.split('-'); //split date and store each of dd mm yyyy into arr array

  date=arr[2]+'-'+month[(arr[1]-1)]+'-'+arr[0];
  console.log(date);
  var passphrase = md5(date + req.body.email).substr(0,6);
  console.log('Passphrase: '+passphrase);
  var bookingClass;
  if(req.body.class == 450){
    bookingClass = 'normal';
  }
  else{
    bookingClass = 'plus';
  }
  //finished date format change

  //query

  oracledb.getConnection(
    {
      user          : "developer",
      password      : "Password1",
      connectString : "//localhost:1521/orcl"
    },
    function(err, connection)
    {
      if (err) {
        console.error(err.message);
        return;
      }
      connection.execute(
        "INSERT INTO booking VALUES (booking_sequence.nextval, :b_fare, :b_date, :email, :passphrase, :class)",
        { b_fare : {val: req.body.class}, b_date : {val: date}, email : {val: req.body.email}, passphrase : {val: passphrase}, class : {val: bookingClass} },  // 'bind by name' syntax
        function(err, result)
        {
          if (err) {
            console.error(err.message);
            console.log('test');
            console.log(err);
            console.log('test');
            console.log(err.message);
            // var resp = {err};
            if(err.message.includes('ORA-20101')) {
              err.message = 'All reservations booked for ' + date + '.\n' + 'Please try another date.'
            }
            res.render('reserve', { data: err.message});
            doRelease(connection);
            return;
          }

          //
          // connection.execute(
          //   `SELECT B_ID
          //    FROM booking
          //    where B_ID = booking_sequence.currval;`,
          //   function(err, id_result)
          //   {
          //     if (err) {
          //       console.error(err.message);
          //       // var resp = {err};
          //       res.render('reserve', {data: err.message});
          //       doRelease(connection);
          //       return;
          //     }
          //     console.log('This will print');
          //     console.log(id_result.rows);
          //   });


          console.log(result);
          // var success = 'Reservation added'
          // var success = 'Reservation added. Booking id is ' + id_result.row[1];
          
          var usermessage= 'Reservation added.\nPassphrase is '+passphrase;
          
          console.log('status: '+ req.body.sendmail);
          //send email to user
          // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          if(req.body.sendmail == 1){
            usermessage= 'Reservation added.\nPassphrase is '+passphrase+'.\n Emailed to '+req.body.email;
            const sgMail = require('@sendgrid/mail');
            var mailContent = 'Ticket booked for TheGreenPark on '+date+'. Your passphrase is '+passphrase+'.\n-TheGreenPark Wildlife Sanctuary.';
            sgMail.setApiKey(); //Email api key inside
            const msg = {
              to: req.body.email,
              from: 'no-reply@thegreenpark.com',
              subject: 'Tickets booked',
              text: mailContent
            };
            sgMail.send(msg);
          }


          res.render('reserve', { data: usermessage});
          doRelease(connection);
        });
    });

  function doRelease(connection)
  {
    connection.close(
      function(err) {
        if (err)
          console.error(err.message);
      });
  }
  //----------------


  // conn.execute(
  //   "INSERT INTO booking VALUES (booking_sequence.nextval, :fare, :date)",
  //   { fare : {val: req.body.fare}, date : {val: date} },  // 'bind by name' syntax
  // );
});




//view values of booking table
  app.post('/booking',urlencodedParser, function(req, res){
    console.log(req.body);
    console.log('end parser');
    //Connection details for oracledb
    oracledb.getConnection(
      {
        user          : "developer",
        password      : "Password1",
        connectString : "//localhost:1521/orcl"
      },
      function(err, connection)
      {
        if (err) {
          console.error(err.message);
          return;
        }
        connection.execute(
          `SELECT *
           FROM booking
           WHERE email = :email
           and passphrase = :passphrase`,
           {email : {val: req.body.email}, passphrase : {val: req.body.passphrase}},
          function(err, result)
          {
            if (err) {
              console.error(err.message);
              // var resp = {err};
              res.render('bookings', {data: err});
              doRelease(connection);
              return;
            }
            console.log(result);
            res.render('bookings', {data: result});
            doRelease(connection);
          });
      });

    function doRelease(connection)
    {
      connection.close(
        function(err) {
          if (err)
            console.error(err.message);
        });
    }
  });
