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

    // listener for posting a new blog
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

    // $('#delete').on('click', function(e){
    //     e.preventDefault();
    //     deleteContent();
    // });


    // hide resume on load
    $('.resume').hide();
    // reveal resume
    $('.resume-button').on('click', function(e){
        e.preventDefault();
        $('.blog-post-form-container').hide();
        $('.comments').hide();
        $('.intro').hide();
        $('.resume').hide().fadeIn(800);
    });
    // reveal home
    $('.logo').on('click', function(e){
        e.preventDefault();
        $('.resume').hide();
        $('.intro').hide().fadeIn(800);
        $('.blog-post-form-container').hide().fadeIn(800);
        $('.comments').hide().fadeIn(800);
    });

    // Delete single blogPost
    $(document.body).on('click', '.delete', function(e){
        e.preventDefault()
        var blogPostId = $(this).closest('.blogPost')[0].attributes.data.value;
        data.splice(blogPostId, 1);
        $.ajax({
            type: 'POST',
            url: '/delete-single-blog-post',
            data: JSON.stringify({blogPostId: blogPostId}),
            complete: function(req, res){
                console.log(req.responseJSON);
                displayContent(req.responseJSON, false);
            },
            error: function(err){
                console.log('err', err);
            },
            contentType: 'application/json',
            dataType: 'json'
        });
    });

    // Post a new blog post
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

    // display blog posts
    function displayContent(data, firstTime){
        var comments = $('.comments');
        comments.children().remove();
        var isDeletePage = window.location.pathname === '/deleteblog';
        console.log(isDeletePage)
        data.forEach(function(item, index){
            var result;
            if(isDeletePage){
                result = $("<div class='blogPost' data='"+item.id+"'><div class='blog-post-header'><div class='delete fa fa-times-circle'></div><h1 class='blog-post-title'>"+item.title+"</h1><span class='date'>"+item.date+"</span></div><div class='blog-post-body'><pre class='blog-post-content'>"+item.content+"</pre></div></div>");
            } else {
                result = $("<div class='blogPost' data='"+item.id+"'><div class='blog-post-header'><h1 class='blog-post-title'>"+item.title+"</h1><span class='date'>"+item.date+"</span></div><div class='blog-post-body'><pre class='blog-post-content'>"+item.content+"</pre></div></div>");
            }
            // if(index === 0){
            //     comments.append(result.hide().fadeIn(600));
            //     return;
            // }
            comments.append(result);
        });
        // if(data.length){
        //     if(firstTime){
        //         data.forEach(function(item, index){
        //             var result = $("<div class='blogPost' data='"+item.id+"'><div class='blog-post-header'><div class='delete fa fa-times-circle'></div><h1 class='blog-post-title'>"+item.title+"</h1><span class='date'>"+item.date+"</span></div><div class='blog-post-body'><pre class='blog-post-content' >"+item.content+"</pre></div></div>");
        //             comments.append(result.hide().fadeIn(300 + index));
        //         });
            // } else {
                // data.forEach(function(item, index){
                //     if(item.date === undefined){
                //         item.date = 'Today';
                //     }
                //     var result = $("<div class='blogPost' data='"+item.id+"'><div class='blog-post-header'><div class='delete fa fa-times-circle'></div><h1 class='blog-post-title'>"+item.title+"</h1><span class='date'>"+item.date+"</span></div><div class='blog-post-body'><pre class='blog-post-content'>"+item.content+"</pre></div></div>");
                //     if(index === 0){
                //         comments.append(result.hide().fadeIn(600));
                //         return;
                //     }
                //     comments.append(result);
                // });
            // }

        // }
    }

});
