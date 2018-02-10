$(document).ready(function(){
    var storedRecipes = JSON.parse(localStorage.getItem("storeArr")) || [];
    var searchedArr = JSON.parse(localStorage.getItem("historyArr")) || [];
    var getURL = "http://food2fork.com/api/get";
    var recipeObj = [];
    var ID;
    var APIkey = /*"ffeb038edfff951ae133911feb4ba4ae"*/ "83e9f3d3227309240bf5d8a553b893c9"

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
            
                function addNewDiv() {
                    var newDiv = $("<div>");
                    newDiv.attr("id", recipeObj.rID);
                    newDiv.attr("class", "well col-xs-12 saved");
                    newDiv.attr("style", "position: relative;");
                    $("#resultAppend").append(newDiv);
                    return newDiv;
                }

                var renderDiv = addNewDiv();
                var recipeIMG = $("<img>");
                var ingredientList = $("<ul>");
                // var recipeTitle = $("<h4>");
                var ingredientArr = [];
                var anchor = $("<a>");
                var trashSpan = $("<span>");
                var commentDiv = $("<div class='form-group'>");
                var formLabel = $("<label for='comment'></label>");
                var formText = $("<textarea class='form-control commentSave' placeholder='My Comments:' rows='6'></textarea>");
                var newButton = $("<button>");
                var ingBtn = $("<button>");
                var uList = $("<ul>");

                for ( var a = 0; a < recipeObj.ingredients.length; a++){
                    var listItem = $("<li></li>");
                    var singleIngredient = recipeObj.ingredients[a];
                    listItem.text(singleIngredient); 
                    uList.append(listItem);
                    }
                    
                anchor.attr("href", recipeObj.source);
                anchor.attr("target", "_blank");
                renderDiv.append(anchor);
                recipeIMG.attr("id", "IMG" + recipeObj.rID);
                recipeIMG.attr("src", recipeObj.imgURL);
                recipeIMG.attr("class", "mouseOn linkUrl");
                recipeIMG.attr("style","height: 200px; width: 200px; margin-left: auto; margin-right: auto; display: block; float: left; padding-right: 10px;" );
                anchor.append(recipeIMG);
            
                // recipeTitle.text(recipeObj.title);
                // recipeTitle.attr("style", "font-size: 16px; text-align: right");
                // recipeTitle.attr("class", "savedRecipeTitle");
                // renderDiv.append(recipeTitle);
    //SAVED COMMENTS          
                commentDiv.attr("style", "display: inline-block;")
                formLabel.attr("class", "formLabel")
                formLabel.attr("style", "font-size: 24px;")
                formLabel.text('Comments for "' + recipeObj.title +'"');
                renderDiv.append(commentDiv);
                commentDiv.append(formLabel);
                formText.attr("id", "Comment" + recipeObj.rID)
                commentDiv.append(formText);

                ingBtn.attr("class", "btn btn-default ingredientBtn" )
                ingBtn.text("Ingredients");
                ingBtn.attr("data-toggle","popover");
                ingBtn.attr("title","Ingredients");
                ingBtn.attr("data-content", uList.html());
                ingBtn.attr("style", "display: inline-block;");
                commentDiv.append(ingBtn);
                $('[data-toggle="popover"]').popover({ html : true, content : uList, container : "body"});ingBtn



                newButton.attr("id", "save" + recipeObj.rID);
                newButton.text("Save Comment");
                newButton.attr("class", "btn btn-default saveBtn")
                newButton.attr("style", "float: right;")
                commentDiv.append(newButton);

                trashSpan.attr("class", "glyphicon glyphicon-trash trashSpan2");
                trashSpan.attr("style", "font-size: 42px; display: inline-block;");
                trashSpan.attr("id", "trash" + recipeObj.rID);
                renderDiv.append(trashSpan);  

                var commentKey = "save" + recipeObj.rID
                if (localStorage.getItem(commentKey) != null){
                    $("#" + "Comment" + recipeObj.rID).val(localStorage.getItem(commentKey));
                }
            })
        }
    } 
    if (searchedArr !== []){
        var newButton = $("<button>");
        newButton.attr("id", "clearButton");
        newButton.text("Clear History");
        newButton.attr("class", "btn btn-default")
        newButton.attr("style", "margin-left: auto; margin-right: auto; display: block;");
        $("#historyAppend").append(newButton);

        for ( var i = 0 ; i < searchedArr.length; i++ ) {
            var ID = searchedArr[i];
            console.log("RID[i]",searchedArr[i]);
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
  
            function addHistoryDiv() {
                var newDiv = $("<div>");
                newDiv.attr("id", recipeObj.rID);
                newDiv.attr("class", "well col-xs-3 col-md-1 historyDiv");
                newDiv.attr("style", "position: relative; height: 90px; width: 90px;");
                $("#historyAppend").append(newDiv);
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
            })
        }
    }
    
    $(document).on("click", ".trashSpan2", function(){
        var removeThis = $(this).parents().eq(0).attr("id");
        var removeIndex = storedRecipes.indexOf(removeThis);
        var saveId = $(this).siblings().children(".saveBtn").attr("id");

        storedRecipes.splice(removeIndex,1);
        localStorage.setItem("storeArr", JSON.stringify(storedRecipes));
        $(this).parents().eq(0).remove();
        localStorage.removeItem(saveId, null);
        console.log(saveId);    
    })

    $(document).on("click", "#clearButton", function(){
        localStorage.removeItem("historyArr");
        $("#historyAppend").remove();
    })

    $(document).on("click", ".saveBtn", function(){
        var saveComment = $(this).siblings(".commentSave").val();
        var saveId = $(this).attr("id");
        localStorage.setItem(saveId, saveComment);
    })
})

