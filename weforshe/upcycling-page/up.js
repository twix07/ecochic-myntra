document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tab buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            this.classList.add('active');

            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));

            // Show the associated tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});
function addComment() {
    // Get the input value
    var commentText = document.getElementById("comment-input").value.trim();
    
    // Check if the input is not empty
    if (commentText !== "") {
        // Create a new comment element
        var commentElement = document.createElement("div");
        commentElement.className = "timeline-item";
        commentElement.innerHTML = '<i class="fa-solid fa-user"></i><span>' + commentText + '</span>';
        
        // Append the new comment to the comment list
        var commentList = document.getElementById("comment-list");
        commentList.appendChild(commentElement);
        
        // Clear the input field after adding the comment
        document.getElementById("comment-input").value = "";
    }
}

// Ensure the document is fully loaded before executing the JavaScript
$(document).ready(function() {
    var currentIndex = 0;
    var videoItems = $('.video-item');
    var totalVideos = videoItems.length;
    var videoWidth = $('.video-item').outerWidth(true);

    // Next button click handler
    $('.next-btn').click(function() {
        if (currentIndex < totalVideos - 1) {
            currentIndex++;
            $('.videos').css('transform', 'translateX(' + (-currentIndex * videoWidth) + 'px)');
        }
    });

    // Previous button click handler
    $('.prev-btn').click(function() {
        if (currentIndex > 0) {
            currentIndex--;
            $('.videos').css('transform', 'translateX(' + (-currentIndex * videoWidth) + 'px)');
        }
    });
});
