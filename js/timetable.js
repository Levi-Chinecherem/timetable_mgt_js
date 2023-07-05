$(document).ready(function() {
  var timetableData; // Variable to store the timetable data

  // Fetch the timetable data
  $.getJSON('data/timetable.json', function(response) {
    if (response && Array.isArray(response)) {
      timetableData = response;

      // Populate the level dropdown
      var levels = Array.from(new Set(timetableData.map(function(entry) {
        return entry.level;
      })));
      $.each(levels, function(index, level) {
        $('#level').append('<option value="' + level + '">' + level + '</option>');
      });
    } else {
      console.log('Error: Invalid timetable data format.');
    }
  })
  .fail(function(xhr, textStatus, errorThrown) {
    console.log('Error:', errorThrown);
  });

  // Handle level selection change
  $('#level').on('change', function() {
    var selectedLevel = $(this).val();

    // Clear and disable the semester dropdown
    $('#semester').empty().prop('disabled', true);
    $('#semester').append('<option value="">Select Semester</option>');

    if (selectedLevel !== '') {
      // Get the semesters available for the selected level
      var semesters = Array.from(new Set(timetableData
        .filter(function(entry) {
          return entry.level === selectedLevel;
        })
        .map(function(entry) {
          return entry.semester;
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
  $('#timetable-form').on('submit', function(event) {
    event.preventDefault();

    var selectedLevel = $('#level').val();
    var selectedSemester = $('#semester').val();

    // Filter the timetable data based on the selected level and semester
    var filteredTimetableData = timetableData.filter(function(entry) {
      return (entry.level === selectedLevel && entry.semester === selectedSemester);
    });

    if (filteredTimetableData.length > 0) {
      var filteredTimetable = filteredTimetableData[0].timetable;
      // Generate the timetable based on the filtered timetable data
      generateTimetable(filteredTimetable, selectedSemester);
    } else {
      // If no timetable data is found for the selected level and semester
      generateTimetable([], selectedSemester);
    }
  });
});

// Function to generate the timetable
function generateTimetable(timetable, selectedSemester) {
  var timetableTable = $('#timetable-table');
  timetableTable.find('tr:gt(0)').remove();

  if (timetable.length > 0) {
    // Group the timetable by day
    var timetableByDay = {};
    timetable.forEach(function(entry) {
      if (!timetableByDay[entry.day]) {
        timetableByDay[entry.day] = [];
      }
      timetableByDay[entry.day].push(entry);
    });

    // Sort each day's timetable by start time
    for (var day in timetableByDay) {
      timetableByDay[day].sort(function(a, b) {
        return a.start_time.localeCompare(b.start_time);
      });
    }

    // Sort the days of the week
    var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    daysOfWeek.sort(function(a, b) {
      var dayOrder = {
        Monday: 0,
        Tuesday: 1,
        Wednesday: 2,
        Thursday: 3,
        Friday: 4
      };
      return dayOrder[a] - dayOrder[b];
    });

    // Generate the timetable rows
    var updatedTimetable = [];
    daysOfWeek.forEach(function(day) {
      var dayEntries = timetableByDay[day] || [];

      // Add break time entry
      var breakTimeEntry = {
        day: day,
        start_time: '12:00',
        end_time: '13:00',
        course: { name: 'Break Time' },
        lecturer: { name: '' },
      };
      dayEntries.push(breakTimeEntry);

      // Sort the day's entries by start time
      dayEntries.sort(function(a, b) {
        return a.start_time.localeCompare(b.start_time);
      });

      // Append day entries to the updated timetable
      updatedTimetable = updatedTimetable.concat(dayEntries);
    });

    $.each(updatedTimetable, function(index, entry) {
      var courseName = entry.course ? entry.course.name : "N/A";
      var lecturerName = entry.lecturer ? entry.lecturer.name : "N/A";
      var semester = entry.semester ? entry.semester : "N/A";

      // Convert the time to 12-hour format
      var startTime12Hour = formatTimeTo12Hour(entry.start_time);
      var endTime12Hour = formatTimeTo12Hour(entry.end_time);

      var row = '<tr>' +
        '<td>' + entry.day + '</td>' +
        '<td>' + startTime12Hour + '</td>' +
        '<td>' + endTime12Hour + '</td>' +
        '<td>' + courseName + '</td>' +
        '<td>' + lecturerName + '</td>' +
        '<td>' + selectedSemester + '</td>' +
        '</tr>';
      timetableTable.append(row);
    });
  } else {
    var row = '<tr><td colspan="6">No timetable data available for the selected level and semester.</td></tr>';
    timetableTable.append(row);
  }
}

// Function to convert time to 12-hour format
function formatTimeTo12Hour(time) {
  var timeParts = time.split(':');
  var hour = parseInt(timeParts[0], 10);
  var minute = timeParts[1];

  var period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  return hour + ':' + minute + ' ' + period;
}

