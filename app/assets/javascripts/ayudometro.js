window.ayudometro = window.ayudometro || {};

(function($, context){
    
    var vars = {
        template : false
    };
    
    var showLoading = function(){
        $(".loading").show();
    }
    
    var hideLoading = function(){
        $(".loading").hide();
    }
    
    var updateQuestions = function(){
        
        var getHTML = function(questionValue, answers, next, previous, secuencia){
            
            var values =
                        {
                            question: questionValue, 
                            next: next,
                            previous: previous,
                            answer1: answers[0].header,
                            value1: answers[0].value,
                            answer2: answers[1].header,
                            value2: answers[1].value,
                            answer3: answers[2].header,
                            value3: answers[2].value,
                            id:secuencia
                        };
            
            return vars.template(values);
        }
        
               
        var getQuestions = function(callback){
            
            
            var questions = [];
            
            var types = ["personalTastes", "availability","economicCapacity", "lifeStyle"];
            
            for(type in types){
                
                var Question = Parse.Object.extend("Question");
                var query = new Parse.Query(Question);
                query.equalTo("type", types[type]);
             
                
                query.find({
                    success: function(results) {
                        var random = Math.floor(Math.random()*results.length);
                        
                        questions.push(results[random]);
                        
                        if(questions.length === 4 ){
                            callback(questions);
                        }
                        
                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            }
        }
        
        
        var formatQuestions = function(questions){
            
            var getAnswers = function(){
                
            };
            
            for(var i=0; i<questions.length; i++){
                
                var question = questions[i];
                
                var previous = i === 0 ? "#instrucciones" : "#preguntas-"+(i);
                var next = i < questions.length-1 ? "#preguntas-"+ (i+2) : "results";
                
                var answers = question.get("answers");
                
                var html = getHTML(question.get("header"), answers, next, previous, i);
                
                $("#preguntas-"+(i+1)).html(html);
            }
            
            
            $(".preguntas ul li label input[type=radio]").click(function(){
                
                var thisCheck = $(this);
                if (thisCheck.is(':checked'))
                {
                    var next = thisCheck.data("next");
                    window.location.hash = next;
                }
            });
        };
              
        getQuestions(formatQuestions);

        
    };
    
    var searchResults = function(category){
        
        
        var getInstitutions = function(category){
            var source   = $("#institution-template").html();
            var template = Handlebars.compile(source);    
            
            var Institution = Parse.Object.extend("Institutions");
            var query2 = new Parse.Query(Institution);
            
            
            query2.equalTo("category", category);
            
            
            query2.find({
                
                success : function(results){
                    
                    console.log(results);
                    
                    $.each(results,function(){ 
                        
                        
                        var html = template(this.toJSON());
                        $(".institutionScroll").append(html);
                        
                    });
                },
                
                error : function (error) {
                    
                }
                
            });
            
        }
        
        
        var getResults = function(){
            
            var Resultado = Parse.Object.extend("Result");
            var query = new Parse.Query(Resultado);
            
            var suma = 0;
            $.each($("input[type=radio]:checked"),function(){ suma +=  parseInt(this.value); });
            
            query.equalTo("key", suma);
            
            showLoading();
            query.find({
                success: function(result) {
                    
                    $("#help-result").html(result[0].get("header") + "<br/> <span>(" + result[0].get("type") + ")</span>");
                    $("#help-result").fadeIn();
                    
                    getInstitutions(result[0].get("category"));
                    
                    hideLoading();
                },
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                    hideLoading();
                }
            });
            
            
            
            
        
            
            
            
            
              
        };
        
        $(window).bind('hashchange', function(){
            if(window.location.hash === "#results"){
                getResults();
            }
        });

        
    };
    
    
    
    var init = function(){
        
        if($("#institution-template").length > 0){
        
            Parse.initialize("xBTW5KHjVcNL4gFJYiunyIhktGlyw3MRLtAoyQ4j", "6STSTB9qSom3OSk15eBoUThmYwXyktKmNXlde7Do");
            
            var source   = $("#question-template").html();
            vars.template = Handlebars.compile(source);
            
            updateQuestions();
            searchResults();
        
        }
    }
    
    $(init);
    
    
})(jQuery, window.ayudometro);