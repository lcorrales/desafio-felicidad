window.rankingTop = window.rankingTop || {};

(function($, context){
    
    var updateRanking = function(){
        
        var getPoints = function(callback){
            var Player = Parse.Object.extend("Player");
            var query = new Parse.Query(Player);
            
            query.descending("points");
            query.limit(15);
            
            query.find({
                success: function(results) {
                    callback(results);
                },
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        }
        
        var update = function(results){
            $("#first-place").html(results[0].get("name") + "<br/>" + results[0].get("points")+" pts");
            $("#second-place").html(results[1].get("name") + "<br/>" + results[1].get("points")+" pts");
            $("#third-place").html(results[2].get("name") + "<br/>" + results[2].get("points")+" pts");
            
            for(var i = 3; i < results.length; i++){
                $("#ranking-left").append("<div class='user'><p><span class='number'>"+ (i+1) +"</span><span class='name'>"+results[i].get("name") +"</span><span class='points'>"+results[i].get("points")+" pts</span></p></div>");
            }
        }
        
        getPoints(update);
    
        
    };
    
    
    var updatePoints = function(){
        
        var update = function(){
            
            var Log = Parse.Object.extend("log");
            
            function populateList(response){
                var results = response.results;
                var newHtml = "";
                var score = {};
                
                for(resultIndex in results){
                    
                    if(results.length <= 0){
                        break;
                    }
                    
                    var result = results[resultIndex];
                    
                    if( result && !score[result.from_user] ) score[result.from_user] = 0;
                    
                    score[result.from_user] += 50;
                    
                    if(result.entities && result.entities.user_mentions  && result.entities.user_mentions.length > 0){
                        for(var userIndex in result.entities.user_mentions){
                            var user = result.entities.user_mentions[userIndex].screen_name;
                            
                            if( !score[user] ) score[user] = 0;
                            
                            if(user != result.from_user){
                                score[user] += 100;        
                            }else{
                                score[user] -= 50;        
                            }
                        }
                    }else{
                        score[result.from_user] -= 50;
                    }
                }
        
                
                var Player = Parse.Object.extend("Player");
                
                var makecall = function(user){
                        console.log("searching" + user)
                        var query = new Parse.Query(Player);
                    
                        query.equalTo("name", "@"+user);
                        
                        query.first({
                        success: function(results) {
                            console.log(results);
                            
                            if(!results){
                                
                                console.log("creando nuevo");
                                
                                results = new Player();
                                results.set("name", "@"+user);
                                results.set("points", 0);
                            }
                            
                            
                            var points = results.get("points");
                            
                            console.log("puntos " + points);
                            console.log("puntos " + score[user]);
                            
                            results.set("points", points + score[user]);
                            results.save();
                            
                        },
                        error: function(error) {
                            console.log("Error: " + error.code + " " + error.message);
                        }
                        });    
                    };
                    
            
                for(var user in score){                    
                    makecall(user);
                }
                
                
                var logQuery2 = new Parse.Query(Log);
            
                logQuery2.first({
                            success: function(results) {
                                console.log("log ");
                                console.log(results);
                                
                                results.set("since_id", response.max_id_str);
                                results.save();
                                
                                updateRanking();
                                
                            },
                            error: function(error) {
                                console.log("Error: " + error.code + " " + error.message);
                            }
                });
            
        
                
        
            }
            
            
            
            
            var logQuery = new Parse.Query(Log);
            
            logQuery.first({
                        success: function(results) {
                            console.log("first ");
                            console.log(results);
                            
                            $.ajax({
                                url : "http://search.twitter.com/search.json",
                                dataType : "jsonp",
                                data : {
                                    q : "#hoymehizofeliz",
                                    result_type : "recent",
                                    rpp : 100,
                                    page : 1,
                                    include_entities: true,
                                    since_id : results.get("since_id")
                                }, success : function (response) {
                                    populateList(response);
                                }
                            });
                        },
                        error: function(error) {
                            console.log("Error: " + error.code + " " + error.message);
                        }
            });
            
        };
        
        var getLastUpdate = function(){
            
        }
        
        var updateIfNecessary = function(){
            update();
        }
        
        updateIfNecessary();
        
    };
    
    
    context.init = function(){
        
        
        Parse.initialize("xBTW5KHjVcNL4gFJYiunyIhktGlyw3MRLtAoyQ4j", "6STSTB9qSom3OSk15eBoUThmYwXyktKmNXlde7Do");        
        updatePoints();
        
    };
    
    
    $(context.init);
    
    
})(jQuery, window.rankingTop);

