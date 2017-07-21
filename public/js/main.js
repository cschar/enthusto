



var x = 0;
var scX = 0;
var canvas = document.getElementById('canvasSection');
var ctxs = canvas.getContext('2d');
ctxs.canvas.width  = 1400;
ctxs.fillStyle    = '#0ff';
ctxs.font         = 'italic 30px sans-serif';
ctxs.textBaseline = 'top';
ctxs.font         = 'bold 30px sans-serif';
    
//only for updating GUI of player graph
var innerX = 0;
var guiInterval = 200; //draw each 200ms 
var innerSplits = (1000 / guiInterval)


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
    ctxs.fillRect(0, 130,1000,200);
    ctxs.fillStyle='#000';
    ctxs.fillRect(canvasX, 130,5,200);


    var colors = ['#F66', '#66F', '#6C6', '#FF6', '#C3C']

		for( var i=0; i < vueapp.users.length; i++){
		  var user = vueapp.users[i];

		  if ( i > colors.length -1 ){ ctxs.fillStyle = '#999'}
		  else {ctxs.fillStyle = colors[i]}
		 

			var blipY = Math.max(user.level*3, 0);
	    ctxs.fillRect(canvasX, blipY,2,10);
	    // ctxs.strokeText(payload.data.value, x*3, 50);

  	}
    innerX += 1;

}


function setUpSoundCloud(){

	var widgetIframe = document.getElementById('sc-widget');
	if ( widgetIframe == null) return;

	var widget = SC.Widget(widgetIframe);

  widget.bind(SC.Widget.Events.READY, function() {
      widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
      scX = data.currentPosition/1000
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
	/////SOUND STUFF
	var socketConnect = window.location.href.split('/')
	socketConnect = socketConnect[0] + "//" + socketConnect[2] 

	var socket = io.connect(socketConnect) //http://mysite.com:3000
  window.s = socket;
  var roomID = window.location.href.split('/'); roomID = roomID[roomID.length - 1];
  var listenerID = '';
  var widget = setUpSoundCloud();
 	document.w = widget;

 	socket.on('masterToggle', function(data){
 		console.log("told to toggle sc by" + data.user.listenerID);
 		widget.toggle();
 })

  socket.on('masterReset', function(data){
 		console.log("told to reset sc by" + data.user.listenerID);
 		widget.seekTo(0);
 })

	var app = new Vue({
    el: '#vueapp',
    data: {
   	  listenerID: '',
   	  level: 0,
      users: [{listenerID:'dummy', level: 0}]
  	},
  	methods:{
  		masterToggle: function(){
  			console.log('playing')
			 	socket.emit('masterToggle')
			 	widget.toggle();
  		},
  		masterReset: function(){
  			console.log('reset')
			 	socket.emit('masterReset')
			 	widget.seekTo(0);
  		},
  		incr: function(){
  			// y = 0; //y has to be set to the current level to balance out graph 
  			//y = this.level;
  			console.log('setting y to ' + this.level);
  			socket.emit('clientIncr', {listenerID: listenerID });
  		}
  	}
	})




	var interval = setInterval( drawGraph.bind(null, app), guiInterval);
  

 socket.on('greet', function (data) {
    console.log(data);
    listenerID = data.listenerID;
    app.listenerID = data.listenerID;
    
    console.log("attempting to connect to listening room w my id: " + listenerID)
    //dont need to give roomid, this is a feature
    //
    socket.emit('startConnect',
     { room: roomID, 
       listenerID: listenerID} )
  });

 socket.on('FinishConnect', function(data){
 	app.users = data.users;
 	
 })

 socket.on('updateRoom', function(data){
 	console.log('updating room with ' + data);
 	app.users = data.users;
 	for( var i=0; i < data.users.length; i++){
 		if ( data.users[i].listenerID == app.listenerID){
 			app.level = data.users[i].level;
 			break;
 		}
 	}
 })



});

