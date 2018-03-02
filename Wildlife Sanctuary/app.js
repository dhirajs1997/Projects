// var oracledb = require('oracledb');
var express = require('express');

var dbcontroller = require('./controllers/dbcontroller.js');

var app = express();
app.use(express.static('./'));
app.set('view engine','ejs');
var server = app.listen(3000, function(){
  console.log('PORT 3000 ACTIVATED');
});

dbcontroller(app);

// oracledb.getConnection(
//   {
//     user          : "developer",
//     password      : "Password1",
//     connectString : "//localhost:1521/orcl"
//   },
//   function(err, connection)
//   {
//     if (err) {
//       console.error(err.message);
//       return;
//     }
//     connection.execute(
//       `SELECT *
//        FROM booking`,
//       function(err, result)
//       {
//         if (err) {
//           console.error(err.message);
//           doRelease(connection);
//           return;
//         }
//         console.log(result);
//         doRelease(connection);
//       });
//   });
//
// function doRelease(connection)
// {
//   connection.close(
//     function(err) {
//       if (err)
//         console.error(err.message);
//     });
// }
