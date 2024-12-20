let profilePosts = document.getElementsByClassName("profile-posts")[0];

// start SELECT Query Params from URL of this page
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("userid");
// console.log(id);
// end SELECT Query Params from URL of this page

// start get user info function
function showUser() {
  //   let id = 18810;
  toggleLoader(true);
  axios
    .get(`${baseURL}/users/${id}`)
    .then(function (response) {
      // console.log(response);
      let user = response.data.data;
      let text = "";
      if (user.posts_count > 0) {
        text = `${user.username}'s posts`;
      } else {
        text = "NO POSTS TO SHOW";
      }

      document.getElementById("profile-img").src = user.profile_image;
      document.getElementById("email").innerHTML = user.email;
      document.getElementById("userName").innerHTML = user.username;
      document.getElementById("name").innerHTML = user.name;
      document.getElementById("comments-num").innerHTML = user.comments_count;
      document.getElementById("posts-num").innerHTML = user.posts_count;
      document.getElementsByClassName(
        "username-profile-posts"
      )[0].innerHTML = `${text}`;
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
showUser();
// end get user info function

// start get posts for a user function
function getUserPosts() {
  //   let id = 18810;
  toggleLoader(true);
  axios
    .get(`${baseURL}/users/${id}/posts`)
    .then(function (response) {
      let userPosts = response.data.data;
      //   console.log(userPosts);
      for (post of userPosts) {
        // console.log(post);
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
        profilePosts.innerHTML += `
            <div class="card post mt-3" id=${post.id} >
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <img
                        class="rounded-circle border border-2"
                        src=${post.author.profile_image}
                        alt="no-pic"
                        style="width: 40px; height: 40px"
                        />
                        <b onclick="userNameClicked('${encodeURIComponent(
                          JSON.stringify(post)
                        )}')">${post.author.username}</b>
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
                    <span>${
                      "(" + post.comments_count + ")" + " Comments"
                    }</span>
                </div>
                </div>
            </div>`;
      }
      // console.log(userPosts);
    })
    .catch(function (error) {
      // handle error
      //   console.log(error);
      const message = error.response.data.message;
      showAlert(message, "alert-danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
getUserPosts();
// end get posts for a user function

/////////////////////////////////////////////////////////////////////////////////////////////

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
