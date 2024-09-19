const urlParams = new URLSearchParams(window.location.search);
const id=urlParams.get("userId");


getUser()
setupUi()
showDataUserDrop()
getPostsUsers()
function getUser() {
    toggleLoader(true)
    const url= `${baseUrl}/users/${id}`
    axios.get(url)
    .then((response)=>{

        let user=response.data.data
        document.getElementById("main-info-username").innerHTML=user.username;
        document.getElementById("main-info-email").innerHTML=user.email;
        document.getElementById("main-info-name").innerHTML=user.name;
        document.getElementById("main-info-posts").innerHTML=user.posts_count;
        document.getElementById("main-info-comments").innerHTML=user.comments_count;
        document.getElementById("namePosts").innerHTML=`${user.username}'s`;
        if(user.profile_image[0] !==undefined ){
        document.getElementById("main-info-image").src=user.profile_image;
            
        }
    }).catch((error)=>{
        alert2(error.response.data.message)

    })
    .finally(()=>{
        toggleLoader(false)
    })
}



function getPostsUsers() {
    toggleLoader(true)
    axios.get(`${baseUrl}/users/${id}/posts`)
    .then((response)=>{
        toggleLoader(false)

        document.getElementById("usresPosts").innerHTML = "";

        const posts = response.data.data;
        posts.forEach(post => {
            let author =post.author;
            let imageBody="";
            let profileImage="";
            let comments="";
            if(post.image[0] !==undefined ){
                imageBody=post.image;
            }
            if(author.profile_image[0] !==undefined ){
                profileImage=author.profile_image;
            }
            if(post.comments_count !== 0 ){
                comments=`( ${post.comments_count} )`;
            }
            // show or hide edit button
            let user= getCurrentUser();
            let isMyPost=user!=null && author.id == user.id;
            let editButtonContent=  ``;
            if(isMyPost){
                editButtonContent=`
                <span onclick="openDropDown('drop-${post.id}')" class="text-xl dark:text-white cursor-pointer">...</span>                
                `
            }

            let   content =`

            
                <div class="w-11/12 mx-auto mb-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div class="p-3 border-b relative flex justify-between border-dim-50">
                        <div class="flex items-center gap-3 ">
                            <img onclick="userClicked(${author.id})" class="w-7 h-7 cursor-pointer rounded-full" src="${profileImage}" alt="">
                            <div>
                                <span onclick="userClicked(${author.id})" class="text-sm dark:text-white font-normal cursor-pointer">${author.username}</span>
                                <span class="text-xs block dark:text-white">${post.created_at}</span>
                            </div>
                        </div>
                        ${editButtonContent}
                            <div id="drop-${post.id}" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
                                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                                    <li>
                                        <a onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" class="block px-4 py-2 cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                                    </li>
                                    <li>
                                        <a onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"  class="block px-4 py-2 cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                                    </li>
                                </ul>
                            </div>
                    </div>
                    <div class="p-3">
                        <p class="mb-4 font-normal text-sm text-gray-700 dark:text-white overflow-hidden">${post.body}</p>
                        <a onclick="postClicked(${post.id})" class="w-48 cursor-pointer" >
                            <img  class="rounded-t-lg w-full" src="${imageBody}" alt="" />
                        </a>
                        <div class="flex ">
                            <div class="w-1/3 text-center py-3 px-2 ">
                                <div class="cursor-pointer w-fit mx-auto text-base dark:text-white font-normal ">
                                    <i class="fa-regular fa-thumbs-up fa-flip-horizontal"></i>
                                    <span>Likes</span>
                                </div>
                            </div>
                            <div class="w-1/3 text-center py-3 px-2 ">
                                <div  class="cursor-pointer w-fit mx-auto text-base dark:text-white font-normal comments" onclick="postClicked(${post.id})" >
                                    <i class="fa-regular fa-comment fa-flip-horizontal"></i>
                                    <span > <span> ${comments}</span> Comment</span>
                                </div>
                            </div>
                            <div class="w-1/3 text-center py-3 px-2 ">
                                <div class="cursor-pointer w-fit mx-auto text-base dark:text-white font-normal ">
                                    <i class="fa-solid fa-share"></i>
                                    <span>Share</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById("usresPosts").innerHTML+= content;
        });





    }).catch((error)=>{

        if(error.message == "Network Error"){
        toggleLoader(true)
            
        }

    })
    
    
}