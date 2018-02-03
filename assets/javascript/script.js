$(document).ready(function(){
    var foodObj = {};
    var recipeObj = {};
    var idArr = [];

//This should trigger search on enter keypress but wont work?  Tried moving it all over too...
    var input = document.getElementById("searchTerm");
    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("searchBttn").click();
        }
    })

    $("#searchBttn").on("click", function(event){
        event.preventDefault();
        var recipeSearch = $("#searchTerm").val().trim();
        var queryURL = "http://food2fork.com/api/search";
        var getURL = "http://food2fork.com/api/get";

        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/' + queryURL,
            method: "GET",
            data:{
                key: "ffeb038edfff951ae133911feb4ba4ae",
                q: recipeSearch
            }
          }).then(function (response) {
              foodObj[recipeSearch] = {
                  rID0: JSON.parse(response).recipes[0].recipe_id,                 
                  rID1: JSON.parse(response).recipes[1].recipe_id,               
                  rID2: JSON.parse(response).recipes[2].recipe_id,                 
                  rID3: JSON.parse(response).recipes[3].recipe_id                 
              } 
              lookUpId();       
        });
    function lookUpId() {
        var idArr = [foodObj[recipeSearch].rID0, foodObj[recipeSearch].rID1, foodObj[recipeSearch].rID2, foodObj[recipeSearch].rID3];
        for(var i = 0; i < idArr.length; i++){
            $.ajax({
                url: 'https://cors-anywhere.herokuapp.com/' + getURL,
                method: 'GET',
                data:{
                    key: "ffeb038edfff951ae133911feb4ba4ae",
                    rId: idArr[i]
                }
            }).done(function(result){
                recipeObj[0] = {
                    imgURL: JSON.parse(result).recipe.image_url,
                    title: JSON.parse(result).recipe.title,
                    ingredients: JSON.parse(result).recipe.ingredients
                }
// Function to create a new <div/> & assignId = "div"rId 
            function addNewDiv() {
                var newDiv = $("<div>");
                newDiv.attr("id", "div" + foodObj[recipeSearch].rID);
                newDiv.attr("class", "well col-xs-12 col-md-6 result");
                var divElement = document.getElementById(newDiv.id);
                $("#resultAppend").append(newDiv);
                return newDiv;
            }
            var renderDiv = addNewDiv();
            var recipeIMG = $("<img>");
            var ingredientList = $("<ul>");
            var recipeTitle = $("<h4>");
            var ingredientArr = [];

// Append Ajax results to DOM
//Image
            recipeIMG.attr("src", recipeObj["0"].imgURL);
            recipeIMG.attr("style","height: 250px; width: 250px; margin-left: auto; margin-right: auto; display: block" )
            renderDiv.append(recipeIMG);
//Title
            recipeTitle.text(recipeObj["0"].title);
            recipeTitle.attr("class", "recipeDesc")
            renderDiv.append(recipeTitle);   
                });
            }    
        }
    });
});
   
// WE MAY STILL NEED THIS LATER:
            // $.each(recipeObj[0].ingredients, function() {
            //     for ( var i = 0; i < recipeObj[0].ingredients.length; i++ ) {
            //     $('ul').append("<li><h6 class='ingredientsList'"> + recipeObj[0].ingredients[i] + "</h6></li>");
            //     $("resultsBox").append(ingredientList);

            //     }
            // })





