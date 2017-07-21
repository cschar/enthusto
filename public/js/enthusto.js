
var x = 0;
var p1y = 0;
var p2y = 0;
var canvas = document.getElementById('canvasSection');
var ctxs = canvas.getContext('2d');
    
//only for updating GUI of player graph
var innerX = 0;
var guiInterval = 200; //draw each 200ms 
var innerSplits = (1000 / guiInterval)

function increment(){
    //since we currently increment X 1 unit each second,
    //use innerX to split up the 1 second unit for better graphing

    if (innerX > innerSplits){
        innerX = 0;
    }
    x = $($('#values').children('p')[0]).find("output").val()
    canvasX = x*innerSplits;

    
    //redraw canvas
    ctxs.fillStyle='#FFF';
    // ctxs.fillRect(0, 0,1000,1000);

    //Draw length of song
    ctxs.fillStyle='#FF0000';
    ctxs.fillRect(0, 130,1000,200);
    ctxs.fillStyle='#000000';
    ctxs.fillRect(canvasX, 130,5,200);


    //draw player 1 rect
    ctxs.fillStyle = '#F66'
    ctxs.fillRect(canvasX, p1y,1,10);
    // ctxs.strokeText(payload.data.value, x*3, 50);

    //draw player 2 rect
    ctxs.fillStyle = '#66F'
    ctxs.fillRect(canvasX, p2y,1,10);
    // ctxs.strokeText(payload.data.value, x*3, 50);
    innerX += 1;

}
    
function draw()
{

    //paint the text
    var canvas = document.getElementById('canvasSection');
    var context = canvas.getContext('2d');
    context.canvas.width  = window.innerWidth;
    // contex.canvas.height = window.innerHeight;


    context.fillStyle    = '#0ff';
    context.font         = 'italic 30px sans-serif';
    context.textBaseline = 'top';
    context.font         = 'bold 30px sans-serif';
    

    //paint the square

    var canvasSquare = document.getElementById('canvasSquare');
    var ctxSquare = canvas.getContext('2d');

    ctxSquare.fillStyle='#FF0000';
    ctxSquare.fillRect(0, 130,1000,200);

    return ctxSquare;
}


var widgetIframe = document.getElementById('sc-widget'),
widget       = SC.Widget(widgetIframe);


$(document).ready(function() {


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

    // isPaused.val(0);
    // isPausedSlider.val(0);
    // isPausedSlider.change();


    // get information about currently playing sound
    // widget.getCurrentSound(function(currentSound) {
      // console.log('sound ' + currentSound.get('') + 'began to play');
  //     widget.getPosition(function(position){
  //   console.log("the positino is " + position);
  // })
    // });
});
  // get current level of volume
  widget.getVolume(function(volume) {
    console.log('current volume value is ' + volume);
});

  widget.getPosition(function(position){
    console.log("the positino is " + position);
})
  // set new volume level
  widget.setVolume(50);
  // widget.seekTo(10000);
});


    draw();
    var interval = setInterval( increment, guiInterval);

});

