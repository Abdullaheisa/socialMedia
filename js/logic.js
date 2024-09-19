const baseUrl="https://tarmeezacademy.com/api/v1";



// Edit And Delete Post
function editPostBtnClicked(postObject){
    const post=JSON.parse(decodeURIComponent(postObject));
    document.getElementById("post_modal_title").innerHTML="Edit Post";
    document.getElementById("postModalSubmit").innerHTML="Update";
    document.getElementById("post-body-input").value=post.body;
    document.getElementById("post_id_input").value=post.id;
    const $targetEl = document.getElementById('create-post');
    const modal = new Modal($targetEl);
    modal.toggle();

}

function deletePostBtnClicked(postObject){
    const post=JSON.parse(decodeURIComponent(postObject));
    document.getElementById("delete-post-id-btn").value=post.id;
    const $targetEl = document.getElementById('popup-delete');
    const modal = new Modal($targetEl);
    modal.toggle();

}

function confirmPostDelete() {
    const postId=document.getElementById("delete-post-id-btn").value;
    const token=localStorage.getItem("token");
    const headers={
        "Content-Type":"multipart/form-data",
    "authorization" : `Bearer ${token}`
    }
    const url= `${baseUrl}/posts/${postId}`
    toggleLoader(true)

    axios.delete(url,{
        headers: headers
    })
    .then((response)=>{
        toggleLoader(false)

        const $targetEl = document.getElementById('popup-delete');
        const modal = new Modal($targetEl);
        alert1("deleted Post successfully")
        modal.hide();
        if(location.href.includes("index.html")){
            getPosts()
        }else if(location.href.includes("profile.html")){
            getPostsUsers()
        }
        else{
            window.location="index.html"
        }

    }).catch((error)=>{
        alert2(error.response.data.message)
        toggleLoader(false)

    })
}

// ##Edit And Delete Post##

// Close Modals
function closeModal(id){
    const $targetEl = document.getElementById(id);
    const modal = new Modal($targetEl);
    modal.hide();
}

// open Modals 
function openModalLog(id) {
    const $targetEl = document.getElementById(id);
    const modal = new Modal($targetEl);
    modal.show();
}

// open And Close Dropdown
function openDropDown(id) {
    document.getElementById(id).classList.toggle("hidden")
    if(id.includes("commentOpen")){
        document.getElementById(id).classList.add("absolute","top-[-160px]","right-[90px]")
    }else{
    document.getElementById(id).classList.add("absolute","top-14","right-0")
    }
}

// Alerts
function alert1(cont) {
    document.getElementById("alert-suc").style.left="8px";
    document.getElementById("content_alert").innerHTML=cont;
    setTimeout(() => {
    document.getElementById("alert-suc").style.left="-100%";
        
    }, 5000);

}

function alert2(cont) {
    document.getElementById("alert-err").style.left="8px";
    document.getElementById("content-err").innerHTML=cont;
    setTimeout(() => {
    document.getElementById("alert-err").style.left="-100%";
        
    }, 5000);

}

// ##Alerts##

// Get Current User
function getCurrentUser() {
    let user="";
    const storageUser=localStorage.getItem("user")
    if(storageUser != null){
        user= JSON.parse(storageUser);
    }
    return user
}

// Log In
function loginBtnClicked(){
    const usernameLog= document.getElementById("username-input").value,
            passwordLOg=document.getElementById("password-input").value;
    const params={
        "username" : usernameLog,
        "password" : passwordLOg
    }
    toggleLoader(true)

    const url= `${baseUrl}/login`
    axios.post(url,params)
    .then((response)=>{
    toggleLoader(false)




        localStorage.setItem("token",response.data.token);
        localStorage.setItem("user",JSON.stringify(response.data.user))
        showDataUserDrop()

                    const $targetEl = document.getElementById('login-user');
        const modal = new Modal($targetEl);
        // hide the modal
        modal.hide();
        
        setupUi()
        alert1("You have been logged in successfully")

    }).catch((error)=>{
        alert2(error.response.data.message)
    toggleLoader(false)

    })

}



// Register
function registerBtnClicked(){
    toggleLoader(true)

    const usernameReg= document.getElementById("reg-username-input").value,
            passwordReg=document.getElementById("reg-password-input").value,
            nameReg=document.getElementById("reg-name-input").value,
            emailReg=document.getElementById("reg-email-input").value,
            imageReg=document.getElementById("reg-image-input").files[0];
    let formData= new FormData();
    formData.append("username",usernameReg)
    formData.append("password",passwordReg)
    formData.append("name",nameReg)
    formData.append("email",emailReg)
    formData.append("image",imageReg)
    const headers={
        "Content-Type":"multipart/form-data",
    }
    const url= `${baseUrl}/register`
    axios.post(url,formData,{
        headers: headers
    })
    .then((response)=>{
        toggleLoader(false)

        localStorage.setItem("token",response.data.token);
        localStorage.setItem("user",JSON.stringify(response.data.user))
        showDataUserDrop()
        const $targetEl = document.getElementById('register-user');
        const modal = new Modal($targetEl);
        // hide the modal
        modal.hide();
        setupUi()
        alert1("You have been sign in successfully")


    }).catch((error)=>{
        alert2(error.response.data.message)
    toggleLoader(false)

    })

}



// SetUp
function setupUi() {
    const token=localStorage.getItem("token");
    const loginBtn=document.getElementById("login-btn"),
    registerBtn=document.getElementById("register-btn"),
    inputComment=document.getElementById("input_comment"),
    createPostBtn=document.getElementById("createPostBtn"),
    imageLogIn=document.getElementById("imageLogIn");
    if(token == null){
        loginBtn.style.display="block";
        registerBtn.style.display="block";
        imageLogIn.style.display="none"
        if(createPostBtn != null){
        createPostBtn.style.display="none"
        }
        if(inputComment != null){
        inputComment.style.display="none"
        }
    }else{
        loginBtn.style.display="none";
        registerBtn.style.display="none";
        imageLogIn.style.display="block"
        if(createPostBtn != null){
        createPostBtn.style.display="block"
        }
        if(inputComment != null){
        inputComment.style.display="block"
        }
    }
}

// Log Out
function logOutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setupUi() 
    const $targetEl = document.getElementById('user-dropdown');
    const modal = new Modal($targetEl);
    // hide the modal
    modal.hide();
    alert1("You have been log out successfully")

}

// Show Data For User
function showDataUserDrop() {
if(localStorage.getItem('user') !== null){
    let text = localStorage.getItem("user");
    let obj = JSON.parse(text);
    const nameSh=obj.name,
    emailSh=obj.email
    profile_image=obj.profile_image;

    document.getElementById("name-show").innerHTML=`${nameSh}`;
    document.getElementById("email-show").innerHTML=`${emailSh}`;   
    document.getElementById("imageLogIn").src=`${profile_image}`;   

}
}



// Create And Edit Post
function createNewPostClicked(){

let postId= document.getElementById("post_id_input").value;
let isCreate= postId == null || postId=="";



const body= document.getElementById("post-body-input").value,
image=document.getElementById("post-image-input").files[0];

const token=localStorage.getItem("token");


let formData = new FormData()
formData.append("body",body)
formData.append("image",image)
    const headers={
        "Content-Type":"multipart/form-data",
    "authorization" : `Bearer ${token}`
    }
    let url= "";
    toggleLoader(true)

    let message="";
    if(isCreate){
        url=`${baseUrl}/posts`
        messageAlert="created a new post successfully"
    }else{
        formData.append("_method","put")
        url=`${baseUrl}/posts/${postId}`
        messageAlert="Edit post successfully"
    }
    axios.post(url,formData,{
        headers: headers
    })
    .then((response)=>{
    toggleLoader(false)
        
        alert1(messageAlert)
        const $targetEl = document.getElementById('create-post');
        const modal = new Modal($targetEl);
        modal.hide();

        if(location.href.includes("index.html")){
            getPosts()
        }else if(location.href.includes("profile.html")){
            getPostsUsers()
        }else{
            getPost()
        }




    }).catch((error)=>{
        alert2(error.response.data.message)
        toggleLoader(false)

    })

}

function postClicked(postId) {
    window.location=`pagePost.html?postId=${postId}`;

}
function userClicked(userId) {
    window.location=`profile.html?userId=${userId}`;

}


function addBtnClicked(){
    document.getElementById("post_modal_title").innerHTML="Create a new Post";
    document.getElementById("postModalSubmit").innerHTML="Publish Post";
    document.getElementById("post-body-input").value="";
    document.getElementById("post_id_input").value="";
    const $targetEl = document.getElementById('create-post');
    const modal = new Modal($targetEl);
    modal.toggle();

}
function profileClicked() {
    let user = getCurrentUser();
    let userId= user.id;
    window.location=`profile.html?userId=${userId}`;

}
function toggleLoader(show=true) {
    if(show){
        document.getElementById("loaderd").style.visibility='visible';
    }else{
        document.getElementById("loaderd").style.visibility='hidden';

    }
}