$(document).ready(function(){
    var storedRecipes = JSON.parse(localStorage.getItem("storeArr")) || [];
    var searchedArr = JSON.parse(localStorage.getItem("historyArr")) || [];
    var getURL = "http://food2fork.com/api/get";
    var recipeObj = [];
    var ID;
    var apiKey = "83e9f3d3227309240bf5d8a553b893c9"; //ffeb038edfff951ae133911feb4ba4ae
    
    // console.log("idArray", storedRecipes);

    if (storedRecipes !== []){
        for ( var i = 0 ; i < storedRecipes.length; i++ ) {
            var ID = storedRecipes[i]
            // console.log("1", storedRecipes[i]);
            $.ajax({
                url: 'https://cors-anywhere.herokuapp.com/' + getURL,
                method: 'GET',
                data:{
                    key: apiKey,
                    rId: ID
                },
            }).done(function (result){
                recipeObj =  {
                    imgURL: JSON.parse(result).recipe.image_url,
                    title: JSON.parse(result).recipe.title,
                    ingredients: JSON.parse(result).recipe.ingredients,
                    rID: JSON.parse(result).recipe.recipe_id,
                    source: JSON.parse(result).recipe.source_url
                }
// console.log("where", result);
            
            function addNewDiv() {
                var newDiv = $("<div>");
                newDiv.attr("id", recipeObj.rID);
                newDiv.attr("class", "well col-xs-12 result");
                newDiv.attr("style", "position: relative;");
                $("#resultAppend").append(newDiv);
                return newDiv;
            }
            var renderDiv = addNewDiv();
            var recipeIMG = $("<img>");
            var ingredientList = $("<ul>");
            var recipeTitle = $("<h4>");
            var ingredientArr = [];
            var anchor = $("<a>");
            var trashSpan = $("<span>");

            anchor.attr("href", recipeObj.source);
            anchor.attr("target", "_blank");
            renderDiv.append(anchor);
            recipeIMG.attr("id", "IMG" + recipeObj.rID);
            recipeIMG.attr("src", recipeObj.imgURL);
            recipeIMG.attr("class", "mouseOn linkUrl");
            recipeIMG.attr("style","height: 200px; width: 200px; margin-left: auto; margin-right: auto; display: block; float: left;" );
            anchor.append(recipeIMG);
        

            recipeTitle.text(recipeObj.title);
            recipeTitle.attr("style", "font-size: 16px");
            recipeTitle.attr("style", "text-align: right");
            recipeTitle.attr("class", "recipeDesc");
            renderDiv.append(recipeTitle);  

            trashSpan.attr("class", "glyphicon glyphicon-trash trashSpan");
            trashSpan.attr("style", "font-size: 16px");
            trashSpan.attr("id", "trash" + recipeObj.rID);
            renderDiv.append(trashSpan); 
            });
        }
    } 
    if (searchedArr !== []){
        for ( var i = 0 ; i < searchedArr.length; i++ ) {
            var ID = searchedArr[i];
            console.log("RID[i]",searchedArr[i]);
            $.ajax({
                url: 'https://cors-anywhere.herokuapp.com/' + getURL,
                method: 'GET',
                data:{
                    key: apiKey,
                    rId: ID
                },
            }).done(function (result){
                recipeObj =  {
                    imgURL: JSON.parse(result).recipe.image_url,
                    title: JSON.parse(result).recipe.title,
                    // ingredients: JSON.parse(result).recipe.ingredients,
                    rID: JSON.parse(result).recipe.recipe_id,
                    source: JSON.parse(result).recipe.source_url
                }
                // console.log("2", result);
          
            function addHistoryDiv() {
                var newDiv = $("<div>");
                newDiv.attr("id", recipeObj.rID);
                newDiv.attr("class", "well col-xs-3 col-md-1 historyDiv");
                newDiv.attr("style", "position: relative; height: 90px; width: 90px;");
                $("#historyBox").append(newDiv);
                return newDiv;
            }
            var historyRender = addHistoryDiv();
            var anchor = $("<a>");
            var recipeIMG = $("<img>");

            anchor.attr("href", recipeObj.source);
            anchor.attr("target", "_blank");
            historyRender.append(anchor);
            recipeIMG.attr("id", "IMG" + recipeObj.rID);
            recipeIMG.attr("src", recipeObj.imgURL);
            recipeIMG.attr("class", "historyItem");
            recipeIMG.attr("style","height: 50px; width: 50px; display: block; float: left; margin-left: auto; margin-right: auto;" );
            anchor.append(recipeIMG);
            // console.log(recipeObj);
        })


        }
    }
    
    $(document).on("click", ".trashSpan", function(){
        var removeThis = $(this).parents().eq(0).attr("id");
        var removeIndex = storedRecipes.indexOf(removeThis);
        storedRecipes.splice(removeIndex,1);
        localStorage.setItem("storeArr", JSON.stringify(storedRecipes));
        $(this).parents().eq(0).remove();     
        // console.log("storedrecipes", storedRecipes); 
    })



})

