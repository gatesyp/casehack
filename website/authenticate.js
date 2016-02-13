var express = require('express');
var plaid = require('plaid');
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');
var pyshell = new PythonShell('algorithm.py');

var app = express();


var plaidClient = new plaid.Client("56bef3967c1539e11d919a62",
                                   "94d90ed8d84083a381c15f4bc73be7",
                                   plaid.environments.tartan);

app.use(bodyParser.urlencoded({ extended : false}));

app.post('/authenticate', function(req, resp) {
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
          start_date : "60 days ago", end_date : "today"
      }, function(err, res) {

        if (err != null) {
            console.log(err);
            resp.send(err);
          // Handle error!
        } else {
          var mycount = 0;
        //   var secondCount = 0;
          var myArray = {};
          // An array of accounts for this user, containing account
          // names, balances, and account and routing numbers.
          for (var check in res.transactions) {
              if(res.transactions[check]["type"]["primary"] == "place")
              {
                  for (var key in res.transactions[check]["category"])
                  {
                      n = mycount.toString();
                      v = secondCount.toString();
                       myArray[n] = res.transactions[check]["category"];
                       mycount++;
                //       secondCount++;
                  }
                  //secondCount = 0;
                //   for (var key in res.transactions[check]["category"])
                //   {
                //       myJson = myJson + "\"" + count + "\"" + ":" + "\"" + res.transactions[check]["category"][key] + "\"" + ","; console.log("----");
                  //
                //       ++count;
                //   }
              }
          }
          var myJsonString = JSON.stringify(myArray);
          var lastly = JSON.stringify(myJsonString, null, 4)
          pyshell.send(myJsonString);

pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
});

// end the input stream and allow the process to exit
pyshell.end(function (err) {
  if (err) throw err;
  console.log('finished');
});

//------------------------------------------------------------------------------------------------------------------------------
          var transactions = res.transactions;

          // Return account data
          resp.json({transactions: transactions});
        }
      });
    }
  });
});

app.listen(8080, function(){});
