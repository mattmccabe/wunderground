//Import request module to make http requests to wunderground api
var request = require('request');

//Import file system so we can write the results to a file
var fs = require('fs');

//Function to get two digit months
var getMonth = function(d) {
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];

  return months[d.getMonth()];
};

var addDays = function(date, days) {
    var result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
}

//Function to get two digit days
var getDay = function(d) {

  if(d.getDate() < 10)
  {
    return '0' + d.getDate().toString();
  }

  return d.getDate().toString();

};

//Specify the year you want historical temps for
var year = 2015;
//Specify the month you want historical temps for 1=Jan, 2=Feb, 3=Mar etc
var month = 3;
//Specify the starting day
var day = 1;
//Specify how many days you want temps for
var numDays = 3;
//Specify the zip code you want temps for
var zip = '85034';
//Output file name
var fileName = '85034_hourly.csv';


//Enter you wunderground api key
var key = '';

var url = '';
var results = [];

var header = 'zip,year,month,day,hour,minute,tempm,tempi\n';
fs.writeFile(fileName, header, function(err, data){
  if (err) {
    return console.log(err);
  }
});

var d = new Date(year, month-1, day);

while(numDays > 0)
{
    
  url = 'http://api.wunderground.com/api/' + key + '/history_' + d.getFullYear() + getMonth(d) + getDay(d) + '/q/' + zip + '.json';
  
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      
      var data = JSON.parse(body);
      var hours = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    
      for(var j=0;j<data.history.observations.length;j++){
        var obs = data.history.observations[j];

        var hour = parseInt(obs.date.hour); 
        if(!hours[hour])
        {
          console.log('The Hour: ' + hour + ' ' + obs.tempm + 'C ' + obs.tempi + 'F');
          hours[hour] = true;
          results.push({zip:zip,day:obs.date.pretty,hour:obs.date.hour,tempm:obs.tempm,tempi:obs.tempi});
          var fileOutput = zip + ',' + obs.date.year + ',' + obs.date.mon + ',' + obs.date.mday + ',' + obs.date.hour + ',' + obs.date.min + ',' + obs.tempm + ',' + obs.tempi + '\n';
          fs.appendFileSync(fileName, fileOutput);
        }
      }
    }
    else
    {
      console.log("!!ERROR!!");
      console.log(error);
    }
  });

  d = addDays(d, 1);
  numDays--;
}








