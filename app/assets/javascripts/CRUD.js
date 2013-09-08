window.crud = window.crud || {};


(function($, context){
    
    context.insertQuestions = function(questionHeader, type, answers){
        Parse.initialize("xBTW5KHjVcNL4gFJYiunyIhktGlyw3MRLtAoyQ4j", "6STSTB9qSom3OSk15eBoUThmYwXyktKmNXlde7Do");
        
        var Question = Parse.Object.extend("Question");
        var question = new Question();
        
        question.set("header", questionHeader);
        question.set("type", type);
        
        for(var stir in answers){
            stir = answers[stir];
            var value = {header : stir.header, value:stir.value};
            question.add("answers", value);    
        };
        
        question.save();        
    }
    
    context.insertResult = function(header, value){
        Parse.initialize("xBTW5KHjVcNL4gFJYiunyIhktGlyw3MRLtAoyQ4j", "6STSTB9qSom3OSk15eBoUThmYwXyktKmNXlde7Do");
        
        var Result = Parse.Object.extend("Result");
        var result = new Result();
        
        result.set("header", header);
        result.set("key", value);
        
        result.save();        
    }
    
})(jQuery, window.crud);