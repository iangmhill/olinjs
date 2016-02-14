$(document).ready(function() {
  var $twoteList = $('#twote-list');
  $.ajax({
    type: 'GET',
    url: '/api/getTwotes',
    contentType: 'application/json'
  }).done(function(twotes, status) {
    if (twotes.length > 0) {
      $twoteList.find('.placeholder').remove();
      for (var i = 0; i < twotes.length; i++) {
        $twoteList
          .append($('<div>', {class: 'twote'})
            .append($('<div>', {class: 'twote-text', text: twotes[i].text}))
            .append($('<div>', {class: 'twote-user', text: twotes[i].user}))
          );
      }
    }
  });
});