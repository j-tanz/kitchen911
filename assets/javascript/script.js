$(document).ready(function(){
    var recipeObj = {};
    var numSearch = 0;
    var resultArr = [];

//This should trigger search on enter keypress but wont work?  Tried moving it all over too...WTF!!!
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
        numSearch = document.getElementById("dropListNumResults").value;

        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/' + queryURL,
            method: "GET",
            data:{
                key: "ffeb038edfff951ae133911feb4ba4ae",
                q: recipeSearch
            }
        }).then(function (response) {
                for (var i = 0; i < numSearch; i++){
                    resultArr[i] = JSON.parse(response).recipes[i].recipe_id                                  
                }    
                lookUpId();        
            });
              
    function lookUpId() {
        for(var i = 0; i < resultArr.length; i++){
            $.ajax({
                url: 'https://cors-anywhere.herokuapp.com/' + getURL,
                method: 'GET',
                data:{
                    key: "ffeb038edfff951ae133911feb4ba4ae",
                    rId: resultArr[i]
                }
            }).done(function (result){
                recipeObj = {
                    imgURL: JSON.parse(result).recipe.image_url,
                    title: JSON.parse(result).recipe.title,
                    ingredients: JSON.parse(result).recipe.ingredients,
                    rID: JSON.parse(result).recipe.recipe_id
                }
                // console.log(recipeObj);
// Function to create a new <div/> & assignId = "div"rId#
            function addNewDiv() {
                var newDiv = $("<div>");
                newDiv.attr("id", "div" + recipeObj.rID);
                newDiv.attr("class", "well col-xs-12 col-md-6 result");
                newDiv.attr("style", "position: relative;");
                $("#resultAppend").append(newDiv);
                return newDiv;
            }
            var renderDiv = addNewDiv();
            var starSpan = $("<span>");
            var trashSpan = $("<span>");
            var recipeIMG = $("<img>");
            var ingredientList = $("<ul>");
            var recipeTitle = $("<h4>");
            var ingredientArr = [];
            var insideDiv = $("<div>");

// Append Ajax results to DOM
//insidediv 
            insideDiv.attr("style", "position: relative; margin: 25px;")
            renderDiv.append(insideDiv);
//Star      
            starSpan.attr("class", "glyphicon glyphicon-star-empty starSpan");
            insideDiv.append(starSpan);
//trash
            trashSpan.attr("class", "glyphicon glyphicon-trash trashSpan media-right");
            insideDiv.append(trashSpan);
//Image
            recipeIMG.attr("src", recipeObj.imgURL);
            recipeIMG.attr("style","height: 250px; width: 250px; margin-left: auto; margin-right: auto; display: block" );
            renderDiv.append(recipeIMG);
//Title
            recipeTitle.text(recipeObj.title);
            recipeTitle.attr("class", "recipeDesc");
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





