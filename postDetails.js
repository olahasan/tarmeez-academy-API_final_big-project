const modal = document.getElementsByClassName("modal-content")[0];
const reg_Modal = document.getElementsByClassName("modal-content")[1];
const modalFade = document.getElementsByClassName("fade")[0];
const buttons = document.getElementsByClassName("buttons")[0];
const LogOutBtn = document.getElementsByClassName("Log-out")[0];
// const AddBtn = document.getElementsByClassName("Add")[0];
const userInfo = document.getElementsByClassName("user-infos")[0];
const author = document.getElementsByClassName("author")[0];
const AllPosts = document.getElementsByClassName("posts")[0];

// start SELECT Query Params from URL of this page
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");
// console.log(id);
// end SELECT Query Params from URL of this page

// start modal[0]
let theName = "",
  thePassword = "";
modal.addEventListener("click", async (event) => {
  theName = document.getElementsByClassName("Username")[0];
  thePassword = document.getElementsByClassName("Password")[0];
  if (event.target.classList.contains("login")) {
    // console.log(`Clicked on ${event.target.textContent}`);
    // console.log(`Clicked on ${(theName, thePassword)}`);
    // console.log(theName.value, thePassword.value);

    await login(theName.value, thePassword.value);
  }
});
// end modal[0]

// start -reg_Modal- modal[1]
reg_Modal.addEventListener("click", async (event) => {
  console.log("lolo");
  let theUsername = document.getElementsByClassName("reg-Username")[0];
  let thePassword = document.getElementsByClassName("reg-Password")[0];
  let theName = document.getElementsByClassName("reg-name")[0];
  let theEmail = document.getElementsByClassName("reg-email")[0];
  let theImage = document.getElementsByClassName("reg-image")[0];
  if (event.target.classList.contains("register")) {
    // console.log("reg_Modal");
    // console.log(`Clicked on ${event.target.textContent}`);
    // console.log(`Clicked on ${(theUsername, thePassword)}`);
    // console.log(
    //   theUsername.value,
    //   thePassword.value,
    //   theName.value,
    //   theEmail.value,
    //   theImage.files[0]
    // );

    await register(
      theUsername.value,
      thePassword.value,
      theName.value,
      theEmail.value,
      theImage.files[0]
    );
  }
});
// end -reg_Modal- modal[1]

// start login function
function login(theName, thePassword) {
  toggleLoader(true);
  return axios
    .post(`${baseURL}/login`, {
      username: theName,
      password: thePassword,
    })
    .then(function (response) {
      // console.log(response);
      // console.log(response.data.token);
      // console.log(response.data.user);
      saveDataInLocalstorage(response);
      // modalFade.classList.remove("show");
      hideModal(modalFade);
      showLoginOrLogout();
      showHideAddButton();
      showAlert("logged successfully", "alert-success");
      updateUI();
      location.reload(); // Refresh the page
    })
    .catch(function (error) {
      // console.log(error);
      const message = error.response.data.message;
      showAlert(message, "alert-danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
// login();
// end login function

function showAlert(message, color) {
  // const mainAlert = document.getElementById("alertItem");

  const alertEle = document.getElementById("alertContainer");
  alertEle.innerHTML = `
       <div class="alert ${color} alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
      `;
}

// function showHideAddButton() {
//   if (localStorage.getItem("token") != null) {
//     AddBtn.classList.remove("hide");
//   } else {
//     AddBtn.classList.add("hide");
//   }
// }
// showHideAddButton();

function showLoginOrLogout() {
  if (localStorage.getItem("token") != null) {
    buttons.innerHTML = ` <button type="button" class="btn btn-outline-danger Log-out"> Log out </button>`;
  } else {
    buttons.innerHTML = ` 
      <button type="button" class="btn btn-outline-success Login" data-bs-toggle="modal" data-bs-target="#exampleModal">Login</button>
      <button type="button" class="btn btn-outline-success Register">Register</button>`;
    // showAlert("logged-out successfully", "alert-success");
  }
}

showLoginOrLogout();

function updateUI() {
  if (localStorage.getItem("user") != null) {
    // nameOfUser.innerHTML = JSON.parse(localStorage.getItem("user")).username;
    // picOfUser.src = JSON.parse(user.profile_image);

    const user = JSON.parse(localStorage.getItem("user")); // Parse the user object
    // console.log(user.username, user.profile_image);
    // nameOfUser.innerHTML = user.username; // Access username directly from user
    userInfo.innerHTML += `
      <div class="m-2" id="nameOfUser" onclick="nameImgClicked(${user.id})">${user.username}</div>
      <img id="user-profile-pic" src="${user.profile_image} " alt=" " onclick="nameImgClicked(${user.id})"/>
      `;
    // picOfUser.src = user.profile_image; // Access profile_image directly from user
  } else {
    // nameOfUser.innerHTML = " ";
    userInfo.innerHTML = " ";
    // picOfUser.src = " ";
  }
}

updateUI();

//start logout function
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("Log-out")) {
    deleteDataFromLocalstorage();
    showLoginOrLogout();
    showHideAddButton();
    updateUI();
    // console.log("Log-out");
    location.reload(); // Refresh the page
  }
});

//end logout function

function saveDataInLocalstorage(response) {
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
}

function deleteDataFromLocalstorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  //  .setItem("token", response.data.token);
  // localStorage.setItem("user", JSON.stringify(response.data.user));
}

function hideModal(modal_form) {
  const modalInstance = bootstrap.Modal.getInstance(modal_form);
  if (modalInstance) {
    modalInstance.hide();
  }
}

// start show specific post dependent on one Query Param
const baseURL = "https://tarmeezacademy.com/api/v1";
function showPost() {
  toggleLoader(true);
  axios
    .get(`${baseURL}/posts/${id}`)
    .then(function (response) {
      // console.log(response);
      fillPost(response.data.data);
      //   fillComments(response.data.data.comments);
    })
    .catch(function (error) {
      // console.log(error);
      const message = error.response.data.message;
      showAlert(message, "alert-danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
showPost();

// end show specific post dependent on one Query Param

function fillPost(post) {
  // console.log(post);
  let postId = post.author.id;
  // console.log(postId);
  let theUser = JSON.parse(localStorage.getItem("user"));
  // console.log(theUser);

  let loggedUser = localStorage.getItem("user") && true;
  let addCommentArea = "";
  loggedUser != null &&
    // postId == theUser.id &&
    (addCommentArea = `
      <div class = "AddComment mt-sm-3">
        <input type="text" id="inputComment" placeholder="add your comment..."/>
        <input type="submit" value="send" onclick = "sendBtnClicked()"/>
      </div>
  `);
  // console.log(loggedUser);
  const posts = document.getElementsByClassName("allPosts")[0];
  author.innerHTML = `${post.author.username}'s post`;
  posts.innerHTML = `
          <div class="card post mt-3" id=${post.id} ">
            <div class="card-header">
              <div class="user-infos" onclick="nameImgClicked(${
                post.author.id
              })">
                  <img
                    class="rounded-circle border border-2"
                    src=${post.author.profile_image}
                    alt="no-pic"
                    style="width: 40px; height: 40px"
                  />
                  <b>${post.author.username}</b>
                </div>
             
            </div>
            <div class="card-body">
              <img class="mw-100" src="${post.image}" alt="no-pic" />

              <h6 style="color: rgb(193, 193, 193)" class="mt-1">${
                post.created_at
              }</h6>

              <h5>${post.title}</h5>
              <p>${post.body}</p>

              <hr />
              <div class="footer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                  />
                </svg>
                <span>${"(" + post.comments_count + ")" + " Comments"}</span>
              </div>
              <hr />
              <div class="commentsContainer">
                  ${fillComments(post.comments)}
              </div>
              <div class="addComment">
                   ${addCommentArea}
              </div>
            </div>
          </div>
        `;
}

function fillComments(comments) {
  // console.log(comments);
  if (comments.length > 0) {
    let all = "";
    for (comment of comments) {
      all += `
          <div class="comment">
              <div class="info user-infos" onclick="nameImgClicked(${comment.author.id})">
                  <div class="image">
                      <img src="${comment.author.profile_image}" alt="pic" />
                  </div>
                  <div class="name">${comment.author.username}</div>
              </div>
              <div class="body">${comment.body}</div>
          </div>
          `;
    }
    return all;
  } else {
    return "THERE IS NO COMMENTS TO SHOW";
  }
}

function sendBtnClicked() {
  let token = localStorage.getItem("token");
  if (token != null) {
    let theInputComment = document.getElementById("inputComment").value;
    createComment(theInputComment);
    // console.log("sendBtnClicked");
    // console.log(theInputComment);
  } else {
    showAlert("unAothentication ", "alert-danger");
  }
}

function createComment(inputComment) {
  let token = localStorage.getItem("token");
  if (token != null) {
    toggleLoader(true);
    axios
      .post(
        `${baseURL}/posts/${id}/comments`,
        {
          body: inputComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(function (response) {
        // console.log(response);
        // console.log(response.data.data);
        showPost();
        showAlert("comment added successfully", "alert-success");
      })
      .catch(function (error) {
        // handle error
        // console.log(error);
        const message = error.response.data.message;
        showAlert(message, "alert-danger");
      })
      .finally(() => {
        toggleLoader(false);
      });
  }
}

function nameImgClicked(userId) {
  window.location = `profil.html?userid=${userId}`;
}

// start loader function
function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
// end loader function

function profileClicked() {
  let user = JSON.parse(localStorage.getItem("user"));
  let userId = user.id;
  // console.log(user);
  // console.log(userId);
  window.location = `profil.html?userid=${userId}`;
}
