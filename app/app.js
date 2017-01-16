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

    $(document).on('keypress', function(e){
        e = e || window.event;
        if(e.keyCode == 19){
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
        }
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
        data.forEach(function(item, index){
            var result;
            if(isDeletePage){
                result = $("<div class='blogPost' data='"+item.id+"'><div class='blog-post-header'><div class='delete fa fa-times-circle'></div><h1 class='blog-post-title'>"+item.title+"</h1><span class='date'>"+item.date+"</span></div><div class='blog-post-body'><pre class='blog-post-content'>"+item.content+"</pre></div></div>");
            } else {
                result = $("<div class='blogPost' data='"+item.id+"'><div class='blog-post-header'><h1 class='blog-post-title'>"+item.title+"</h1><span class='date'>"+item.date+"</span></div><div class='blog-post-body'><pre class='blog-post-content'>"+item.content+"</pre></div></div>");
            }
            comments.append(result);
        });
    }

    // CLOCK
    // This is my vanilla JS clock. I could have used moment.js, but this was more fun to figure out.
    var clock = document.getElementById('clock');

    clock.innerHTML = getCurrentTime();

    setInterval(function(){
        clock.innerHTML = getCurrentTime();
    }, 1000);

    function getCurrentTime() {
        var currentDate = new Date();
        var hours = currentDate.getHours() > 12 ? currentDate.getHours() - 12 : currentDate.getHours();
        hours === 0 ? 12 : hours;
        var minutes = currentDate.getMinutes();
        minutes = minutes+'';
        minutes = minutes.length < 2 ? '0' + minutes : minutes;
        var seconds = currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds();
        var timeconvention = currentDate.getHours() < 12 ? 'AM' : 'PM';
        var currentTime = hours + ':' + minutes + ':' + seconds  + ' ' + timeconvention;
        return currentTime;
    }

    var liveType = document.getElementById('liveType');
    var text = 'oftware Engineer'.split('');
    var doLiveType = setInterval(function(){
        if(text.length){
            $('#liveType')[0].innerHTML += text[0];
            text.shift();
        } else {
            clearInterval(doLiveType);
        }
    }, 100);

});
