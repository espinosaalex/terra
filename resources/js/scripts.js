// choose your hypha
// proceed to next spore
// switch to new hypha

let contInd = 0;
let blockId = 0;
let channel = '';

function refreshHyphae(){
  fetch("http://api.are.na/v2/blocks/" + blockId.toString() + "/channels")
  .then(response => response.json())
  .then((data) => {
    data.channels.forEach(function(hypha){
      $("#spore-content").append("<p data-id=" + hypha.id.toString() + " class ='hypha'>" + hypha.title + "</p>");
    });
  });
}


function getChannel(id){
  // fetch("http://api.are.na/v2/channels/" + id.toString() ) //"/contents"
  // .then(response => response.json())
  // .then((data) => {
  //   channel = data;
  //   console.log(data);
  //   $("#hypha-title").text(data.title);
  // });

  $.ajax({
    url: "http://api.are.na/v2/channels/" + id.toString(),
    dataType: 'json',
    async: false,
    success: function(json){
      channel = json
    }
});
}



function getSpore(){
  blockId = channel.contents[contInd].id;
  $("#spore-content").html(channel.contents[contInd].content_html);
  $("#spore-id").text("spore " + channel.contents[contInd].id.toString());
  contInd += 1;
  console.log(contInd);
}


$( document ).ready(function() {
  getChannel("terrarism-jo_a18tk90");

});

$('.container').on('click', '.hypha', function(e) {
  console.log(e.target);
  getChannel($(e.target).attr("data-id"));
  contInd = 0;
  getSpore();
  refreshHyphae();
});

$( "#forward" ).click(function() {
  getSpore();
  console.log(contInd);
  refreshHyphae();
});



