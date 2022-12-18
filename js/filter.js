function filterPosts() {
    var filterValue = document.getElementById("filter-by").value;
    var posts = document.querySelectorAll(".post");
    for (var i = 0; i < posts.length; i++) {
      if (filterValue === "all") {
        posts[i].style.display = "block";
      } else if (posts[i].classList.contains(filterValue)) {
        posts[i].style.display = "block";
      } else {
        posts[i].style.display = "none";
      }
    }
  }
  
  document.getElementById("filter-by").addEventListener("change", filterPosts);
  