$(document).ready(function() {
    var lecturersData; // Variable to store the lecturer data
  
    // Fetch the lecturer data
    $.ajax({
      url: 'data/lecturer.json',
      type: 'GET',
      dataType: 'json',
      success: function(response) {
        if (response) {
          lecturersData = response;
  
          // Populate the level dropdown
          var levels = Array.from(new Set(lecturersData.map(function(lecturer) {
            return lecturer.level;
          })));
          $.each(levels, function(index, level) {
            $('#level').append('<option value="' + level + '">' + level + '</option>');
          });
        } else {
          console.log('Error: No lecturer data found.');
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
        var semesters = Array.from(new Set(lecturersData
          .filter(function(lecturer) {
            return lecturer.level === selectedLevel;
          })
          .map(function(lecturer) {
            return lecturer.semester;
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
    $('#lecturer-form').on('submit', function(event) {
      event.preventDefault();
  
      var selectedLevel = $('#level').val();
      var selectedSemester = $('#semester').val();
  
      // Filter the lecturer data based on the selected level and semester
      var filteredLecturers = lecturersData.filter(function(lecturer) {
        return (lecturer.level === selectedLevel && lecturer.semester === selectedSemester);
      });
  
      // Display the filtered lecturers
      displayLecturers(filteredLecturers);
    });
  });
  
  // Function to display the lecturers
  function displayLecturers(lecturers) {
    var lecturerList = $('#lecturer-list');
    lecturerList.empty();
  
    if (lecturers.length > 0) {
      $.each(lecturers, function(index, lecturer) {
        var listItem = $('<li>').text(lecturer.name + ' - ' + lecturer.specialization);
        lecturerList.append(listItem);
      });
    } else {
      var listItem = $('<li>').text('No lecturers found.');
      lecturerList.append(listItem);
    }
  }
  