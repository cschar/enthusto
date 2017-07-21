
function setUpSoundCloud(){

var widgetIframe = document.getElementById('sc-widget');
if ( widgetIframe == null) return;

var widget = SC.Widget(widgetIframe);

    widget.bind(SC.Widget.Events.READY, function() {
        widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
        // console.log(data);
        // output.val(data.relativePosition)
        var val = Math.floor(data.currentPosition/1000)
        // songProgress.val(val);
        // songProgressSlider.val(val);
    });

        widget.bind(SC.Widget.Events.SEEK, function(data) {
            console.log(data);
        })


        widget.bind(SC.Widget.Events.PLAY, function() {

        });
        widget.bind(SC.Widget.Events.PAUSE, function() {

        });

});
  
  // set new volume level
  widget.setVolume(50);
  // widget.seekTo(10000);


}

$(document).ready(function() {
 var socket = io.connect('http://localhost:3000')
 var roomID = window.location.href.split('/'); roomID = roomID[roomID.length - 1];

 var listenerID = '';

 var app = new Vue({
  el: '#vueapp',
  data: {
  	listenerID: '',
    users: [{id:'bob'}]
  }
})

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
		 	// idIndex = app.users.indexOf(data.listenerID)
 	// if ( idIndex > -1){ app.users.splice(idIndex, 1)}
 	app.users = data.users;
 })



 setUpSoundCloud();
 var counter = $('#counter')

 $('#start').click(function(){
 	counter.html(counter.html() + '1')
 	socket.emit('clientIncr', {listenerID: listenerID, hey: 'hey', counter: counter.html() });
 })

 socket.on('incr', function(data){	
 	counter.html(counter.html() + '1')
 })


});