(function ($) {
    let commentForm = $('#commentForm'),
    commentBody = $('#commentBody')

    commentForm.submit(function (event) {
        event.preventDefault();
    
        let id = $('#idInput').val()
        let commentVal = $('#commentInput').val();

        if (commentVal) {
          var requestConfig = {
            method: 'POST',
            url: '/comment/'+id,
            contentType: 'application/json',
            data: JSON.stringify({
              comment: commentVal
            })
          };
  
          $.ajax(requestConfig).then(function (responseMessage) {
            var newElement = $(responseMessage);
            console.log(newElement);
            // newContent.html(responseMessage.message);
            commentBody.replaceWith(newElement)
          });   
        } 
      })

})(window.jQuery);