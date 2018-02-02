$(document).ready(function(){
    var foodObj = {};
    var recipeObj = {};

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
                  rID: JSON.parse(response).recipes[0].recipe_id                 
              } 
            //   console.log(foodObj[recipeSearch].rID);
              lookUpId();       
        });

    function lookUpId() {
        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/' + getURL,
            method: 'GET',
            data:{
                key: "ffeb038edfff951ae133911feb4ba4ae",
                rId: foodObj[recipeSearch].rID
            }
          }).done(function(result){
              recipeObj[0] = {
                  imgURL: JSON.parse(result).recipe.image_url,
                  title: JSON.parse(result).recipe.title,
                  ingredients: JSON.parse(result).recipe.ingredients,
                //   rId: JSON.parse(result).recipe.rId
              }
// console.log(recipeObj["0"]);
            function addNewDiv() {
                var newDiv = $("<div>");
                newDiv.attr("id", "div" + foodObj[recipeSearch].rID);
                var divElement = document.getElementById(newDiv.id);
                console.log("newDiv", newDiv);
                $("#resultsBox").append(newDiv);
                
                
                // var newDiv = document.createElement("div");

                // $("#resultsBox").append("<div>").attr('id= div' + recipeObj["0"].title);
                // $("#resultsBox").append("<div>");
                // $(this).attr('id', "div_" + recipeObj[0].title);
                return newDiv;
            }
            // console.log(newDiv);
            var renderDiv = addNewDiv();
        

            var recipeIMG = $("<img>");
            var ingredientList = $("<ul>");
            var recipeTitle = $("<h4>");
            var ingredientArr = [];

            // newDiv.attr()

            recipeIMG.attr("src", recipeObj["0"].imgURL);
            recipeIMG.attr("style","height: 250px; width: 250px" )
            
            console.log("newDiv2", renderDiv);

            renderDiv.append(recipeIMG);

            recipeTitle.text(recipeObj["0"].title);
            renderDiv.append(recipeTitle);






            // $.each(recipeObj[0].ingredients, function() {
            //     for ( var i = 0; i < recipeObj[0].ingredients.length; i++ ) {
            //     $('ul').append("<li><h6 class='ingredientsList'"> + recipeObj[0].ingredients[i] + "</h6></li>");
            //     $("resultsBox").append(ingredientList);

            //     }
            // })
            // console.log(recipeObj.imgURL);

            // console.log(recipeObj);

            //   console.log(recipeObj[JSON.parse(response).recipes[0].recipe_id]); 
          });
        }
    });
});
   





