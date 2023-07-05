$(document).ready(function() {
    // Bind event handlers to the links
    $('#courses-link').click(function(e) {
      e.preventDefault();
      loadContent('course.html');
    });
  
    $('#lecturers-link').click(function(e) {
      e.preventDefault();
      loadContent('lecturer.html');
    });
  
    $('#timetable-link').click(function(e) {
      e.preventDefault();
      loadContent('timetable.html');
    });
  
    // Function to load content into the #content div
    function loadContent(page) {
      $('#content').load(page);
    }
  });
  