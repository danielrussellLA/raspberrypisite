$(document).ready(function(){
    var data = null;


    function refreshContent(firstTime){
        $.get('/content', function(req, res){
            data = JSON.parse(req);
            displayContent(data, firstTime);
            console.log('req', data);
        });
    }
    refreshContent(true);

    $('#post-blog-button').on('click', function(e){
        e.preventDefault();
        var index = data.length;
        var post = {
            id: index,
            title: $('.blog-post-form-title').val(),
            content: $('.blog-post-form-content')[0].innerText
        };
        console.log($('.blog-post-form-content'));
        data.unshift(post);
        postContent(data);
        $('.blog-post-form-title').val('');
        $('.blog-post-form-content')[0].innerText = '';
    });

    $('#delete').on('click', function(e){
        e.preventDefault();
        deleteContent();
    });


    $('.resume').hide();
    var toggleResume = false;
    $('.resume-button').on('click', function(e){
        e.preventDefault();
        toggleResume = !toggleResume;
        if(toggleResume){
            $('.blog-post-form-container').hide();
            $('.comments').hide();
            $('.intro').hide();
            $('.resume').hide().fadeIn();
        }
        else {
            $('.resume').hide();
            $('.intro').hide().fadeIn();
            $('.blog-post-form-container').hide().fadeIn();
            $('.comments').hide().fadeIn();
        }
    });

    function postContent(blog_posts){
        $.ajax({
            type: 'POST',
            url: '/content',
            data: JSON.stringify(blog_posts),
            complete: function(req, res){
                displayContent(data);
            },
            error: function(err){
                console.log('err', err);
            },
            contentType: 'application/json',
            dataType: 'json'
        });
    }

    function deleteContent(){
        data.shift();
        postContent(data);
    }

    function displayContent(data, firstTime){
        $('.comments').children().remove();
        if(data.length){
            if(firstTime){
                data.forEach(function(item, index){
                    var result = $('<div class="blogPost">'+'<div class="blog-post-inner-container">'+'<h1 class="blog-post-title">'+item.title+'</h1>'+'<div class="date">'+item.date+'</div>'+'<pre class="blog-post-content">'+item.content+'</pre>'+'</div>'+'</div>');
                    $(".comments").append(result.hide().fadeIn(300 + index));
                });
            } else {
                data.forEach(function(item, index){
                    if(item.date === undefined){
                        item.date = '';
                    }
                    if(index === 0){
                        var result = $('<div class="blogPost">'+'<div class="blog-post-inner-container">'+'<h1 class="blog-post-title">'+item.title+'</h1>'+'<div class="date">'+item.date+'</div>'+'<pre class="blog-post-content">'+item.content+'</pre>'+'</div>'+'</div>');
                        $(".comments").append(result.hide().fadeIn(600));
                        return;
                    }
                    $('.comments').append('<div class="blogPost">'+'<div class="blog-post-inner-container">'+'<h1 class="blog-post-title">'+item.title+'</h1>'+'<div class="date">'+item.date+'</div>'+'<pre class="blog-post-content">'+item.content+'</pre>'+'</div>'+'</div>');
                });
            }

        }
    }
});
