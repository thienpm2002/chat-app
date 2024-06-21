

const socket = io('http://localhost:3000', {
  path: "/api/socket.io",  // Đặt path của Socket.IO là /api/socket.io
  transports: ['websocket', 'polling'],
  withCredentials: true, // Cấu hình để gửi cookies
});

const btn = document.querySelector('.wrap-logout');
const user = document.querySelector('.user');

if(btn){
    btn.addEventListener('click',async ()=>{
          await fetch('/logout',{
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
          const users = data.users_1;           // Danh sach cac user có tên là name Danh sach các user có ten là name và có relationship với user hien tai
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
console.log(add_friend);
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