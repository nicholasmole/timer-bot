const notifier = require('node-notifier');
const path = require('path');
var blessed = require('blessed');

var Spinner = require('cli-spinner').Spinner;
 
var spinner = new Spinner('processing.. %s');

const loading = blessed.screen({
  autopadding: true,
  smartCSR: true,
  title: 'Slack-a-tron',
  fullUnicode: true,
});
const loadingcontainer = blessed.box({
  width: '90%',
	height: '90%',
	left: '5%',
	top: '5%',
	border: {
    fg: '#0000ff',
    type: 'line',
  },
});

loading.append(loadingcontainer);
loading.render();

spinner.setSpinnerString('|/-\\');
spinner.start();
console.log("ddd");
var Stopwatch = require("node-stopwatch").Stopwatch;
 
var stopwatch = Stopwatch.create();
stopwatch.start();
 
/*
my long task here
*/
function classic(){

	
	 console.log("ddd");
	// console.log("ticks: " + stopwatch.elapsedTicks);
	// console.log("milliseconds: " + stopwatch.elapsedMilliseconds);
	// console.log("seconds: " + stopwatch.elapsed.seconds);
	// console.log("minutes: " + stopwatch.elapsed.minutes);
	// console.log("hours: " + stopwatch.elapsed.hours);

//setTimeout(classic,100000);
}
setTimeout(function(){ classic() },1000);
//stop it now 
//stopwatch.stop();

