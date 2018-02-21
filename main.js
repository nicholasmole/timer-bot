const notifier = require('node-notifier');
const path = require('path');
var blessed = require('blessed');

var Spinner = require('cli-spinner').Spinner;
 
var spinner = new Spinner('processing.. %s');

const keyBindings = {};

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
	border: {
    type: 'line'
  },
	style: {
		transparent: true,
		bg: '#ff0000',
		border: {
			fg: '#0000ff',
			bg: '#000011',
		},
	}
});
const messageInput = blessed.textbox({
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
  style: {
		transparent: true,
	},
	border: {
    fg: '#0000ff',
    type: 'line',
	},
});
const messageInputTitle = blessed.text({
	width: '50%',
	top: '50%',
	left: '5%',
	align: 'left',
	content: '{bold}Search{/bold}',
	tags: true,
});
const playbutton = blessed.text({
	width: '20%',
	top: '50%',
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
messageInput.on('keypress', (ch, key) => {
	if (Object.keys(keyBindings).includes(key.full)) {
		messageInput.cancel();
		callKeyBindings(ch, key);
	}
});
playbutton.on('element click', function(el, mouse) {
	//el.focus = true;
	setInterval(intervalFunc, 1000);
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
function intervalFunc() {
	messageInputTitle.content = toString(time);
	messageInputTitle.content = ""+time+"";
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

