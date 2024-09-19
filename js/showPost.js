const urlParams = new URLSearchParams(window.location.search);
const id=urlParams.get("postId");



getPost()
setupUi()
showDataUserDrop()
function getPost() {
    toggleLoader(true)
    axios.get(`${baseUrl}/posts/${id}`)
    .then((response)=>{

        const post = response.data.data;
        const allComments = post.comments;
        const author = post.author;
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
        let user= getCurrentUser();
        let isMyPost=user!=null && author.id == user.id;
        let editButtonContent=  ``;
        if(isMyPost){
            editButtonContent=`
            <span onclick="openDropDown('drop-${post.id}')" class="text-xl dark:text-white cursor-pointer">...</span>                
            `
        }

        let commentsContent='';
        for(comment1 of allComments){
            let profile_image_comment=""    ;        
            if(comment1.author.profile_image[0] !==undefined ){
                profile_image_comment=comment1.author.profile_image;
            }
            
            commentsContent +=`

                                    <div class="comment mb-3">
                            <div class="flex items-start relative gap-2.5">
                                <img onclick="userClicked(comment1.author.id)" class="w-8 h-8 rounded-full cursor-pointer " src="${profile_image_comment}" alt="Jese image">
                                <div class="flex flex-col gap-1 w-full max-w-[320px]">
                                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span onclick="userClicked(comment1.author.id)" class=" cursor-pointer  text-sm font-semibold text-gray-900 dark:text-white">${comment1.author.username}</span>
                                    <span class="text-sm font-normal text-gray-500 dark:text-gray-400">${comment1.author.created_at}</span>
                                </div>
                                <div class="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                    <p class="text-sm font-normal text-gray-900 dark:text-white"> ${comment1.body}</p>
                                </div>
                                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
                                </div>
                                <button onclick="openDropDown('commentOpen-${comment1.id}')" id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start" class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600" type="button">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                                </svg>
                                </button>
                                <div id="commentOpen-${comment1.id}" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
                                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                                    <li>
                                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reply</a>
                                    </li>
                                    <li>
                                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Forward</a>
                                    </li>
                                    <li>
                                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Copy</a>
                                    </li>
                                    <li>
                                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                                    </li>
                                    <li>
                                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                                    </li>
                                </ul>
                                </div>
                            </div>
                        </div>
            
            `
        }
        const postContent=`
        <div class="w-11/12 mx-auto mb-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <!-- headers -->

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
            <!-- end Header -->

            <!-- card Post -->

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
            <!-- Comments -->
            <div class="m-3 rounded-lg bg-white dark:bg-dim-400 p-3" id="comments-container">
            ${commentsContent}
            </div>
            <!-- input Add Comment -->
            
            <form id="input_comment">
                <label for="chat" class="sr-only">Your Comment</label>
                <div class="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <button type="button" class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                            <path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
                        </svg>
                        <span class="sr-only">Upload image</span>
                    </button>
                    <button type="button" class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"/>
                        </svg>
                        <span class="sr-only">Add emoji</span>
                    </button>
                    <textarea id="comment-content" rows="1" class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your comment..."></textarea>
                        <button onclick="sendComment()" type="button" class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                        <svg class="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
                        </svg>
                        <span class="sr-only">Send message</span>
                    </button>
                </div>
            </form>
        </div>
        `
        document.getElementById("containerPost").innerHTML=postContent;
    }).catch((error)=>{
        alert2(error.response.data.message)

    })    
    .finally(()=>{
        toggleLoader(false)
    })
}


    function sendComment(){
        const bodyComment=document.getElementById("comment-content").value;

        const token=localStorage.getItem("token");
        const url= `${baseUrl}/posts/${id}/comments`
        const params={
            "body" : bodyComment
        }
        toggleLoader(true)

        axios.post(url,params,{
            headers: {
                "authorization" : `Bearer ${token}`
            }
        })
        .then((response)=>{
            getPost()
            alert1("comment successfully")

        }).catch((error)=>{
            
            alert2(error.response.data.message)

        })
        .finally(()=>{
            toggleLoader(false)
        })
    }