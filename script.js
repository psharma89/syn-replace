var request = require('request');
var async = require('async');

var account_id = {account_id};
var i = 0;
var r = 0;
var API_KEY = {API_KEY};
var fs = require('fs');


function getLinesNumberOf(input, word){
  var line_numbers=[];
  input.split("\n").forEach(function(line, index){
    if( line.indexOf(word)>=0 ) line_numbers.push(index);
  });
  return line_numbers;
};

function replaceLineNumber(arr, val, str) {
  var idx = arr.indexOf(val);
  arr[idx] = str;
  return arr;
};

function joinLinesArray(arr) {
  return arr.join("\n");
};

function replaceString(scriptText, str, replace_with_str) {
  if (scriptText.indexOf(str) > -1) {
    scriptText = scriptText.replace(str, replace_with_str);
  }
  return scriptText;
};

function convertToStr(scriptText) {
  var buffer = new Buffer(scriptText, 'base64')
  var s = buffer.toString();
  return s;
};

var options = {
  url: 'https://synthetics.newrelic.com/synthetics/api/v1/monitors',
  headers: {
    'X-Api-Key': API_KEY
  },
  method: 'GET'
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var monitors = JSON.parse(body);
    async.eachSeries(monitors.monitors, function(monitor, done){
    	if (monitor.type=='SCRIPT_BROWSER') {
      		var url = 'https://synthetics.newrelic.com/synthetics/api/v1/monitors/' + monitor.id + '/script';
  	    	var options = {
    			  url: url,
    			  headers: {
    			    'X-Api-Key': API_KEY
    			  },
    			  method: 'GET'
    			};
  			request(options, function(err, res, b){
          var j;
          try {
            j = JSON.parse(b);
          } catch(e){

          }


          var _s = convertToStr(j.scriptText);

          //example 
          //_s = replaceString(scriptText, 'foo', 'bar');

          //replace line

          // var a = _s.split("\n");
          //var lines_with_word = getLinesNumberOf(_s, 'foo');
          // for (var i = 0; i < lines_with_word.length; i++) {
          //   a = replaceLineNumber(a, lines_with_word[i],'bar');
          // }
          //a = joinLinesArray(a)


          var u = new Buffer(_s);
          var scr = u.toString('base64');
          var options = {
            url: url,
            headers: {
              'X-Api-Key': API_KEY
            },
            method: 'PUT',
            json: true,
            body: {scriptText: scr}
          };

          request(options, function(err, res, b){
            
            
            if (err) {
              console.log(err);
            }
            if (b) {
              console.log(b);
            }
            done();
            
          });     
  			});	
    	} else {
        done();
      }
    	
    });
  }
}

request(options, callback);