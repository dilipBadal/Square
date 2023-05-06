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
          <h4 id="user-name" class="user-name" style="font-size: 15px;">${userName}</h4>
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
  return `<div class="row">
    <div class="d-flex align-items-start border" id="chats-section" onclick="openConversation()">
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
