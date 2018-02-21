const notifier = require('node-notifier');
const path = require('path');
var blessed = require('blessed');
const wrap = require('word-wrap');
const sys = require('util');
const exec = require('child_process').exec;

var Spinner = require('cli-spinner').Spinner;
 
var spinner = new Spinner('processing.. %s');

const keyBindings = {};

var stopwatchon = 0;

const loading = blessed.screen({
  autopadding: true,
  smartCSR: true,
  title: 'Slack-a-tron',
  fullUnicode: true,
});
const loadingcontainer = blessed.box({
  width: '25%',
	height: '25%',
	left: '5%',
	top: '5%',
	draggable: true,
	padding: '0px',
	border: {
    type: 'line'
  },
	style: {
		padding: '0 0 0 0',
		transparent: true,

		border: {
			fg: '#0000ff',
			bg: '#000011',
		},
	}
});
const messageInput = blessed.textarea({
	width: '90%',
	height: '80%',
	left: '5%',
	top: '5%',
	keys: true,
	vi: true,
	inputOnFocus: true,
	mouse: true,
	rows: 3,
	cols: 3,
	lines: 3,
	wrap: true,
	wordwrap: true,
	padding: '0px',
  style: {
		padding: '0px',
		transparent: true,
	},
	border: {
    fg: '#0000ff',
    type: 'line',
	},
});
const messageInputTitle = blessed.text({
	width: '50%',
	top: '80%',
	left: '5%',
	align: 'left',
	content: '{bold}Time 0:00{/bold}',
	tags: true,
});
const playbutton = blessed.text({
	width: '20%',
	top: '80%',
	left: '50%',
	align: 'right',
	mouse: true,
	style: {
		hover: {
			fg: 'green',
			bg: 'white'
		},
	},
	content: '{bold} ▶ {/bold}',
	tags: true,
});

loading.append(loadingcontainer);
loadingcontainer.append(messageInput);
loadingcontainer.append(messageInputTitle);
loadingcontainer.append(playbutton);
loading.render();

// spinner.setSpinnerString('|/-\\');
// spinner.start();

const onFocus = (component) => {
	component.style.border = { fg: '#cc6666' }; // eslint-disable-line no-param-reassign
	loading.render();
};
const onBlur = (component) => {
	component.style.border = { fg: '#888' }; // eslint-disable-line no-param-reassign
	loading.render();
};
console.log("ddd");
keyBindings.escape = process.exit.bind(null, 0); 
keyBindings['C-w'] = messageInput.focus.bind(messageInput); // ctrl-w for write
playbutton.enableMouse();



loading.on('keypress', (ch, key) => {
	const fn = keyBindings[key.full];
	if (fn) {
		fn();
	}
});
exec(`column=10  2>/dev/null & say "Good Morning" 2>/dev/null ` , (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

});
messageInput.on('keypress', (ch, key) => {
	if (Object.keys(keyBindings).includes(key.full)) {
		messageInput.cancel();
		callKeyBindings(ch, key);
		messageInput.content = wrap(messageInput.content, {width: 10});
	}
});
playbutton.on('element click', function(el, mouse) {
	//el.focus = true;
	if(stopwatchon){

		clearInterval(stopwatchon);
		stopwatchon = 0;

	}else{

		stopwatchon = setInterval(intervalFunc, 200);

	}
	//stopwatchon = stopwatchon == 0 ?  setInterval(intervalFunc, 200): 0;
});
messageInput.on('focus', onFocus.bind(null, messageInput));
messageInput.on('blur', onBlur.bind(null, messageInput));
//loading.on('keypress', callKeyBindings);
// var Stopwatch = require("node-stopwatch").Stopwatch;
 
// var stopwatch = Stopwatch.create();
// stopwatch.start();
 
/*
my long task here
*/
time=0;

function stringTime(time) {
	//hours 
	var hours = 0;
	hours = parseInt(time/3600);
	while(time > 3600){time-=3600}
	//minutes 
	const minutes = parseInt(time/60);
	let minuteszero = '';
	if(minutes < 10){
		minuteszero = '0';
	} else{
		minuteszero = '';
	}
	//seconds
	while(time > 60){time-=60}
	let zero = '';
	if(time < 10){
		zero = '0';
	} else{
		zero = '';
	}
	if (hours > 0){
		return (hours + ":" + minuteszero + minutes + ":" + zero + time );
	} else {
		return ( minuteszero + minutes + ":" + zero + time );
	}
}

function intervalFunc() {
	//messageInputTitle.content = "Time " + stringTime(time);
	messageInputTitle.content = ""+stringTime(time)+"";
	//console.log(stringTime(time));
	time+=1
	loading.render();
}

// setInterval(intervalFunc, 1000);

function classic(){

	
	 console.log("ddd");
	// console.log("ticks: " + stopwatch.elapsedTicks);
	// console.log("milliseconds: " + stopwatch.elapsedMilliseconds);
	// console.log("seconds: " + stopwatch.elapsed.seconds);
	// console.log("minutes: " + stopwatch.elapsed.minutes);
	// console.log("hours: " + stopwatch.elapsed.hours);

//setTimeout(classic,100000);
}
//setTimeout(function(){ classic() },1000);
//stop it now 
//stopwatch.stop();

