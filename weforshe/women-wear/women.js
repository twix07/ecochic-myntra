let item=document.querySelectorAll(".slides .list .item");
let next = document.querySelector('.next');
let prev = document.querySelector('.prev');
let thumbnails=document.querySelectorAll(".thumbnail .item");

let countitem=item.length;
let itemactive=0;
next.onclick=function(){
    itemactive=itemactive+1;
    if(itemactive>=countitem){
        itemactive=0;
    }
    showslider();
}
prev.onclick=function(){
    itemactive=itemactive-1;
    if(itemactive<0){
        itemactive=countitem-1;
    }
    showslider();
}
function showslider(){
    let itemactiveold=document.querySelector('.slides .list .item.active');
    let thumnailactiveold=document.querySelector('.thumbnail  .item.active');
    itemactiveold.classList.remove('active');
    thumnailactiveold.classList.remove('active');
    item[itemactive].classList.add('active');
    thumbnails[itemactive].classList.add('active');

}
thumbnails.forEach ((thumbnail,index)=>{
    thumbnail.addEventListener('click',()=>{
        itemactive=index;
        showslider();
    })
})

