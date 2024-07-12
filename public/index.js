

const socket = io('http://localhost:3000', {
  path: "/api/socket.io",  // Đặt path của Socket.IO là /api/socket.io
  transports: ['websocket', 'polling'],
  withCredentials: true, // Cấu hình để gửi cookies
});

// ------------------------------------------- Xử lý on-off---------------------------


  socket.on('on',async (data)=>{
    const id = data.userId;
    await fetch('/on',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    const status = document.getElementById(`status-${id}`);
    if(status){
    status.classList.remove('off')
    status.classList.add('on');
    }
    
})
  
  socket.on('off',async (data)=>{
    const id = data.userId;
    const status = document.getElementById(`status-${id}`);
    if(status){
      status.classList.remove('on')
      status.classList.add('off');
      }
  })

  





const btn = document.querySelector('.wrap-logout');
const user = document.querySelector('.user');

if(btn){
    btn.addEventListener('click',async ()=>{
          await fetch('/api/logout',{
            method: 'POST',
          })
          window.location.href = '/login';
    })
}
// ------------------------------- Sự kiện mở form update---------------------------
if(user){
  user.addEventListener('click', ()=>{
       const home = document.querySelector('.home-conatiner');
       const updateForm = document.querySelector('.user-infor');
       home.classList.toggle('animation-home');
       updateForm.classList.toggle('animation-update');

  })
}

// ------------------------------- Sự kiện đóng form update ---------------------------
const btn_close = document.querySelector('.user-infor .fa-close');

if(btn_close){
    btn_close.addEventListener('click', ()=>{
      console.log(1);
      const home = document.querySelector('.home-conatiner');
      const updateForm = document.querySelector('.user-infor');
      home.classList.toggle('animation-home');
      updateForm.classList.toggle('animation-update');

  })
}

// ------------------------------- Update User---------------------------
const btn_update = document.querySelector('.update-user');
if(btn_update){

  btn_update.addEventListener('click',async ()=>{
    const user_name = document.querySelector('.user-name');
    const file = document.querySelector('.file');
    const formData = new FormData();
    formData.append('name',user_name.value);
    formData.append('img',file.files[0]);
    console.log(formData);
           try {
               const res = await fetch('/api/update',{
                method: 'PUT',
                body: formData,
              })
              const data = await res.json();
              const user = data.user; 
              console.log(user);
              document.querySelector('.img').src= user.Image;
              document.querySelector('.name').textContent = user.Name;
              document.querySelector('.img-update').src = user.Image;
           } catch (error) {
               console.error('Error:', error);
           }
  })
}

// ------------------------------- Search User---------------------------
const search = document.querySelector('.form-contact');
const list = document.querySelector('.list-item');
const content_contact = document.querySelector('.content-contact');
if(search){
  search.addEventListener('submit', async (e)=>{
          e.preventDefault();
          const name = document.querySelector('.input-add').value;
          const res = await fetch('/api/search-user',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
            },
              body: JSON.stringify({name})
          })
          const data = await res.json();
          console.log(data);
          const users = data.users_1;           //  Danh sach các user có ten là name và có relationship với user hien tai
          const idArray = data.users_2;         // Danh sach cac user có tên là name
          // Kiểm tra nếu users là một mảng và không rỗng
          if (!Array.isArray(idArray) || idArray.length === 0) {             
              list.innerHTML = `
                  <div class="friend-infor">
                      <strong class="name-contact">Không tìm thấy users</strong>
                  </div>`;
          } else {
            let html = ``;
            const lenght = idArray.length;
            if (!Array.isArray(users) || users.length === 0){    // Khong co ban ghi nao -> tất cả đều không có relationship -> add friend
              for (let i = 0; i < lenght; i++) {
                    html +=  `<div class='friend-infor'>
                    <img src="${idArray[i].Image}" class="img-add">
                    <strong class="name-contact">${idArray[i].Name}</strong>
                    <button class="btn-add" id="add-${idArray[i].Id}">Add friend</button>
                    </div>
              `;
             }
            }else {
              const user_length = users.length;
              for (let i = 0; i < lenght; i++) {
                 for (let y = 0; y < user_length; y++) {
                   if(idArray[i].Id === users[y].Id){ 
                       if(users[y].relationship === 'accepted'){      // Neu là ban thi thoat khoi vong lap den vơi user tiep theo
                            html +=  `<div class='friend-infor'> 
                            <img src="${idArray[i].Image}" class="img-add">
                            <strong class="name-contact">${idArray[i].Name}</strong>
                            <button class="add">Friend</button>
                            </div>
                      `;
                        break;
                       }else if(users[y].relationship === 'pending') {
                          if(idArray[i].Id === users[y].user_1){         // user là nguoi nhan loi moi ket ban
                            html +=  `<div class='friend-infor'>
                              <img src="${idArray[i].Image}" class="img-add">
                              <strong class="name-contact">${idArray[i].Name}</strong>
                              <button class="add" id="add-${idArray[i].Id}">Chap nhan</button>
                              <button class="reject" id="reject-${idArray[i].Id}">Tu choi</button>
                              </div>
                        `;
                              break;
                          }
                          if(idArray[i].Id === users[y].user_2){         // user là nguoi gui loi moi ket ban
                             html +=  `<div class='friend-infor'>
                              <img src="${idArray[i].Image}" class="img-add">
                              <strong class="name-contact">${idArray[i].Name}</strong>
                              <button class="cancel" id="add-${idArray[i].Id}">Huy</button>
                              </div>
                        `;
                        break;
                          }
                       }     
                   }else{
                        html +=  `<div class='friend-infor'>
                        <img src="${idArray[i].Image}" class="img-add">
                        <strong class="name-contact">${idArray[i].Name}</strong>
                        <button class="btn-add" id="add-${idArray[i].Id}">Add friend</button>
                        </div>
                        `;
                        break;
                   } 

                 }
                
              }

            }
            list.innerHTML = html;
          }
          const add = document.querySelectorAll('.btn-add'); // Su kien gui loi moi ket ban
          console.log(add);
          if(add){
              add.forEach((addF)=>{
                addF.addEventListener('click',async (e)=>{
                    const fromId = e.target.getAttribute('id').split('-')[1];
                    try {
                      const res = await fetch('/api/send-friend',{
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({fromId: fromId})
                      });
                      const data = await res.json();
                      e.target.textContent = 'Huy';
                      e.target.classList.replace('btn-add', 'cancel');
                      socket.emit('send',data);
                    } catch (error) {
                      console.error('Error:', error);
                    }
                    
                })
              })

          }
         
  })


}

const add = document.querySelectorAll('.btn-add'); // Su kien gui loi moi ket ban
if(add){
    add.forEach((addF)=>{
      addF.addEventListener('click',async (e)=>{
          const fromId = e.target.getAttribute('id').split('-')[1];
          try {
            const res = await fetch('/api/send-friend',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({fromId: fromId})
            });
            const data = await res.json();
            e.target.textContent = 'Huy';
            e.target.classList.replace('btn-add', 'cancel');
            socket.emit('send',data);
          } catch (error) {
            console.error('Error:', error);
          }
          
      })
    })

}

socket.on('request',(data)=>{
  console.log(data);
    const friendInfo = document.createElement('div');
    friendInfo.id = `friend-${data.user.Id}`; // Gán ID cho phần tử
    friendInfo.classList.add('friend-infor');

  friendInfo.innerHTML = `
      <img src="${data.user.Image}" class="img-add">
      <strong class="name-contact">${data.user.Name}</strong>
      <button class="add" id="add-${data.user.Id}">Chấp nhận</button>
      <button class="reject" id="reject-${data.user.Id}">Từ chối</button>
  `;

  list.appendChild(friendInfo);
  
  const add_friend = document.querySelector(`.add#add-${data.user.Id}`);
  console.log(add_friend);
  const reject_friend = document.querySelector(`#reject-${data.user.Id}`);
    if(add_friend){                 // Su kien friend
        add_friend.addEventListener('click',async (e)=>{
                  const res = await fetch('/api/add-friend',{
                      method:'POST',
                      headers: {
                            'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(data)
                  })
                  const result = await res.json();
                  const user = result.user;
                e.target.remove();
                reject_friend.remove();
                friendInfo.innerHTML = `
                    <img src="${data.user.Image}" class="img-add">
                    <strong class="name-contact">${data.user.Name}</strong>
                    <button>Friend</button>
                    `;

                const friend = document.createElement('div'); 
                friend.classList.add('wrap-appect');
                friend.innerHTML = `
                      <div class="accept-content">
                              <img src="${data.user.Image}" class="img-contact">
                                <strong class="name-contact">${data.user.Name}</strong>
                        </div>
                `;
                content_contact.appendChild(friend);
            socket.emit('add-friend',{user:user,toId: data.toId});
        })
      
      
    }

    if(reject_friend){    // Su kien tu choi
      reject_friend.addEventListener('click',async (e)=>{
                const res = await fetch('/api/reject-friend',{
                    method:'POST',
                    headers: {
                          'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                const result = await res.json();
                const user = result.user;
              friendInfo.remove();
          socket.emit('reject-friend',{user:user,toId: data.toId});
        })
     
    }

})


socket.on('accept',(data)=>{
  document.querySelector(`.cancel#add-${data.user.Id}`).textContent = 'Friend';
  const friend = document.createElement('div'); 
  friend.classList.add('wrap-appect');
  friend.innerHTML = `
         <div class="accept-content">
                 <img src="${data.user.Image}" class="img-contact">
                 <strong class="name-contact">${data.user.Name}</strong>
          </div>
  `;
  content_contact.appendChild(friend);
})

socket.on('reject',(data)=>{
    document.querySelector(`.cancel#add-${data.user.Id}`).textContent = 'Bị tu chối';
})



const add_friend = document.querySelectorAll(`.add`);
const reject_friend = document.querySelectorAll(`.reject`);
const infor = document.querySelector('.friend-infor');

if(add_friend){           // Su kien add friend
  add_friend.forEach((addFriend)=>{
          addFriend.addEventListener('click',async (e)=>{
            const toId = e.target.getAttribute('id').split('-')[1];
            const res = await fetch('/api/add-friend',{
                method:'POST',
                headers: {
                      'Content-Type': 'application/json'
                },
                body: JSON.stringify({toId:toId})
            })
            const result = await res.json();
            const user = result.user;
            const user_2 =  result.user_2;
          e.target.remove();
          document.querySelector(`#reject-${user_2.Id}`).remove();
          infor.innerHTML = `
              <img src="${user_2.Image}" class="img-add">
              <strong class="name-contact">${user_2.Name}</strong>
              <button>Friend</button>
              `;

          const friend = document.createElement('div'); 
          friend.classList.add('wrap-appect');
          friend.innerHTML = `
                <div class="accept-content">
                        <img src="${user_2.Image}" class="img-contact">
                          <strong class="name-contact">${user_2.Name}</strong>
                  </div>
          `;
          content_contact.appendChild(friend);
          socket.emit('add-friend',{user:user,toId: toId});
      })
  })

}

if(reject_friend){    // Su kien tu choi
  reject_friend.forEach((rejectFriend)=>{
     rejectFriend.addEventListener('click',async (e)=>{
         const toId = e.target.getAttribute('id').split('-')[1];
          const res = await fetch('/api/reject-friend',{
              method:'POST',
              headers: {
                    'Content-Type': 'application/json'
              },
              body: JSON.stringify({toId:toId})
          })
          const result = await res.json();
          const user = result.user;
          const user_2 =  result.user_2;
        document.querySelector(`#friend-${user_2.Id}`).remove();
    socket.emit('reject-friend',{user:user,toId: toId});
    })
  })
}


// ------------------------------- Chat ---------------------------



const header_message = document.querySelector('.header-message');

const list_chat = document.querySelector('.list-chat');
const wrap = document.querySelectorAll('.wrap');
const wrap_message = document.querySelector('.wrap-message');
const listMessage =  document.querySelector('.wrap-message ul');
const chatForm = document.querySelector('.chat-form');
const inputChat = document.querySelector('.chat-form .input-chat');
const inputFile = document.querySelector('.chat-form #file');
const label =  document.getElementById('fileName');

const list_team = document.querySelector('.list-team');
const wrap_team = document.querySelectorAll('.wrap-team');
const wrap_team_chat = document.querySelector('.wrap-team-chat');
const listMessageTeam = document.querySelector('.wrap-team-chat ul');
const chatFormTeam = document.querySelector('.chat-form-team');
const inputChatTeam = document.querySelector('.chat-form-team .input-chat');


// Lấy ra các đoan chat 
if(wrap){
  wrap.forEach((user)=>{
       user.addEventListener('click',async (e)=>{
                  
          label.textContent = '';
          inputChat.value = '';
          const id = e.target.getAttribute('id').split('-')[1];
          const res = await fetch('/api/chat',{
               method: 'POST',
               headers: {
                'Content-Type': 'application/json'
               },
               body: JSON.stringify({id:id})
          })
          const data = await res.json();
          console.log(data);
          const messageArr = data.messages;
          const receiver = data.receiver;
          const relationship = data.relationship;
          console.log(relationship);
          if(relationship !== 'accepted' || !relationship){
            header_message.innerHTML = ` <div class="wrap-header">
                                            <img src="${receiver.Image}" class="img-contact">
                                            <strong>${receiver.Name}</strong>
                                            <p class='not-friend'>Not Friend</p>
                                         </div>`
          }else{
            header_message.innerHTML = ` <div class="wrap-header">
                                            <img src="${receiver.Image}" class="img-contact">
                                            <strong>${receiver.Name}</strong>
                                            <p class='friend'>Friend</p>
                                         </div>`
          }
          

         wrap_message.style.display = 'block';
         wrap_message.querySelector('form').id = `form-${receiver.Id}`;
         if(messageArr.length > 0 ){
          listMessage.innerHTML = messageArr.map((message)=>{
                  if(receiver.Id === message.sender_id){
                    if (message.content.match(/\.(jpeg|jpg|gif|png)$/)){
                      return `<li class='message-item-l'> <img src="${message.content}" class="message-img"></li>`
                    }else if (message.content.startsWith('/img/uploads/')){
                          const content =  message.content.split('-')[1];
                         return `<li class='message-item-l'> <a href='${message.content}' class='message-l'>${content}</a></li>`
                    }else{
                       return `<li class='message-item-l'><p class='message-l'>${message.content}</p></li>`
                    }
                  }
                  if(receiver.Id === message.receiver_id){
                    if (message.content.match(/\.(jpeg|jpg|gif|png)$/)){
                      return `<li class='message-item-r'> <img src="${message.content}" class="message-img"></li>`
                    }else if (message.content.startsWith('/img/uploads/')){
                         const content =  message.content.split('-')[1];
                         return `<li class='message-item-r'> <a href='${message.content}' class='message-r'>${content}</a></li>`
                    }else{
                       return `<li class='message-item-r'><p class='message-r'>${message.content}</p></li>`
                    }
                  }
            }).join('');
            listMessage.scrollTop = listMessage.scrollHeight;
         }
        })
  })
}

// Gửi tin nhắn
if(inputFile){
  inputFile.addEventListener('change',(e)=>{
    label.textContent = inputFile.files[0].name;
  })
}

if(chatForm){
     chatForm.addEventListener('submit',async (e)=>{
          e.preventDefault();
          const receiver_id = e.target.getAttribute('id').split('-')[1];
          const message = inputChat.value;
          const file = inputFile.files[0];
          const formData = new FormData();
          if(file){
            formData.append('file',file);
           document.getElementById('fileName').textContent = file.name;
          }
          if(message){
            formData.append('message',message);
          }
          formData.append('receiver_id',receiver_id);
          const res = await fetch('/api/send-message',{
             method: 'POST',
             body: formData
          })
           
          const data = await res.json();
          console.log(data)
          if(data.filePath){
              if (data.filePath.match(/\.(jpeg|jpg|gif|png)$/)){
                const li = document.createElement('li');
                li.classList.add('message-item-r');
                li.innerHTML = `<img src="${data.filePath}" class="message-img">`;
                listMessage.appendChild(li);
                listMessage.scrollTop = listMessage.scrollHeight;
              }else {
                const li = document.createElement('li');
                li.classList.add('message-item-r');
                li.innerHTML = `<a href='${data.filePath}'>${file.name}</a>`;
                listMessage.appendChild(li);
                listMessage.scrollTop = listMessage.scrollHeight;
              }
              label.textContent = '';
          }
          if(message){
            const li = document.createElement('li');
            li.classList.add('message-item-r');
            li.innerHTML = `<p class='message-r'>${message}</p>`;
            listMessage.appendChild(li);
            inputChat.value = '';
            listMessage.scrollTop = listMessage.scrollHeight;
          }

          const first = list_chat.firstChild;
          const receiver_item = document.getElementById(`message-${data.receiver.Id}`);
          if( (file && message) || (!file && message) ){
            if(first === receiver_item) {
           
              receiver_item.innerHTML = `<div class="avatar">
                                              <img src="${data.receiver.Image}" class="img-contact">
                                              <div class="${data.receiver.Status}" id="status-${data.receiver.Id}"></div>
                                          </div>
                                          <div class="chat-content">
                                              <strong class="name-contact">${data.receiver.Name}</strong>
                                              <p class="message-contact">You: ${message}</p>  
                                          </div>`;
            }else{
              receiver_item.innerHTML = `<div class="avatar">
                                              <img src="${data.receiver.Image}" class="img-contact">
                                              <div class="${data.receiver.Status}" id="status-${data.receiver.Id}"></div>
                                          </div>
                                          <div class="chat-content">
                                              <strong class="name-contact">${data.receiver.Name}</strong>
                                              <p class="message-contact">You: ${message}</p>  
                                          </div>`;
                list_chat.insertBefore(receiver_item,first); 
            }
          }else {
            if(first === receiver_item) {
           
              receiver_item.innerHTML = `<div class="avatar">
                                              <img src="${data.receiver.Image}" class="img-contact">
                                              <div class="${data.receiver.Status}" id="status-${data.receiver.Id}"></div>
                                          </div>
                                          <div class="chat-content">
                                              <strong class="name-contact">${data.receiver.Name}</strong>
                                              <p class="message-contact">You: ${file.name}</p>  
                                          </div>`;
            }else{
              receiver_item.innerHTML = `<div class="avatar">
                                              <img src="${data.receiver.Image}" class="img-contact">
                                              <div class="${data.receiver.Status}" id="status-${data.receiver.Id}"></div>
                                          </div>
                                          <div class="chat-content">
                                              <strong class="name-contact">${data.receiver.Name}</strong>
                                              <p class="message-contact">You: ${file.name}</p>  
                                          </div>`;
                list_chat.insertBefore(receiver_item,first); 
            }
          }
          
                  

          socket.emit('send-message',{message:message, filePath:data.filePath,sender: data.sender, receiver: data.receiver});

     })
}


socket.on('receiver-message',(data)=>{
    console.log(data);

    if(data.filePath){
      if (data.filePath.match(/\.(jpeg|jpg|gif|png)$/)){
        const li = document.createElement('li');
        li.classList.add('message-item-l');
        li.innerHTML = `<img src="${data.filePath}" class="message-img">`;
        listMessage.appendChild(li);
        listMessage.scrollTop = listMessage.scrollHeight;
      }else{
        const li = document.createElement('li');
        li.classList.add('message-item-l');
        li.innerHTML = `<a href='${data.filePath}'>${file.name}</a>`;
        listMessage.appendChild(li);
        listMessage.scrollTop = listMessage.scrollHeight;
      }
  }
  if(message){
    const li = document.createElement('li');
    li.classList.add('message-item-l');
    li.innerHTML = `<p class='message-l'>${data.message}</p>`;
    listMessage.appendChild(li);
    inputChat.value = '';
    listMessage.scrollTop = listMessage.scrollHeight;
  }


    const first = list_chat.firstChild;
    const sender_item = document.getElementById(`message-${data.sender.Id}`);
    if( (file && message) || (!file && message) ){
      if(sender_item){                                       // Kiêm tra xem có đoạn chat voi sender chưa nêu chưa thì thêm item vào list Chats
        if(first === sender_item){
          sender_item.innerHTML = `<div class="avatar">
                                        <img src="${data.sender.Image}" class="img-contact">
                                        <div class="${data.sender.Status}" id="status-${data.sender.Id}"></div>
                                    </div>
                                    <div class="chat-content">
                                          <strong class="name-contact">${data.sender.Name}</strong>
                                          <p class="message-contact">${data.sender.Name}: ${data.message}</p>  
                                    </div>`;
        }else{
          sender_item.innerHTML = `<div class="avatar">
                                        <img src="${data.sender.Image}" class="img-contact">
                                        <div class="${data.sender.Status}" id="status-${data.sender.Id}"></div>
                                    </div>
                                    <div class="chat-content">
                                          <strong class="name-contact">${data.sender.Name}</strong>
                                          <p class="message-contact">${data.sender.Name}: ${data.message}</p>  
                                    </div>`;
          
            list_chat.insertBefore(sender_item,first);   
        }
      } else {
          const sender_item = document.createElement('div');
          sender_item.id = `message-${data.sender.Id}`;
          sender_item.classList.add('wrap');
          if(data.sender.Status === 'on'){
            sender_item.innerHTML = `<div class="avatar">
                                  <img src="${data.sender.Image}" class="img-contact">
                                  <div class="on" id="status-${data.sender.Id}"></div>
                              </div>
                              <div class="chat-content">
                                  <strong class="name-contact">${data.sender.Name}</strong>
                                  <p class="message-contact">${data.sender.Name}: ${data.message}</p>
                              </div>`
          }else {
            sender_item.innerHTML = `<div class="avatar">
                                  <img src="${data.sender.Image}" class="img-contact">
                                  <div class="off" id="status-${data.sender.Id}"></div>
                              </div>
                              <div class="chat-content">
                                  <strong class="name-contact">${data.sender.Name}</strong>
                                  <p class="message-contact">${data.sender.Name}: ${data.message}</p>
                              </div>`
          }
          list_chat.insertBefore(sender_item,first);  
      }
    }else {
      if(sender_item){                                       // Kiêm tra xem có đoạn chat voi sender chưa nêu chưa thì thêm item vào list Chats
        if(first === sender_item){
          sender_item.innerHTML = `<div class="avatar">
                                        <img src="${data.sender.Image}" class="img-contact">
                                        <div class="${data.sender.Status}" id="status-${data.sender.Id}"></div>
                                    </div>
                                    <div class="chat-content">
                                          <strong class="name-contact">${data.sender.Name}</strong>
                                          <p class="message-contact">${data.sender.Name}: ${data.filePath}</p>  
                                    </div>`;
        }else{
          sender_item.innerHTML = `<div class="avatar">
                                        <img src="${data.sender.Image}" class="img-contact">
                                        <div class="${data.sender.Status}" id="status-${data.sender.Id}"></div>
                                    </div>
                                    <div class="chat-content">
                                          <strong class="name-contact">${data.sender.Name}</strong>
                                          <p class="message-contact">${data.sender.Name}: ${data.filePath}</p>  
                                    </div>`;
          
            list_chat.insertBefore(sender_item,first);   
        }
      } else {
          const sender_item = document.createElement('div');
          sender_item.id = `message-${data.sender.Id}`;
          sender_item.classList.add('wrap');
          if(data.sender.Status === 'on'){
            sender_item.innerHTML = `<div class="avatar">
                                  <img src="${data.sender.Image}" class="img-contact">
                                  <div class="on" id="status-${data.sender.Id}"></div>
                              </div>
                              <div class="chat-content">
                                  <strong class="name-contact">${data.sender.Name}</strong>
                                  <p class="message-contact">${data.sender.Name}: ${data.filePath}</p>
                              </div>`
          }else {
            sender_item.innerHTML = `<div class="avatar">
                                  <img src="${data.sender.Image}" class="img-contact">
                                  <div class="off" id="status-${data.sender.Id}"></div>
                              </div>
                              <div class="chat-content">
                                  <strong class="name-contact">${data.sender.Name}</strong>
                                  <p class="message-contact">${data.sender.Name}: ${data.filePath}</p>
                              </div>`
          }
          list_chat.insertBefore(sender_item,first);  
      }
    }
   
    

})

// tim user de chat

const searchChat = document.querySelector('.searchChat');
const inputSearchChat = document.querySelector('.search-chat');
const menu_search = document.querySelector('.menu-search');

if(searchChat){
  searchChat.addEventListener('submit',async (e) =>{
         e.preventDefault();
         const name = inputSearchChat.value;

         const res = await fetch('/api/search-chat',{
          method:'POST',
          headers: {
                'Content-Type': 'application/json'
          },
          body: JSON.stringify({name:name})
      })
      const data = await res.json();
      const users = data.users;
      console.log(users);
      if(!Array.isArray(users) || users.length === 0 || !users){
        menu_search.textContent = 'Khong tim thay user'
      }else{
          const user_result = users.map((user)=>{
                return `<div class='result' id='result-${user.Id}'>
                        <img src="${user.Image}">
                        <strong class="name-contact">${user.Name}</strong>
                      </div>`
          }).join('');
          menu_search.innerHTML = user_result;
      }  
      menu_search.style.display = 'block';
      inputSearchChat.value = '';
      const result = document.querySelector('.result');
      result.addEventListener('click',async (e)=>{
          const id = e.target.getAttribute('id').split('-')[1];
          const res = await fetch('/api/chat',{
            method: 'POST',
            headers: {
             'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:id})
       })
          const data = await res.json();
          const messageArr = data.messages;
          const receiver = data.receiver;
          const relationship = data.relationship;

          const item  = document.getElementById(`message-${id}`);

          if(item){
                  // Header
                  if(relationship !== 'accepted' || !relationship){
                    header_message.innerHTML = ` <div class="wrap-header">
                                                    <img src="${receiver.Image}" class="img-contact">
                                                    <strong>${receiver.Name}</strong>
                                                    <p class='not-friend'>Not Friend</p>
                                                </div>`
                  }else{
                    header_message.innerHTML = ` <div class="wrap-header">
                                                    <img src="${receiver.Image}" class="img-contact">
                                                    <strong>${receiver.Name}</strong>
                                                    <p class='friend'>Friend</p>
                                                </div>`
                  }

                  // Đoan chat
                wrap_message.style.display = 'block';
                wrap_message.querySelector('form').id = `form-${receiver.Id}`;
                if(messageArr.length > 0 ){
                  listMessage.innerHTML = messageArr.map((message)=>{
                          if(receiver.Id === message.sender_id){
                            return `<li class='message-item-l'><p class='message-l'>${message.content}</p></li>`
                          }
                          if(receiver.Id === message.receiver_id){
                            return `<li class='message-item-r'><p class='message-r'>${message.content}</p></li>`
                          }
                    }).join('');
                }
                listMessage.scrollTop = listMessage.scrollHeight;
          }else {
              const item = document.createElement('div');
              item.id = `message-${id}`;
              item.classList.add('wrap');
              if(receiver.Status === 'on'){
                item.innerHTML = `<div class="avatar">
                                      <img src="${receiver.Image}" class="img-contact">
                                      <div class="on" id="status-${receiver.Id}"></div>
                                  </div>
                                  <div class="chat-content">
                                       <strong class="name-contact">${receiver.Name}</strong>
                                  </div>`
              }else {
                item.innerHTML = `<div class="avatar">
                                      <img src="${receiver.Image}" class="img-contact">
                                      <div class="off" id="status-${receiver.Id}"></div>
                                  </div>
                                  <div class="chat-content">
                                      <strong class="name-contact">${receiver.Name}</strong>
                                  </div>`
              }
              
               const first = list_chat.firstChild; 
               list_chat.insertBefore(item,first);      
               // Header
               if(relationship !== 'accepted' || !relationship){
                header_message.innerHTML = ` <div class="wrap-header">
                                                <img src="${receiver.Image}" class="img-contact">
                                                <strong>${receiver.Name}</strong>
                                                <p class='not-friend'>Not Friend</p>
                                            </div>`
              }else{
                header_message.innerHTML = ` <div class="wrap-header">
                                                <img src="${receiver.Image}" class="img-contact">
                                                <strong>${receiver.Name}</strong>
                                                <p class='friend'>Friend</p>
                                            </div>`
              }

                // Đoan chat
              wrap_message.style.display = 'block';
              wrap_message.querySelector('form').id = `form-${receiver.Id}`;
          }

          menu_search.style.display = 'none';

      })
      document.addEventListener('click', function(event) {
        if (!menu_search.contains(event.target)) {
          menu_search.style.display = 'none';
        }
      });
  })
  
}


// ------------------------------------------------- Teams ------------------------



// Lấy ra các message in team va Join vao cac team minh tham gia
if(wrap_team){
  wrap_team.forEach((wrap)=>{
    let teamId =  wrap.getAttribute('id').split('-')[1];
    socket.emit('join',teamId);
    wrap.addEventListener('click',async (e)=>{
         try {
            const res = await fetch('/api/team-chat',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({teamId:teamId})
            })
            const data = await res.json();
            const header_team = data.members;
            const messageArr = data.messages;
            header_message.innerHTML = `<div class="wrap-header">
                                            <img src="${header_team.Image}" class="img-contact">
                                            <strong>${header_team.Name}</strong>
                                            <p class='limit'>${header_team.SL} Members</p>
                                            <p class='code-team'>Code: ${header_team.code}</p>
                                        </div>`

            wrap_team_chat.style.display = 'block';
            wrap_team_chat.querySelector('form').id = `form-${teamId}`;
            if(messageArr.length > 0 ){
              listMessageTeam.innerHTML = messageArr.map((message)=>{
                      if(data.userId === message.Id){
                        return `<li class='message-item-r'>
                                   <p class='message-r'>${message.content}</p>
                                </li>`
                      }else {
                         return `<li class='message-item-g'>
                                    <p class="name-member">${message.Name}</p>
                                    <img src="${message.Image}" class="img-chat-team">
                                    <p class='message-l-t'>${message.content}</p>
                                </li>`
                      }
                }).join('');
             }else{
              listMessageTeam.innerHTML = '';
             }
             listMessageTeam.scrollTop = listMessageTeam.scrollHeight;
         } catch (error) {
             console.log(error.message);
         }
    })
  })
}


// chat-team

if(chatFormTeam){
   chatFormTeam.addEventListener('submit',async (e)=>{
          e.preventDefault();
          const teamId = chatFormTeam.getAttribute('id').split('-')[1];
          const content = inputChatTeam.value;
          try {
              const res = await fetch('/api/chat-team',{
                  method: 'POST',
                  headers: {
                       'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({teamId: teamId, message: content})
              })
              const data = await res.json();
              console.log(data);

              const li = document.createElement('div');
              li.classList.add('message-item-r');
              li.innerHTML = `<p class='message-r'>${content}</p>`
              listMessageTeam.appendChild(li);
              listMessageTeam.scrollTop = listMessageTeam.scrollHeight;

              inputChatTeam.value = '';

              const first = list_team.firstChild;
              const team_item = document.getElementById(`team-${teamId}`);

              if(first === team_item) {
                team_item.innerHTML = `<div class="avatar-team">
                                     <img src="${data.sender.team_img}" class="img-contact">
                                 </div>
                                 <div class="chat-content">
                                      <strong class="name-contact">${data.sender.team_name}</strong>
                                      <p class="message-contact">You: ${content}</p>
                                  </div>`;
              }else{
                team_item.innerHTML = `<div class="avatar-team">
                                     <img src="${data.sender.team_img}" class="img-contact">
                                 </div>
                                 <div class="chat-content">
                                      <strong class="name-contact">${data.sender.team_name}</strong>
                                      <p class="message-contact">You: ${content}</p>
                                  </div>`;
                list_team.insertBefore(team_item,first); 
              }
              socket.emit('send-team',data);
          } catch (error) {
            console.log(error.message);
          }

   })
}


socket.on('receiver-team',(data)=>{
  const li = document.createElement('li');
  li.classList.add('message-item-g');
  li.innerHTML = `<p class="name-member">${data.sender.sender_name}</p>
                  <img src="${data.sender.sender_img}" class="img-chat-team">
                  <p class='message-l-t'>${data.message}</p>`;
  listMessageTeam.appendChild(li);

  const first = list_team.firstChild;
  const team_item = document.getElementById(`team-${data.sender.team_id}`);                                    // Kiêm tra xem có đoạn chat voi sender chưa nêu chưa thì thêm item vào list Chats
  if(first === team_item){
    team_item.innerHTML = `<div class="avatar-team">
                                    <img src="${data.sender.team_img}" class="img-contact">
                                </div>
                                <div class="chat-content">
                                    <strong class="name-contact">${data.sender.team_name}</strong>
                                    <p class="message-contact">${data.sender.sender_name}: ${data.message}</p>
                                </div>`;
  }else{
    team_item.innerHTML = `<div class="avatar-team">
                                    <img src="${data.sender.team_img}" class="img-contact">
                                </div>
                                <div class="chat-content">
                                    <strong class="name-contact">${data.sender.team_name}</strong>
                                    <p class="message-contact">${data.sender.sender_name}: ${data.message}</p>
                                </div>`;
    list_team.insertBefore(team_item,first);   
  }

  
})