/**
 * this function waits for the document to load before running.
 * storedRecipes parses the data into local storage into an array.
 * searchedArr also parses data into local storage into an array.
 * getURL is storing a URL as a variable.
 * recipeObj is the data being returned in array.
 * ID is the recipe key that we need for the website to make searches.
 * the API key is what we use to authenticate the ajax request.
 */$(document).ready(function(){
    var storedRecipes = JSON.parse(localStorage.getItem("storeArr")) || [];
    var searchedArr = JSON.parse(localStorage.getItem("historyArr")) || [];
    var getURL = "http://food2fork.com/api/get";
    var recipeObj = [];
    var ID;
    var APIkey = /*"ffeb038edfff951ae133911feb4ba4ae"*/ "83e9f3d3227309240bf5d8a553b893c9"

    
    // console.log("idArray", storedRecipes);

    /**
     * an ajax call being made to food 2 fork. 
     * returning with recipeObj the information that we display on our site.
     */

    if (storedRecipes !== []){
        for ( var i = 0 ; i < storedRecipes.length; i++ ) {
            var ID = storedRecipes[i]
            // console.log("1", storedRecipes[i]);
            $.ajax({
                url: 'https://cors-anywhere.herokuapp.com/' + getURL,
                method: 'GET',
                data:{
                    key: APIkey,
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
// console.log("where", result)
/**
 * creates a new div fpr you saved recipes to appear but also give uour the ability to remove that item.
 */
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
/**
 * addHistorDiv allows you to see the the search history from the recipes you have been looking up. 
 */
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
    /**
     * listens to the whole document and allows user to remove a stored recipe from the page. 
     */
    $(document).on("click", ".trashSpan", function(){
        var removeThis = $(this).parents().eq(0).attr("id");
        var removeIndex = storedRecipes.indexOf(removeThis);
        storedRecipes.splice(removeIndex,1);
        localStorage.setItem("storeArr", JSON.stringify(storedRecipes));
        $(this).parents().eq(0).remove();     
        // console.log("storedrecipes", storedRecipes); 
    })



})

