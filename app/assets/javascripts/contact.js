$(function(){
    
    var getData = function(){
        var name = $("input[name='nombre_completo']")[0].value;
        var email = $("input[name='email']")[0].value;
        var provincia = $("#provincias")[0].value;
        var asunto = $("#asunto")[0].value;
        var description = $("#textfield")[0].value;
        
        return{
            name : name,
            email : email,
            provincia : provincia,
            asunto : asunto,
            detalle : description   
        }
    };
    
    var submitForm = function(){
        
        Parse.initialize("xBTW5KHjVcNL4gFJYiunyIhktGlyw3MRLtAoyQ4j", "6STSTB9qSom3OSk15eBoUThmYwXyktKmNXlde7Do");        
        
        var data = getData();
        
        var Contact = Parse.Object.extend("contact");
        var contact = new Contact();
        
        contact.save(data, {
            success: function(contact) {
                alert(" Gracias tu información ha sido recibida :) ")
            },
            error: function(contact, error) {
                alert(" Oh oh, algo no ha ido bien, mejor trata de ingresando tu información de nuevo :) ")
            }
        });

        
    };
    
    
    $("#button").click(submitForm);
})