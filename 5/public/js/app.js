$(document).ready(function() {
    const token = localStorage.getItem('token');
  
    function fetchStudents() {
      $.ajax({
        url: '/students',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        success: function(data) {
          $('#studentList').empty();
          data.forEach(student => {
            $('#studentList').append(`<li>${student.name} - ${student.age} - ${student.department} <button class="edit" data-id="${student._id}">Edit</button> <button class="delete" data-id="${student._id}">Delete</button></li>`);
          });
        },
        error: function() {
          alert('Error fetching students');
        }
      });
    }
  
    $('#registerForm').on('submit', function(event) {
      event.preventDefault();
      $.ajax({
        url: '/auth/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          username: $('#username').val(),
          password: $('#password').val()
        }),
        success: function() {
          alert('Registration successful');
          window.location.href = 'login.html';
        },
        error: function() {
          alert('Error registering');
        }
      });
    });
  
    $('#loginForm').on('submit', function(event) {
      event.preventDefault();
      $.ajax({
        url: '/auth/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          username: $('#username').val(),
          password: $('#password').val()
        }),
        success: function(data) {
          localStorage.setItem('token', data.token);
          window.location.href = 'students.html';
        },
        error: function() {
          alert('Invalid credentials');
        }
      });
    });
  
    $('#studentForm').on('submit', function(event) {
      event.preventDefault();
      const id = $('#studentId').val();
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/students/${id}` : '/students';
      $.ajax({
        url: url,
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        contentType: 'application/json',
        data: JSON.stringify({
          name: $('#name').val(),
          age: $('#age').val(),
          department: $('#department').val()
        }),
        success: function() {
          $('#studentId').val('');
          fetchStudents();
        },
        error: function() {
          alert('Error saving student');
        }
      });
    });
  
    $(document).on('click', '.edit', function() {
      const id = $(this).data('id');
      $.ajax({
        url: `/students/${id}`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        success: function(student) {
          $('#studentId').val(student._id);
          $('#name').val(student.name);
          $('#age').val(student.age);
          $('#department').val(student.department);
        },
        error: function() {
          alert('Error fetching student details');
        }
      });
    });
  
    $(document).on('click', '.delete', function() {
      const id = $(this).data('id');
      $.ajax({
        url: `/students/${id}`,
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        success: function() {
          fetchStudents();
        },
        error: function() {
          alert('Error deleting student');
        }
      });
    });
  
    $('#logout').on('click', function() {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  
    if (window.location.pathname === '/students.html' && token) {
      fetchStudents();
    }
  });
  