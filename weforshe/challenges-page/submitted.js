let next = document.querySelector('.next');
let prev = document.querySelector('.prev');


next.addEventListener('click', function() {
   let items=document.querySelectorAll(".items")
   document.querySelector(".slides").appendChild(items[0])
})

prev.addEventListener('click', function() {
    let items=document.querySelectorAll(".items")
   document.querySelector(".slides").prepend(items[items.length-1]);
});
// JavaScript for handling display of submitted designs

document.addEventListener('DOMContentLoaded', function() {
    // Sample data (replace with actual data handling)
    const submittedDesigns = [
        { name: 'Sripriya Agarwal', description: 'Summer Gown', imageUrl: 'summergown.png' },
        { name: 'Sriya Singh', description: 'Jump Suit', imageUrl: 'jumpsuit.png' },
        // Add more submitted designs as needed
    ];

    const slidesContainer = document.querySelector('.slides');

    submittedDesigns.forEach(function(design) {
        const item = document.createElement('div');
        item.classList.add('items');
        item.style.backgroundImage = `url('${design.imageUrl}')`;

        item.innerHTML = `
            <div class="content">
                <div class="name">${design.name}</div>
                <div class="des">${design.description}</div>
                <button class="b">Vote for me</button>
            </div>
        `;

        slidesContainer.appendChild(item);
    });
});
