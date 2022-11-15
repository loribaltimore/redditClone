let addRule = document.getElementById('addRule');
let allRules = document.querySelectorAll('ruleList');
let likingBtns = document.querySelectorAll('.liking');
let commentsBtn = document.querySelectorAll('.commentsBtn');
let commentAction = document.querySelectorAll('.commentAction');
console.log(commentAction)

addRule ?
    addRule.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('working')
        let allRules = document.querySelectorAll('.rule');
        let newRule = document.createElement('input');
        newRule.type = 'text';
        newRule.name = `rules[]`;
        newRule.placeholder = `Rule ${allRules.length + 1}`;
        newRule.classList.add('rule');
        console.log(newRule)
        document.getElementById('ruleList').appendChild(newRule);
    })
    :
    '';

likingBtns ?
    likingBtns.forEach(function async (element, index) {
        element.addEventListener('click', async (event) => {
            let increment = undefined;
            if (event.target.classList.contains('like')) {
               increment = 1;
            } else { increment = -1 };
            parseInt(event.path[1].children[1].innerText) + increment === -1 ?
                event.path[1].children[1].innerText = 0
                :
            event.path[1].children[1].innerText = parseInt(event.path[1].children[1].innerText) + increment;
            let postId = event.path[1].id;
            let comName = event.path[2].id;
            console.log(increment)
                await axios({
                    method: 'put',
                    url: `http://localhost:3000/${currentUserId}/com/${comName}/posts/${postId}`,
                    data: {increment: increment},
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(data => { console.log(data) }).catch(err => console.log(err));
            ;
        })
    })
    :
    '';

// commentsBtn ?
//     commentsBtn.forEach(function (element, index) {
//         element.addEventListener('click', async (event) => {
//             let comName = event.path[3].id;
//             let postId = event.path[3].childNodes[1].id;
//             await axios({
//                 method: 'get',
//                 url: `http://localhost:3000/${currentUserId}/com/${comName}/posts/${postId}`,
//                 params: {
//                     comment: true
//                 }
//             }).then(data => { console.log(data); return data}).catch(err => console.log(err));
//         });
//     })
//     :
//  ''

commentAction.length > 0 ?
    commentAction.forEach(async (element, index) =>  {
        element.addEventListener('click', async (event) => {
            if (element.classList.contains('delete')) {
                console.log('is working')
                await axios({
                    method: 'put',
                    url: `http://localhost:3000/${currentUserId}/com/${comName}/posts/${postId}`,
                    params: {
                        body: event.path[1].children[1],
                        time: event.path[1].children[2]
                  }
                }).then(data => console.log(data)).catch(err => console.log(err));
            }
            console.log(event.path[1].children[1]);
        })
    }) : ''


    ///finish with scripting comment deletion.
