var $createTwoteForm = $('#create-twote-form');
var $twoteList = $('#twote-list');
var $userList = $('#user-list');
var userInfo = {};

function renderTwote(text, user, id) {
  $twoteList
    .prepend($('<div>', {id: id, class: ('twote ' + user)})
      .append($('<div>', {class: 'twote-content'})
        .append($('<div>', {class: 'twote-text', text: text}))
        .append($('<div>', {class: 'twote-user', text: user}))
      )
    );
  if (user === userInfo.username) {
    $twoteList.find('#' + id)
      .append($('<div>', {class: 'twote-actions'})
        .append($('<button>', {class: 'right', onclick: 'deleteTwote("' + id + '")', text: 'X'}))
      );
  }
};

function renderUser(user) {
  $userList
    .append($('<div>', {class: 'user'})
      .append($('<span>', {text: user}))
      .append($('<button>', {class: 'right', onclick: 'highlightTwotes("' + user + '")', text: '>'}))
    );
};

function highlightTwotes(user) {
  $twoteList.find('.highlight').removeClass('highlight');
  $twoteList.find('.' + user).addClass('highlight');
}

function deleteTwote(id) {
  $.ajax({
    type: 'POST',
    url: '/api/deleteTwote',
    data: JSON.stringify({
      id: id
    }),
    contentType: 'application/json',
    success: function(data, status) {
      $twoteList.find('#' + data.id).remove();
    }
  });
}

$(document).ready(function() {
  if (window.history && window.history.replaceState)
    window.history.replaceState("", document.title, window.location.pathname);
  $('#logout-container').empty()
    .append($('<form>', {action: 'logout', method: 'get'})
      .append($('<button>', {type: 'submit', text: 'Logout'}))
    );
  $.ajax({
    type: 'GET',
    url: '/api/getUserInfo',
    contentType: 'application/json'
  }).done(function(user, status) {
    userInfo = user
    $.ajax({
      type: 'GET',
      url: '/api/getTwotes',
      contentType: 'application/json'
    }).done(function(twotes, status) {
      if (twotes.length > 0) {
        $twoteList.find('.placeholder').remove();
        for (var i = 0; i < twotes.length; i++) {
          renderTwote(twotes[i].text, twotes[i].user, twotes[i]._id);
        }
      } else {
        $twoteList.find('.placeholder').text('No twotes to find!');
      }
    });
    $.ajax({
      type: 'GET',
      url: '/api/getUsers',
      contentType: 'application/json'
    }).done(function(users, status) {
      if (users.length > 0) {
        $userList.find('.placeholder').remove();
        for (var i = 0; i < users.length; i++) {
          renderUser(users[i].username);
        }
      }
    });
  });
});

$createTwoteForm.submit(function(event) {
  event.preventDefault();
  var text = $createTwoteForm.find("[name='text']").val();
  $.ajax({
    type: 'POST',
    url: '/api/createTwote',
    data: JSON.stringify({
      text: text
    }),
    contentType: 'application/json',
    success: function(data, status) {
      $twoteList.find('.placeholder').remove();
      renderTwote(data.text, data.user, data.id);
      $createTwoteForm.trigger('reset');
    }
  });
});