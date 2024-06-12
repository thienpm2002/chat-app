const btn = document.querySelector('.btn');

if(btn){
    btn.addEventListener('click',async ()=>{
          await fetch('/logout',{
            method: 'POST',
          })
          window.location.href = '/login';
    })
}



