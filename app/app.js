'use-strict';
$(document).ready(function(){
    var data = [];

    function refreshContent(firstTime){
        $.get('/content', function(req, res){
            data = JSON.parse(req);
            displayContent(data, firstTime);
        });
    }
    refreshContent(true);

    $('#post-blog-button').on('click', function(e){
        e.preventDefault();
        var index = data.length;
        var blogPostFormTitle = $('.blog-post-form-title');
        var blogPostFormContent = $('.blog-post-form-content');
        var post = {
            id: index,
            title: blogPostFormTitle.val(),
            content: blogPostFormContent[0].innerText
        };
        data.unshift(post);
        postContent(data, false);
        blogPostFormTitle.val('');
        blogPostFormContent[0].innerText = '';
    });

    $('#delete').on('click', function(e){
        e.preventDefault();
        deleteContent();
    });


    $('.resume').hide();
    $('.resume-button').on('click', function(e){
        e.preventDefault();
        $('.blog-post-form-container').hide();
        $('.comments').hide();
        $('.intro').hide();
        $('.resume').hide().fadeIn(800);
    });
    $('.logo').on('click', function(e){
        e.preventDefault();
        $('.resume').hide();
        $('.intro').hide().fadeIn(800);
        $('.blog-post-form-container').hide().fadeIn(800);
        $('.comments').hide().fadeIn(800);
    });

    function postContent(blog_posts, isDeleting){
        if(isDeleting){
            $.ajax({
                type: 'POST',
                url: '/content',
                data: JSON.stringify(blog_posts),
                complete: function(req, res){
                    displayContent(data);
                    $('.warning-text').remove();
                },
                error: function(err){
                    console.log('err', err);
                },
                contentType: 'application/json',
                dataType: 'json'
            });
            return;
        }
        if(!isDeleting && $('.blog-post-form-title').val() !== '' && $('.blog-post-form-content').text() !== ''){
            $.ajax({
                type: 'POST',
                url: '/content',
                data: JSON.stringify(blog_posts),
                complete: function(req, res){
                    displayContent(data);
                    $('.warning-text').remove();
                },
                error: function(err){
                    console.log('err', err);
                },
                contentType: 'application/json',
                dataType: 'json'
            });
        }
        else {
            $('#blog-post-form > .section').prepend('<p class="warning-text" style="color: red;text-align:center;">* please fill out all sections</p>');
        }
    }

    function deleteContent(){
        data.shift();
        postContent(data, true);
    }

    function displayContent(data, firstTime){
        var comments = $('.comments');
        comments.children().remove();
        if(data.length){
            if(firstTime){
                data.forEach(function(item, index){
                    var result = $("<div class='blogPost'><div class='blog-post-header'><h1 class='blog-post-title'>"+item.title+"</h1><span class='date'>"+item.date+"</span></div><div class='blog-post-body'><pre class='blog-post-content'>"+item.content+"</pre></div></div>");
                    comments.append(result.hide().fadeIn(300 + index));
                });
            } else {
                data.forEach(function(item, index){
                    if(item.date === undefined){
                        item.date = 'Today';
                    }
                    if(index === 0){
                        var result = $("<div class='blogPost'><div class='blog-post-header'><h1 class='blog-post-title'>"+item.title+"</h1><span class='date'>"+item.date+"</span></div><div class='blog-post-body'><pre class='blog-post-content'>"+item.content+"</pre></div></div>");
                        comments.append(result.hide().fadeIn(600));
                        return;
                    }
                    comments.append("<div class='blogPost'><div class='blog-post-header'><h1 class='blog-post-title'>"+item.title+"</h1><span class='date'>"+item.date+"</span></div><div class='blog-post-body'><pre class='blog-post-content'>"+item.content+"</pre></div></div>");
                });
            }

        }
    }
});
