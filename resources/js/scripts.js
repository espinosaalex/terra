// choose your hypha
// proceed to next spore
// switch to new hypha

let contInd = 0; //index of current content in channel
// let blockId = 0;
let channel = '';
let right = 0;
let left = 0;

function refreshHyphae(blockId){
  fetch("https://api.are.na/v2/blocks/" + blockId.toString() + "/channels")
  .then(response => response.json())
  .then((data) => {
    let hyphae = []
    console.log(data.channels);
    data.channels.forEach(function(hypha){
      if ((hypha.user_id == 75780) && (hypha.title != "terrarism") && (hypha.id != channel.id)){
        $("#spore-content").append("<p data-id=" + hypha.id.toString() + " class ='hypha'>" + hypha.title + "</p>");
        hyphae.push(hypha);
      }

    });
    shuffle(hyphae);
    console.log(hyphae);
    //fix in case less than 2 hypha
    if (hyphae.length == 0) {
      right = 0;
      left = 0;
    }
    else if (hyphae.length == 1) {
      right = hyphae[0].id;
      left = hyphae[0].id;
    }
    else if (hyphae.length >= 2) {
      right = hyphae[0].id;
      left = hyphae[1].id;
    }
    });
}


function getChannel(id){
  current_chan = id;
  fetch("https://api.are.na/v2/channels/" + id.toString() + "?page=1&amp;per=30") //figure out pagination
  .then(response => response.json())
  .then((data) => {
    channel = data;
    $("#hypha-title").text(data.title);
    contInd = 0;
    getSpore();
  });
}



function getSpore(){
  console.log(channel.contents);
  console.log(contInd);
  if (channel.contents.length == contInd) {
    console.log("end");
    return endOfHypha();
  }
  else {
    let block = channel.contents[contInd];
    let blockId = block.id;
    if (channel.contents[contInd].class == "Image") {
      console.log(block.image);
      $("#spore-content").html("<img src=" + block.image.display.url + ">");
    }

    else {
      $("#spore-content").html(channel.contents[contInd].content_html);
      $("#spore-id").text("spore " + channel.contents[contInd].id.toString());
    }

    contInd += 1;
    refreshHyphae(blockId);
  }
}

function endOfHypha(){
  $("#spore-content").html("<p>you have reached the end of this hypha</p>");
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
          if (left != 0) {
           getChannel(left);
          }
        break;

        case 38: // up
          getSpore();
        break;

        case 39: // right
          if (right != 0) {
           getChannel(right);
          }
        break;

        case 40: // down
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});


