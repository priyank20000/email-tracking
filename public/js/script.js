function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
    toggleIconVisibility(); // Call function to toggle icon visibility
}

function toggleIconVisibility() {
    var sidebar = document.getElementById("sidebar");
    var sidebarIcon = document.querySelector(".sidebar-icon");
    if (sidebar.classList.contains("active")) {
        sidebarIcon.style.display = "none";
    } else {
        sidebarIcon.style.display = "block";
    }
}

// Close the sidebar when clicking outside of it
window.onclick = function(event) {
    var sidebar = document.getElementById("sidebar");
    if (event.target != sidebar && !event.target.closest(".sidebar-icon")) {
        sidebar.classList.remove("active");
        toggleIconVisibility();
    }
}
