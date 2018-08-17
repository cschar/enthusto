


//chart code


window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};


var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var config = {
			type: 'line',
			data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [{
					label: 'My First dataset',
					backgroundColor: window.chartColors.red,
					borderColor: window.chartColors.red,
					data: [
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor()
					],
					fill: false,
				}, {
					label: 'My Second dataset',
					fill: false,
					backgroundColor: window.chartColors.blue,
					borderColor: window.chartColors.blue,
					data: [
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor()
					],
				}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Chart.js Line Chart'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Month'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Value'
						}
					}]
				}
			}
		};


		// window.onload = function() {
		// 	var ctx = document.getElementById('canvasChart').getContext('2d');
		// 	window.myLine = new Chart(ctx, config);
		// };


		// END chart code

var x = 0;
var scX = 0;

//only for updating GUI of player graph
var innerX = 0;
var guiInterval = 200; //draw each 200ms 
var innerSplits = (1000 / guiInterval)
var CANVAS_WIDTH = 1400




function setUpSoundCloud(){
	var widgetIframe = document.getElementById('sc-widget');
	if ( widgetIframe == null){
		console.log("sound cloud widget failed to load")
		return;
	}
	var widget = SC.Widget(widgetIframe);

  widget.bind(SC.Widget.Events.READY, function() {
      widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
      	scX = data.currentPosition/1000
			});
			widget.getDuration(function(duration){
				// alert(parseInt(duration)/1000);
				CANVAS_WIDTH = (parseInt(duration)/1000) * 5;
				var section = document.getElementById("canvasSection")
				section.width = CANVAS_WIDTH;
				var ctxs = section.getContext('2d');
				ctxs.canvas.width  = CANVAS_WIDTH;
			});

	  widget.bind(SC.Widget.Events.SEEK, function(data) {console.log(data);})
	  widget.bind(SC.Widget.Events.PLAY, function() {});
	  widget.bind(SC.Widget.Events.PAUSE, function() {});
	});

  // set new volume level
  widget.setVolume(50);
  // widget.seekTo(10000);
  return widget;
}




$(document).ready(function() {
	var canvas = document.getElementById('canvasSection');
	if(canvas == null){ //we're not on a detail page
	  console.log("no canvas")
		return;
	}
	var ctxs = canvas.getContext('2d');
	ctxs.canvas.width  = CANVAS_WIDTH;
	ctxs.fillStyle    = '#0ff';
	ctxs.font         = 'italic 30px sans-serif';
	ctxs.textBaseline = 'top';
	ctxs.font         = 'bold 30px sans-serif';


function drawGraph(vueapp){
    //since we currently increment X 1 unit each second,
    //use innerX to split up the 1 second unit for better graphing

    if (innerX > innerSplits){
        innerX = 0;
    }
    // canvasX = x*innerSplits + innerX;
    // canvasX = x*innerSplits;
    canvasX = Math.floor(scX*innerSplits); // for a smooth line

    // canvasX = Math.floor(scX)*innerSplits;  // for a broken line

    //redraw canvas
    ctxs.fillStyle='#FFF';
    // ctxs.fillRect(0, 0,1000,1000);

    //Draw length of song
		ctxs.fillStyle='#F00';
		

    ctxs.fillRect(0, 130, canvas.width ,200);
    ctxs.fillStyle='#000';
    ctxs.fillRect(canvasX, 130,5,200);


    //5 ppl max
    var colors = ['#F66', '#66F', '#6C6', '#FF6', '#C3C']

		for( var i=0; i < vueapp.users.length; i++){
		  var user = vueapp.users[i];

		  if ( i > colors.length -1 ){ ctxs.fillStyle = '#999'}
		  else {ctxs.fillStyle = colors[i]}


			var blipY = Math.max(user.level*3, 0);
	    ctxs.fillRect(canvasX, blipY,2,10);
			// ctxs.strokeText(payload.data.value, x*3, 50);
			
			// var month = MONTHS[config.data.labels.length % MONTHS.length];
			// 	config.data.labels.push(month);

			// 	config.data.datasets.forEach(function(dataset) {
			// 		dataset.data.push(randomScalingFactor());
			// 	});

			// 	window.myLine.update();

  	}
    innerX += 1;

}


	/////SOUND STUFF

	//connect to http://mysite.com:3000
	var socketConnect = window.location.href.split('/')
	socketConnect = socketConnect[0] + "//" + socketConnect[2]
	var socket = io.connect(socketConnect)
  window.s = socket;

  var roomID = window.location.href.split('/'); roomID = roomID[roomID.length - 1];
  var listenerID = '';
  var widget = setUpSoundCloud();
 	document.w = widget;


	//if listenerID is same as first user id, set that user to master
	var app = new Vue({
    el: '#vueapp',
    data: {
   	  listenerID: '',
			synchResponsibilitySet: false,
   	  level: 0,
      incrHeld: null,
      users: [{listenerID:'dummy', level: 0}]
  	},
  	methods:{
			isMaster: function(){
				return (this.listenerID == this.users[0].listenerID)
			},
  		masterToggle: function(){

				widget.toggle();
				widget.isPaused(function(isPaused){
					console.log("is paused???")
					console.log(isPaused)
					if(isPaused){socket.emit('masterToggle', {isPaused: true})}
					if(!isPaused){socket.emit('masterToggle', {isPaused: false})}
				})


  		},
      mouseDown: function(e) {
        //emit socket, start interval

        socket.emit('clientIncr', {level: 1});
        level = 1
        function incr_every_250(){
          console.log("incr")
          level += 1;
          //eevery 750 ms
          if ( level % 3 == 0 && level < 7){
            socket.emit('clientIncr', {level: 3});
          }
          if ( level % 3 == 0 && level >= 7){ //more after 1500ms
            socket.emit('clientIncr', {level: 5});
          }
        }
        this.incrHeld = setInterval(incr_every_250, 250)
    },
      mouseUp: function(e) {
        //clear interval
        clearInterval(this.incrHeld)
    },
  		incr: function(){
  			//socket.emit('clientIncr', {listenerID: listenerID });
  		}
  	}
	})




	var interval = setInterval( drawGraph.bind(null, app), guiInterval);
  

 socket.on('greet', function (data) {
    listenerID = data.listenerID;
    app.listenerID = data.listenerID;
    
    console.log("attempting to connect to listening room w my id: " + listenerID)
    //dont need to give roomid, this is a feature
    //
    socket.emit('startConnect',
     { room: roomID, 
       listenerID: listenerID} )
  });


 socket.on('updateRoom', function(data){

   if (data.roomID != roomID){
     //skip, not our data
     return;
   }else{
     console.log('updating room ');
   }


 	app.users = data.users;
 	for( var i=0; i < data.users.length; i++){
 		if ( data.users[i].listenerID == app.listenerID){
 			app.level = data.users[i].level;
 			break;
 		}
 	}

	 //master
	 //set synch
	 // every x seconds, broadcast where master listener is at
	//UpdateRoom signal will have a specific update to signal clients to seek new position
	if (app.isMaster()){

		//console.log(" synch resp set?")
		//console.log(app.synchResponsibilitySet)

		if( !app.synchResponsibilitySet){
			function periodicallyBroadcastMasterSongPosition(){
				 widget.getPosition(function(mseconds){
					socket.emit('masterSync', mseconds)
		 		})
			}
			setInterval(periodicallyBroadcastMasterSongPosition, 3000)
			app.synchResponsibilitySet = true;
		}
	}


	 if (!app.isMaster()){
		 widget.isPaused(function(isPaused){
				if(isPaused && data.isPaused) {
					// do nothing
				}else if(isPaused && !data.isPaused){
					widget.play()
				}else if(!isPaused && data.isPaused){
					widget.pause()
				}
		 })


	 }
 })



	socket.on('masterSync', function (data) {
    if (data.roomID != roomID){
     //skip not our sync data
     return;
   }else{
      console.log("Received updateSync")
   }

		//clients
		//reset widget position if they are de-synchronized by more than 1 second
		widget.getPosition(function (mseconds) {
			var listenerOffset = Math.abs(mseconds - data.songPositionInMilliseconds)
			if (listenerOffset > 1000) {
				console.log("Resynchronizing. milliseconds off by :" + listenerOffset);
				widget.seekTo(data.songPositionInMilliseconds)

			}
		})
	})



});

