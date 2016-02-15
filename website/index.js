var express = require('express');
var plaid = require('plaid');
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');

var app = express();

var plaidClient = new plaid.Client("56bef3967c1539e11d919a62",
                                   "94d90ed8d84083a381c15f4bc73be7",
                                   plaid.environments.tartan);

app.use(bodyParser.urlencoded({ extended : false}));


//------------------------------------------------------------------------------------------------------------------------------
// LINK ENDPOINT - Registers a new user, and compiles a profile from their transactions. Takes a PLAID api access token and google_id
//------------------------------------------------------------------------------------------------------------------------------



app.post('/api/link', function(req, resp) {

  var public_token = req.body.public_token;

  // public_token = "cdcac057858a05be42e9be71860311";

  // Exchange a public_token for a Plaid access_token
  plaidClient.exchangeToken(public_token, function(err, respond) {
    if (err != null) {
        console.log(err);
        resp.send(err);
      // Handle error!
    } else {
      // This is your Plaid access token - store somewhere persistent
      // The access_token can be used to make Plaid API calls to
      // retrieve accounts and transactions
      var access_token = respond.access_token;
      plaidClient.getConnectUser(access_token, {
          start_date : "360 days ago", end_date : "today"
      }, function(err, res) {

        if (err != null) {
            console.log(err);
            resp.send(err);
          // Handle error!
        } else {
          var mycount = 0;
          var secondCount = 0;
          var myArray = {};
          // An array of accounts for this user, containing account
          // names, balances, and account and routing numbers.
          for (var check in res.transactions) {
              n = mycount.toString();
              myArray[n] = {};//initialize inner array

              if(res.transactions[check]["type"]["primary"] == "place" && res.transactions[check]["category"])
              {
                  //for (var key in res.transactions[check]["category"])
                  //{
			var key = res.transactions[check]["category"].length - 1;
                    //   console.log(key);
                      n = mycount.toString();
                      v = secondCount.toString();
                    //   console.log(res.transactions[check]["category"][key]);
                       myArray[n][v] = res.transactions[check]["category"][key];
                      secondCount++;
                  //}
                  mycount++;
                  secondCount = 0;

              }
          }
          myArray["id"] = req.body.google_id;
          console.log(myArray["id"]);

          var myJsonString = JSON.stringify(myArray);
        //   var lastly = JSON.stringify(myJsonString, null, 4)
        console.log(myJsonString);

          var pyshell = new PythonShell('create_profile.py');
          pyshell.send(myJsonString);
console.log("got here");
pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
});

// end the input stream and allow the process to exit
pyshell.end(function (err) {
  if (err) throw err;
  console.log('finished');
});


          // Return account data
          var result = {"result" : 0 };

          resp.json({result: result});
        }
      });
    }
  });
});

//------------------------------------------------------------------------------------------------------------------------------
// QUERY ENDPOINT - Request information about an address. Takes an address and google_id.
//------------------------------------------------------------------------------------------------------------------------------

app.post('/api/query', function(req, resp) {
// get the google_id
// get the address
    var google_id = req.body.google_id;
    var address = req.body.address;
    var my_message = {}
    var pyshell = new PythonShell('query.py');
    my_message.profID = google_id;
    my_message.addr = address;

    my_message = JSON.stringify(my_message);

    console.log(my_message);
    pyshell.send(my_message);
    pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
            console.log(message);
    });

// end the input stream and allow the process to exit
    pyshell.end(function (err) {
        if(err) throw err;
        console.log('finished');
});




    var result = {"result" : 0 };
    resp.json({result: result});

});



//------------------------------------------------------------------------------------------------------------------------------
// SAVE ENDPOINT - Save a new location to database for a user. Takes google_id and a list which holds location information.
//------------------------------------------------------------------------------------------------------------------------------

app.post('/api/save', function(req, resp) {
// get the google_id
    var google_id = req.body.google_id;
// get the list
    var list = req.body.list;

// iterate through list

    var public_token = req.body.public_token;


    var result = {"result" : 0 };

    resp.json({result: result});

});







//------------------------------------------------------------------------------------------------------------------------------
// DELETE ENDPOINT - Delete an address from the database. Takes an address and google_id.
//------------------------------------------------------------------------------------------------------------------------------


app.delete('/api/favorite', function(req, resp) {
// get the google_id
    var google_id = req.body.google_id;
// get the list
    var list = req.body.list;

// iterate through list

    var public_token = req.body.public_token;


    var result = {"result" : 0 };

    resp.json({result: result});

});







//------------------------------------------------------------------------------------------------------------------------------
// VIEW ENDPOINT - Get request on /favorite endpoint. Takes a google_id, and dumps everything related to the user.
//------------------------------------------------------------------------------------------------------------------------------


app.get('/api/favorite', function(req, resp) {
// get the google_id
    var google_id = req.body.google_id;
// get the list
    var list = req.body.list;

// iterate through list

    var public_token = req.body.public_token;


    var result = {"result" : 0 };

    resp.json({result: result});

});



//------------------------------------------------------------------------------------------------------------------------------
// PROFILE ENDPOINT - Request information about an address. Takes an address and google_id.
//------------------------------------------------------------------------------------------------------------------------------

app.post('/api/profile', function(req, resp) {
// get the google_id
// get the address
    var google_id = req.body.google_id;
    var my_message = {}
    var pyshell = new PythonShell('dump.py')
    my_message.profID = google_id;

    my_message = JSON.stringify(my_message);

    console.log(my_message);
    pyshell.send(my_message);
    pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
            console.log(message);
	var result = message;
	resp.json(result);	
    });

// end the input stream and allow the process to exit
    pyshell.end(function (err) {
        if(err) throw err;
        console.log('finished');
});

});











app.listen(8080, function(){});
