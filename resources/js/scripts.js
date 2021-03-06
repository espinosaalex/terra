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
    data.channels.forEach(function(hypha){
      if ((hypha.user_id == 75780) && (hypha.title != "terrarism") && (hypha.id != channel.id)){
        $("#spore-content").append("<span data-id=" + hypha.id.toString() + " class ='hypha'>" + hypha.title + "</span>");
        hyphae.push(hypha);
      }

    });
    shuffle(hyphae);
    //fix in case less than 2 hypha
    if (hyphae.length == 0) {
      right = 0;
      left = 0;
      $("#box-left").hide();
      $("#box-right").hide();
    }
    else if (hyphae.length == 1) {
      right = hyphae[0];
      left = hyphae[0];
      $("#box-left").show();
      $("#box-right").show();
    }
    else if (hyphae.length >= 2) {
      right = hyphae[0];
      left = hyphae[1];
      $("#box-left").show();
      $("#box-right").show();
    }
    if (right != 0) {
      console.log(left.title);
      $("#box-left").text(left.title);
      $("#box-right").text(right.title);
    }
    else {
      $("#box-left").text();
      $("#box-right").text();
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
    $("#channel-img").attr("src", "resources/images/" + data.title + ".jpg")
    // $("#channel-img").html("<img src=" + channel.contents[0].image.display.url + ">");
    getSpore();
  });
}



function getSpore(){
  if (channel.contents.length == contInd) {
    return endOfHypha();
  }
  else {
    let block = channel.contents[contInd];
    let blockId = block.id;
    if (channel.contents[contInd].class == "Image") {
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

function getChannelNav(){
  fetch("https://api.are.na/v2/channels/298677")
  .then(response => response.json())
  .then((data) => {
    data.contents.forEach(function(chan) {
      $(".overlay-content").append("<div class='overlay-box' data-id=" + chan.id.toString() + ">" + chan.title + "</div>");
    });
  });
}

$( document ).ready(function() {
  $("#box-left").hide();
  $("#box-right").hide();
  getChannel("introduction");
  getChannelNav();

});

$('.page-right').on('click', '.hypha', function(e) {
  getChannel($(e.target).attr("data-id"));
  contInd = 0;
});

$('.overlay-content').on('click', '.overlay-box', function(e) {
  getChannel($(e.target).attr("data-id"));
  contInd = 0;
  closeNav();
});


$( "#forward" ).click(function() {
  getSpore();
});

function openNav() {
  document.getElementById("myNav").style.height = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.height = "0%";
}

function imgError() {
  $("#channel-img").attr("src", "resources/images/default.jpg")
}

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
          if (left != 0) {
           getChannel(left.id);
          }
        break;

        case 38: // up
          getSpore();
        break;

        case 39: // right
          if (right != 0) {
           getChannel(right.id);
          }
        break;

        case 40: // down
          openNav();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});





