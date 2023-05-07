document.addEventListener('DOMContentLoaded', function() {
window.onload = function() {
    fecthNavbar();
    fetchPosts();
    fetchChatsHeads();
    fetchNewsFromApi2();
  };

  // function to fetch posts (later will be used to fetch from db)
function fetchPosts(){
  const postHTML = createPostHTML("../resources/icons/profile1.png", "Dilip Badal", "../resources/icons/profile1.png");
  const postHTML2 = createPostHTML("../resources/icons/profile2.png", "Kavya HS", "../resources/icons/profile2.png");
  document.querySelector(".post-container").innerHTML = postHTML + postHTML2;
}

// function to recent chats (later will be used ot fetch from db)
function fetchChatsHeads(){
  const chat1 = createChatHeads("../resources/icons/profile2.png", "Kavya", "Whats up Badal?");
    const chat2 = createChatHeads("../resources/icons/profile1.png", "Madhu", "Yeno maadtidiya?");
    document.querySelector(".show-chat-heads").innerHTML = chat1 + chat2;
}

// function to fetch navbar
function fecthNavbar(){
  const navBar = createNavBar();
  document.querySelector(".showNavbar").innerHTML = navBar;
}

//function to display navbar
function createNavBar(){
  return `<nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
  <div class="container-fluid">
    <!--Logo-->
    <a class="navbar-brand" href="#"><img src="../resources/icons/logo2.png" alt="" class="img-fluid" style="max-width: 35px;"></a>
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="#" style="font-size: 24px;">Square</a>
      </li>
    </ul>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <!--Navbar icons starts here-->
      <ul class="navbar-nav ms-auto mb-2 mx-20 mb-lg-0">  
        <li class="nav-item me-3 ms-5">
            <a class="nav-link" href="#">
                <img src="../resources/icons/friends.png" alt="" class="img-fluid" style="max-width: 30px;">
            </a>
          </li>
          <li class="nav-item dropdown me-3 ms-5">
            <a class="nav-link " href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="../resources/icons/bell1.png" alt="" class="img-fluid" style="max-width: 25px;">
            </a>
             <!--Navbar dropdown-1 starts here-->  
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
            <!--Navbar dropdown-1 ends here-->
          </li>
          <!--Navbar dropdown-2 starts here-->
          <li class="nav-item dropdown me-3 ms-5">
            <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="../resources/icons/settings.png" alt="" class="img-fluid" style="max-width: 25px;">
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#">Contact us</a></li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li><a class="dropdown-item" href="#">Themes</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#">Log out</a></li>
            </ul>
          </li>
          <!--Navbar dropdown-2 starts here-->
      </ul>
       <!--Navbar icons ends here-->  
    </div>
  </div>
 
</nav>`;
}

// function element to display user feed content
// this function takes dp image source, a username and a actual post 
function createPostHTML(userImgSrc, userName, postImgSrc) {
  return `
    <div class="row show-post justify-content-around align-items-center my-3 border">
      <div class="row info border">
        <div class="col-auto">
          <img src="${userImgSrc}" alt="" class="img-fluid dp m-2 ms-0 rounded-circle" width="50">
        </div>
        <div class="col d-flex align-items-center flex-start mt-2 me-auto justify-content-between">
          <h4 id="user-name" class="user-name" style="font-size: 25px;">${userName}</h4>
          <div class="dropdown">
            <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" type="button" id="dropdownMenuButton"  aria-expanded="false"></button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" href="#">Delete Post</a>
              <a class="dropdown-item" href="#">Hide Post</a>
            </div>
          </div>
        </div>
      </div>

      <div class="row-auto image bg-primary">
        <img src="${postImgSrc}" alt="" class="img-fluid" width="400">
      </div>

      <div class="row reactions">
        <div class="col">
          <button class="btn btn-link like-btn"><img class="img-fluid dp m-2" src="../resources/icons/heartbefore1.png" alt="like" width="30"></button>
        </div>
        <div class="col">
          <button class="btn btn-link cmnt-btn"><img class="img-fluid dp m-2" src="../resources/icons/commentsbefore1.png" alt="comment" width="30"></button>
        </div>
        <div class="col">
          <button class="btn btn-link share-btn"><img class="img-fluid dp m-2" src="../resources/icons/sharebefore1.png" alt="share" width="30"></button>
        </div>
      </div>
    </div>
  `;
}

// function to display chat heads on the left column
// this column takes user dp, username and the last message in a conversation
function createChatHeads(userImg, username, lastMsg){
  return `
  <div class="row">
  <div class="d-flex align-items-start border" id="chats-section" onclick='openConversation("${username}", "${userImg}")'>
  <div class="col-auto">
        <img src="${userImg}" alt="" class="img-fluid dp m-2 ms-0 rounded-circle" width="50">
      </div>
      <div class="col d-flex flex-column mt-2">
        <div class="d-flex flex-grow-1">
          <h4 id="user-name" class="user-name" style="font-size: 15px;">${username}</h4>
        </div>
        <div class="d-flex flex-grow-2">
          <h4 id="user-name-last-message" class="user-name-last-message" style="font-size: 15px; color: gray;">${lastMsg}</h4>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// function to show suggestions to the user
function showSuggestions(username, imageURL){
  return `<div class="row my-3">
  <div class="col-sm-12 col-md-6 col-lg-4">
    <div class="media d-flex justify-content-between align-items-center w-100">
      <img src="${imageURL}" class="mx-3 rounded-circle" alt="Profile Picture" width="35">
      <div class="media-body d-flex justify-content-between align-items-center">
        <h5 class="mt-0 mb-0 mx-2">${username}</h5>
        <button class="btn btn-primary mx-2" onclick="changeRequestStatus(this)">Follow</button>
      </div>
    </div>
  </div>
</div>`;
}

// function to show changes in requests status button and in db
function changeRequestStatus(btn) {
  btn.innerHTML = "Sent";
  btn.classList.remove("btn-primary");
  btn.classList.add("btn-secondary");
  btn.disabled = true;
}

function fetchSuggestions() {
  const suggestions = [
    { username: "Dilip", imageURL: "../resources/icons/profile1.png" },
    { username: "John", imageURL: "../resources/icons/profile2.png" },
    { username: "Jane", imageURL: "../resources/icons/profile1.png" }
  ];

  const showSuggestionsElement = document.querySelector('.show-Suggestions');
  showSuggestionsElement.innerHTML = "";

  suggestions.forEach(suggestion => {
    const html = showSuggestions(suggestion.username, suggestion.imageURL);
    showSuggestionsElement.innerHTML += html;
  });
}

//JavaScript code to handle button click events
$(document).ready(function() {
  // Set the active button by default and fetch trending news on page load
  $("#trending-btn").addClass("active");

  // Handle button click events
  $("#trending-btn").unbind("click").bind("click", function(e) {
    e.stopPropagation();
    $("#suggestion-btn").removeClass("active");
    $(this).addClass("active");
    $(".show-Suggestions").hide();
    $(".show-News").show(); // Show the news div
  });

  $("#suggestion-btn").unbind("click").bind("click", function(e) {
    e.stopPropagation();
    $("#trending-btn").removeClass("active");
    $(this).addClass("active");
    $(".show-News").hide(); // Hide the news div
    $(".show-Suggestions").show();
    fetchSuggestions();
    console.log("clicked suggestions button and set is active state");
  });
});

// Code to fecth and display news from NewsApi starts here
var newsData2 = []; // Define a variable to store the news data
function fetchNewsFromApi2() {
  // Make API call and process response
// Get news from News API (v2)
fetch('https://newsapi.org/v2/everything?q=world&from=2023-05-06&to=2023-05-06&sortBy=popularity?country=us&apiKey=b328446d22d34807b53cbc8adac3347a')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Log the data to the console for testing purposes
    newsData2 = data; // Store the news data in the variable
    showNews(newsData2);
    // Do something with the news data here
  })
  .catch(error => console.error(error));
}

function createNewsElement(title, imageURL, content, readURL) {
  return `<div class="card my-3">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <img class="card-img-top mb-3" src="${imageURL}" alt="could not load image">
              <p class="card-text">${content}</p>
              <a href="${readURL}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Read More</a>
            </div>
          </div>`;
}


// function to store and send newsData to div element
function showNews(newsData){
  var newsElements = []
  for(var i = 0; i < 5; i++){
    var randomIndex = Math.floor(Math.random() * 100);
    var title = newsData.articles[randomIndex].title;
    var imageURL = newsData.articles[randomIndex].urlToImage;
    var content = newsData.articles[randomIndex].content;
    var readURL = newsData.articles[randomIndex].url;
    newsElements.push(createNewsElement(title, imageURL, content, readURL));
  }
  const showNewsElement = document.querySelector('.show-News');

  showNewsElement.innerHTML = newsElements.join("");
}
// Code to fecth and display news from NewsApi ends here
});

function inMsgTemplate(msg){
  return `
  <div class="chat-bubble chat-element left">
    <h6>${msg}</h6>
  </div>`;
}

function outMsgTemplate(msg){
  return `
  <div class="chat-bubble chat-element right">
    <h6>${msg}</h6>
  </div>
  `;
}

function hideChats() {
  $(".chatsSectionHere").addClass("hide"); // add hide class for sliding out effect
  setTimeout(function() {
    $(".chatsSectionHere").removeClass("show hide");
    $(".right-block").show();
    console.log("Activated");
  }, 300); // wait for 0.3s (the same duration as the transition) before removing the element from the DOM
}


function showChatsSection(imgURL, username){
  return `<div class="card chats-card">
    <div class="card-header bg-primary d-flex align-items-start justify-content-between">
      <div class="d-flex align-items-center">
        <div class="col-auto">
          <img src="${imgURL}" alt="" class="img-fluid dp m-2 ms-0 rounded-circle" width="50">
        </div>
        <div class="col d-flex flex-column mt-3">
          <div class="d-flex flex-grow-1">
            <a href="#" class="btn"> <h4 id="chats-heading" class="chats-heading" style="font-size: 25px;">${username}</h4></a>
          </div>
        </div>
      </div>
      <div>
        <button type="button" class="btn-close" aria-label="Close" onclick="hideChats()"></button>
      </div>
    </div>

    <div class="card-body convo-body">
      <div class="chatsSize mt-auto">
        <div class="chatsHere"></div>
      </div>
    </div>

    <div class="card-footer">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="Type a message...">
        <button class="btn btn-primary">Send</button>
      </div>
    </div>
  </div>`;
}



function addIncomingMessage(msg) {
  var chatsHere = document.querySelector('.chatsHere');
  var msgHtml = inMsgTemplate(msg);
  chatsHere.innerHTML += msgHtml;
}

function addOutgoingMessage(msg) {
  var chatsHere = document.querySelector('.chatsHere');
  var msgHtml = outMsgTemplate(msg);
  chatsHere.innerHTML += msgHtml;
}


var incomingMessagesList = {
  Kavya: ["Hello there!", "How are you?"],
  Madhu: ["Oye", "Yello idhiya?"]
};

var outgoingMessagesList = {
  Kavya: ["I am good re", "Nuvu choppu"],
  Madhu: ["ille idhini", "Neenu yalli?"]
};

function openConversation(username, imgURL){
  $(".right-block").hide();
  $(".chatsSectionHere").html(showChatsSection(imgURL, username));
  $(".chatsSectionHere").addClass("show").removeClass("hide");
  
  var incomingMessages = incomingMessagesList[username];

  for (var i=0; i<incomingMessages.length; i++){
    addIncomingMessage(incomingMessages[i]);
  }

  var outgoingMessages = outgoingMessagesList[username];

  for (var i=0; i<outgoingMessages.length; i++){
    addOutgoingMessage(outgoingMessages[i]);
  }
}