

setupUi()
showDataUserDrop()
let currentPage=1;
let last_page=1;

window.addEventListener("scroll", function () {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    if (endOfPage && currentPage < last_page) {
        currentPage += 1;
      getPosts(false,currentPage)
    }
});


getPosts()


function getPosts(reload= true , page= 1) {
    toggleLoader(true)
    axios.get(`${baseUrl}/posts?limit=5&page=${page}`)
    .then((response)=>{
        toggleLoader(false)

        const posts = response.data.data;
        last_page= response.data.meta.last_page;
        if(reload){
            document.getElementById("containerPosts").innerHTML="";
        }
        
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
                        <p onclick="postClicked(${post.id})" class="mb-4 font-normal text-sm text-gray-700 dark:text-white overflow-hidden">${post.body}</p>
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

            document.getElementById("containerPosts").innerHTML+= content;
        });





    }).catch((error)=>{

        if(error.message == "Network Error"){
        toggleLoader(true)
            
        }
        

    })
    
}






// ###################################################################################################################

function postClicked(postId) {
    window.location=`pagePost.html?postId=${postId}`;

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
