$(document).ready(function() {
  var coursesData; // Variable to store the course data

  // Fetch the course data
  $.ajax({
    url: 'data/course.json',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response && response.courses && Array.isArray(response.courses)) {
        coursesData = response.courses;

        // Populate the level dropdown
        var levels = Array.from(new Set(coursesData.map(function(course) {
          return course.level;
        })));
        $.each(levels, function(index, level) {
          $('#level').append('<option value="' + level + '">' + level + '</option>');
        });
      } else {
        console.log('Error: Invalid course data format.');
      }
    },
    error: function(xhr, textStatus, errorThrown) {
      console.log('Error:', errorThrown);
    }
  });

  // Handle level selection change
  $('#level').on('change', function() {
    var selectedLevel = $(this).val();

    // Clear and disable the semester dropdown
    $('#semester').empty().prop('disabled', true);
    $('#semester').append('<option value="">Select Semester</option>');

    if (selectedLevel !== '') {
      // Get the semesters available for the selected level
      var semesters = Array.from(new Set(coursesData
        .filter(function(course) {
          return course.level === selectedLevel;
        })
        .map(function(course) {
          return course.semester;
        })
      ));

      // Populate the semester dropdown
      $.each(semesters, function(index, semester) {
        $('#semester').append('<option value="' + semester + '">' + semester + '</option>');
      });

      // Enable the semester dropdown
      $('#semester').prop('disabled', false);
    }
  });

  // Handle form submission
  $('#course-form').on('submit', function(event) {
    event.preventDefault();

    var selectedLevel = $('#level').val();
    var selectedSemester = $('#semester').val();

    // Filter the course data based on the selected level and semester
    var filteredCourses = coursesData.filter(function(course) {
      return (course.level === selectedLevel && course.semester === selectedSemester);
    });

    // Display the filtered courses
    displayCourses(filteredCourses);
  });
});

// Function to display the courses
function displayCourses(courses) {
  var courseList = $('#course-list');
  courseList.empty();

  if (courses.length > 0) {
    $.each(courses, function(index, course) {
      var listItem = $('<li>').text(course.name);
      courseList.append(listItem);
    });
  } else {
    var listItem = $('<li>').text('No courses found.');
    courseList.append(listItem);
  }
}
