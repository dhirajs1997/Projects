var oracledb = require('oracledb');
oracledb.autoCommit = true;

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


//add user to booking table

app.post('/reserve', urlencodedParser, function(req, res){
  console.log(req.body);

  //changing date to oracle supported format
  var month = ['jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  var date = req.body.date;
  var arr = date.split('-'); //split date and store each of dd mm yyyy into arr array

  date=arr[2]+'-'+month[(arr[1]-1)]+'-'+arr[0];
  console.log(date);
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
        "INSERT INTO booking VALUES (booking_sequence.nextval, :b_fare, :b_date)",
        { b_fare : {val: req.body.class}, b_date : {val: date} },  // 'bind by name' syntax
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
            res.render('reserve', {data: err.message});
            doRelease(connection);
            return;
          }
          console.log(result);
          // var success = 'Reservation added'
          res.render('reserve', {data: 'Reservation added'});
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
  app.post('/booking', function(req, res){
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
           FROM booking`,
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
};
