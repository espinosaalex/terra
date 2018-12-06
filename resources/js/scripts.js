// choose your hypha
// proceed to next spore
// switch to new hypha

let contInd = 0;
// let blockId = 0;
let channel = '';
let right = 0;
let left = 0;

function refreshHyphae(blockId){
  fetch("http://api.are.na/v2/blocks/" + blockId.toString() + "/channels")
  .then(response => response.json())
  .then((data) => {
    data.channels.forEach(function(hypha){
      $("#spore-content").append("<p data-id=" + hypha.id.toString() + " class ='hypha'>" + hypha.title + "</p>");
    });
    let shuffled = data.channels;
    shuffle(shuffled);
    console.log(shuffled.length);
    //fix in case less than 2 hypha
    if (shuffled.length >= 1) {
      right = shuffled[0].id;
    }
    if (shuffled.length >= 2) {
      left = shuffled[1].id;
    }
    });
}


function getChannel(id){
  fetch("http://api.are.na/v2/channels/" + id.toString() + "?page=2&amp;per=30") //"/contents"
  .then(response => response.json())
  .then((data) => {
    channel = data;
    $("#hypha-title").text(data.title);
    contInd = 0;
    getSpore();
  });

//   $.ajax({
//     url: "http://api.are.na/v2/channels/" + id.toString(),
//     dataType: 'json',
//     async: false,
//     success: function(json){
//       channel = json
//       $("#hypha-title").text(channel.title);
//     }
// });
}



function getSpore(){
  console.log(channel.contents);
  console.log(contInd);
  if (channel.contents.length <= contInd) {
    console.log("end");
  }
  else {
    let block = channel.contents[contInd];
    let blockId = block.id;
    if (channel.contents[contInd].class == "Image") {
      console.log(block.image);
      $("#spore-content").html("<img src=" + block.image.large.url + ">");
    }

    else {
      $("#spore-content").html(channel.contents[contInd].content_html);
      $("#spore-id").text("spore " + channel.contents[contInd].id.toString());
    }

    contInd += 1;
    refreshHyphae(blockId);
  }

}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



$( document ).ready(function() {
  getChannel("terrarism-jo_a18tk90");

});

$('.container').on('click', '.hypha', function(e) {
  getChannel($(e.target).attr("data-id"));
  contInd = 0;
});

$( "#forward" ).click(function() {
  getSpore();
});

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
          getChannel(left);
        break;

        case 38: // up
          getSpore();
        break;

        case 39: // right
          getChannel(right);
        break;

        case 40: // down
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

