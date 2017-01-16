var fs = require('fs');
var moment = require('moment');

var helpers = {};
helpers.getData =  function(file, response){
    var stream = fs.createReadStream(file);
    stream.pipe(response);
};
helpers.writeData = function (file, data, request, response){
    if(data.length !== 0){
        helpers.addTimeStamp(data);
    }
    fs.writeFile(file, JSON.stringify(data), function(err){
        if(err){
            response.send(err);
        }
        helpers.getData(file, response);
    });
};
helpers.deleteblog = function(request, response){
    var data = fs.readFile('data/data.json', 'utf-8', function(err, data){
        if(err) console.log(err);
        var blogPostId = parseInt(request.body.blogPostId);
        data = JSON.parse(data);
        data.forEach(function(post, index){
            if(post.id === blogPostId){
                data.splice(index, 1);
                helpers.writeData('data/data.json', data, request, response);
            }
        });
    });
};
helpers.addTimeStamp =function (data){
    var mostRecentPost = data[0];
    var formattedDate = moment().format("MMM Do YYYY");
    mostRecentPost.date = formattedDate;
};

module.exports = helpers;
