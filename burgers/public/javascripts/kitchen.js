$(document).ready(function() {
  $('.complete-order').click(function(event) {
    event.preventDefault();
    var $order = $(this);
    $.ajax({
      type: 'POST',
      url: '/api/updateOrder',
      contentType: 'application/json',
      data: JSON.stringify({
        id: $order.value,
        complete: true
      })
    }).done(function(data, status) {
      if (data.success == true) {
        console.log($order.parent('.order'));
        $order.parents('.order').remove();
      }
    });
  });
});