// start select elements
const postsContainter = document.getElementsByClassName("posts")[0];
const LoginBtn = document.getElementsByClassName("Login")[0];
const RegisterBtn = document.getElementsByClassName("Register")[0];
const modal = document.getElementsByClassName("modal-content")[0];
const reg_Modal = document.getElementsByClassName("modal-content")[1];
const createPost_Modal = document.getElementsByClassName("createPost_Modal")[0];
const deletePost_Modal = document.getElementsByClassName("deletePost_Modal")[0];
const modalFade = document.getElementsByClassName("fade")[0];
const modalFadereg_Modal = document.getElementsByClassName("reg_Modal")[0];
const buttons = document.getElementsByClassName("buttons")[0];
const LogOutBtn = document.getElementsByClassName("Log-out")[0];
const AddBtn = document.getElementsByClassName("Add")[0];
const nameOfUser = document.getElementById("nameOfUser");
const userInfo = document.getElementsByClassName("user-infos")[0];
const AllPosts = document.getElementsByClassName("posts")[0];
let postWillDelete = "";
// ent select elements

const baseURL = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;

// start logic

// start apply pagination settings
window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  // console.log(currentPage, lastPage);
  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getPosts(currentPage);
  }
});

// end apply pagination settings

getPosts();

// start get Posts function
function getPosts(page = 1) {
  toggleLoader(true);
  axios
    .get(`${baseURL}/posts?limit=3&page=${page}`)
    .then(function (response) {
      toggleLoader(false);
      let posts = response.data.data;
      lastPage = response.data.meta.last_page;

      for (post of posts) {
        console.log(post);
        let postAuthorId = post.author.id;
        let user = JSON.parse(localStorage.getItem("user"));
        let isMyPost = user != null && postAuthorId == user.id;

        // console.log(postAuthorId);
        // console.log(user);
        // console.log(user.id);
        // console.log(isMyPost);

        let editDeleteBtnContent = "";
        if (isMyPost) {
          editDeleteBtnContent = `
          <button class="btn btn-secondary" onclick="editBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Edit</button>

          <button class="btn btn-danger" onclick="deleteBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Delete</button>
          `;
        }

        let title = "";
        title = post.title !== null ? post.title : " ";
        postsContainter.innerHTML += `
        <div class="card post mt-3" id=${post.id} >
            <div class="card-header d-flex justify-content-between align-items-center">
              <div class="user-infos" onclick="nameImgClicked(${
                post.author.id
              })">
                <img
                  class="rounded-circle border border-2"
                  src=${post.author.profile_image}
                  alt="no-pic"
                  style="width: 40px; height: 40px"
                />
                <b>${post.author.username}
                </b>
              </div>
              <div>
                   ${editDeleteBtnContent}
              </div>
            </div>
            <div class="card-body" onclick="postClicked(${post.id})">
              <img class="mw-100" src="${post.image}" alt="no-pic" />

              <h6 style="color: rgb(193, 193, 193)" class="mt-1">${
                post.created_at
              }</h6>

              <h5>${title}</h5>
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
            </div>
          </div>
        `;
      }
      console.log(posts);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      const message = error.response.data.message;
      showAlert(message, "alert-danger");
    });
}
// getPosts();
// end get Posts function

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
    console.log(
      theUsername.value,
      thePassword.value,
      theName.value,
      theEmail.value,
      theImage.files[0]
    );

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

//start -post_Modal- modal[2]
createPost_Modal.addEventListener("click", async function (event) {
  let title = document.getElementsByClassName("postTitle")[0];
  let body = document.getElementsByClassName("postBody")[0];
  let image = document.getElementsByClassName("postImage")[0];

  if (event.target.classList.contains("create")) {
    // console.log("Create");
    // console.log(title.value);
    // console.log(body.value);
    // console.log(image.files[0]);

    await createNewPost(title.value, body.value, image.files[0]);
  }
});
//end -post_Modal- modal[2]

//start -post_Modal- modal[2]
deletePost_Modal.addEventListener("click", async function (event) {
  if (event.target.classList.contains("delete")) {
    let postWillDeleteId = document.getElementById("delete-id-input").value;
    // console.log(postWillDeleteId);
    // console.log("delete");
    await deletePost(postWillDeleteId);
  }
});
//end -post_Modal- modal[2]

// start register function
function register(theUsername, thePassword, theName, theEmail, theImage) {
  console.log(theUsername, thePassword, theName, theEmail, theImage);

  let postFormData = new FormData();
  postFormData.append("username", theUsername);
  postFormData.append("password", thePassword);
  postFormData.append("image", theImage);
  postFormData.append("name", theName);
  postFormData.append("email", theEmail);

  toggleLoader(true);
  axios
    .post(`${baseURL}/register`, postFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(function (response) {
      // console.log("from register", response);
      // console.log("from register", response.data);
      // console.log("from register user: ", response.data.user);
      // console.log("from register token:", response.data.token);
      saveDataInLocalstorage(response);
      hideModal(modalFadereg_Modal);
      showLoginOrLogout();
      showHideAddButton();
      showAlert("Registered successfully", "alert-success");
      updateUI();
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
// end register function

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

// start create new post function
function createNewPost(theTitle, theBody, theImage) {
  // console.log(theTitle, theBody, theImage);
  let URL = "";

  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  // console.log(theTitle, theBody, theImage);
  // console.log(postId);
  // console.log(isCreate);

  let postFormData = new FormData();
  postFormData.append("title", theTitle);
  postFormData.append("body", theBody);
  postFormData.append("image", theImage);
  let token = localStorage.getItem("token");

  // let isEdit = false;
  // let value = document.getElementById("post-id-input").value;
  // if (value != null && value.length != "" && value.length > 0) {
  //   isEdit = true;
  // }

  if (isCreate === true) {
    URL = `${baseURL}/posts`;
  } else {
    postFormData.append("_method", "put");
    URL = `${baseURL}/posts/${postId}`;
  }

  toggleLoader(true);
  return axios
    .post(URL, postFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      // console.log(response);
      // console.log(response.data.token);
      // console.log(response.data.user);
      // modalFade.classList.remove("show");

      // saveDataInLocalstorage(response);
      hideModal(createPost_Modal);
      // showLoginOrLogout();
      // showHideAddButton();
      if (isCreate === true) {
        showAlert("New Post Has Been Created successfully", "alert-success");
      } else {
        postFormData.append("_method", "put");
        showAlert("Post Has Been Edited successfully", "alert-success");
      }
      // showAlert("New Post Has Been Created successfully", "alert-success");
      getPosts();
      location.reload(); // Refresh the page
    })
    .catch(function (error) {
      console.log(error);
      const message = error.response.data.message;
      showAlert(message, "alert-danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
// start create new post function

// start delete a post function
function deletePost(postWillDeleteId) {
  // console.log(postWillDeleteId);
  // console.log(`${postWillDeleteId}`);
  // console.log(`${baseURL}/posts/${postWillDeleteId}`);
  let token = localStorage.getItem("token");
  // alert(postWillDeleteId); /////again////
  ///////////////////////////
  toggleLoader(true);
  return axios
    .delete(`${baseURL}/posts/${postWillDeleteId}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      console.log(response);
      // console.log(response.data.token);
      // console.log(response.data.user);
      // modalFade.classList.remove("show");

      // saveDataInLocalstorage(response);
      hideModal(deletePost_Modal);
      // showLoginOrLogout();
      // showHideAddButton();
      getPosts();
      location.reload(); // Refresh the page
      showAlert("New Post Has Been Deleted successfully", "alert-success");
    })
    .catch(function (error) {
      // console.log(error);
      const message = error.response.data.message;
      showAlert(message, "alert-danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
  ///////////////////////////
  // alert("postWillDeleteId"); /////again////
  // hideModal(deletePost_Modal);
}
// end delete a post function

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
  // if (e.target.classList.contains("create")) {
  //   console.log("Create");
  //   create();
  // }

  // else if (e.target.classList.contains("Register")) {
  //   console.log(`Clicked on ${e.target.textContent}`);
  // }
});

//end logout function

// start global/public functions

function showHideAddButton() {
  if (localStorage.getItem("token") != null) {
    AddBtn.classList.remove("hide");
  } else {
    AddBtn.classList.add("hide");
  }
}

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

function showLoginOrLogout() {
  if (localStorage.getItem("token") != null) {
    buttons.innerHTML = ` <button type="button" class="btn btn-outline-danger Log-out"> Log out </button>`;
  } else {
    buttons.innerHTML = ` 
    <button type="button" class="btn btn-outline-success Login" data-bs-toggle="modal" data-bs-target="#exampleModal">Login</button>
    <button type="button" class="btn btn-outline-success Register">Register</button>`;
    showAlert("logged-out successfully", "alert-success");
  }
}

function updateUI() {
  if (localStorage.getItem("user") != null) {
    // nameOfUser.innerHTML = JSON.parse(localStorage.getItem("user")).username;
    // picOfUser.src = JSON.parse(user.profile_image);

    const user = JSON.parse(localStorage.getItem("user")); // Parse the user object
    // console.log(user.username, user.profile_image);
    // nameOfUser.innerHTML = user.username; // Access username directly from user
    userInfo.innerHTML += `
    <div class="m-2" id="nameOfUser" onclick="nameImgClicked(${user.id})">${user.username}</div>
    <img id="user-profile-pic" src="${user.profile_image} " alt=" "  onclick="nameImgClicked(${user.id})"/>
    `;
    // picOfUser.src = user.profile_image; // Access profile_image directly from user
  } else {
    // nameOfUser.innerHTML = " ";
    userInfo.innerHTML = " ";
    // picOfUser.src = " ";
  }
}
// end global/public functions

// start Maintaining User Login after page load
window.onload = function () {
  // const user = JSON.parse(localStorage.getItem("user"));
  // if (user) {
  //   nameOfUser.innerHTML = user.username;
  //   userInfo.innerHTML += `<img id="user-profile-pic" src="${user.profile_image} " alt=" " />`;
  // }
  if (localStorage.getItem("user") != null) {
    showLoginOrLogout();
    showHideAddButton();
    updateUI();
  }
};
// end Maintaining User Login after page load

function postClicked(postId) {
  // console.log(postId);
  window.location = `postDetails.html?postId=${postId}`;
}

function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }

  return user;
}

function editBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  // console.log(post);
  // console.log(post.id);
  // console.log("editBtnClicked");
  document.getElementById("createPostModalLabel").innerHTML = "Update Post";
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-title").value = post.title;
  document.getElementById("post-body").value = post.body;
  document.getElementById("modalBtn").innerHTML = "Edit ";
  var myModal = new bootstrap.Modal(
    document.getElementById("createPostModal"),
    {}
  );
  myModal.toggle();
  // console.log(document.getElementById("post-id-input").value);
}

function addBtnClicked() {
  // console.log("addBtnClicked");
  document.getElementById("createPostModalLabel").innerHTML = "Create New Post";
  document.getElementById("post-id-input").value = "";
  document.getElementById("post-title").value = "";
  document.getElementById("post-body").value = "";
  document.getElementById("modalBtn").innerHTML = "Create";
  var myModal = new bootstrap.Modal(
    document.getElementById("createPostModal"),
    {}
  );
  myModal.toggle();
  // console.log(document.getElementById("post-id-input").value);
}

function deleteBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  // console.log(post);
  // console.log(post.id);
  // console.log("deleteBtnClicked");
  document.getElementById("delete-id-input").value = post.id;
  var myModal = new bootstrap.Modal(
    document.getElementById("deletePostModal"),
    {}
  );
  myModal.toggle();
  // console.log(document.getElementById("delete-id-input").value);
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
  console.log(user);
  console.log(userId);
  window.location = `profil.html?userid=${userId}`;
}

// end logic
