const APIKey =   "ffeb038edfff951ae133911feb4ba4ae"   /*   "83e9f3d3227309240bf5d8a553b893c9"   */

$(document).ready(function(){
    var storedRecipes = JSON.parse(localStorage.getItem("storeArr")) || [];
    var searchedArr = JSON.parse(localStorage.getItem("historyArr")) || [];
    var getURL = "http://food2fork.com/api/get";
    var recipeObj = [];
    var ID;

    $("#resultAppend:empty").parent().hide();
    $("#historyAppend:empty").parent().hide();

    if (storedRecipes !== []){
        for ( var i = 0 ; i < storedRecipes.length; i++ ) {
            var ID = storedRecipes[i]
            $.ajax({
                url: 'https://cors-anywhere.herokuapp.com/' + getURL,
                method: 'GET',
                data:{
                    key: APIKey,
                    rId: ID
                },

            }).done(function (result){
                $("#resultAppend").parent().show();
                recipeObj =  {
                    imgURL: JSON.parse(result).recipe.image_url,
                    title: JSON.parse(result).recipe.title,
                    ingredients: JSON.parse(result).recipe.ingredients,
                    rID: JSON.parse(result).recipe.recipe_id,
                    source: JSON.parse(result).recipe.source_url
                }

                var anchor = $("<a>");
                var commentDiv = $("<div class='form-group'>");
                var commentKey = "save" + recipeObj.rID;
                var formLabel = $("<label for='comment'></label>");
                var formText = $("<textarea></textarea>");
                var ingredientBtn = $("<button>");
                var ingredientArr = [];
                var ingredientList = $("<ul>");
                var newButton = $("<button>");
                var newDiv = $("<div>");
                var recipeIMG = $("<img>");
                var renderDiv = addNewDiv();
                var trashBtn = $("<button>");
                var uList = $("<ul>");

/**
 *   Creates a new div for displaying a search result.
 *   @return {object} - div container for recipeObj.
 */                  

                function addNewDiv() {
                    newDiv.attr({
                        id: recipeObj.rID,
                        class: "well col-xs-12 saved",
                        style: "position: relative;"
                    });
                    $("#resultAppend").append(newDiv);
                    return newDiv;
                }

                for ( var a = 0; a < recipeObj.ingredients.length; a++){
                    var listItem = $("<li></li>");
                    var singleIngredient = recipeObj.ingredients[a];
                    listItem.text(singleIngredient); 
                    uList.append(listItem);
                }
/**
 *   Displays picture of recipe and adds a link to Recipe URL. 
 */  
                function constructImg() {
                    anchor.attr({
                        href: recipeObj.source, 
                        target: "_blank"
                    });
                    renderDiv.append(anchor);
                    recipeIMG.attr({
                        id: "IMG" + recipeObj.rID,
                        src: recipeObj.imgURL,
                        class: "mouseOn linkUrl savedImg",
                        style: "height: 200px; width: 200px;",
                        alt: "Image " + recipeObj.rID
                    });
                    anchor.append(recipeIMG);
                };
                constructImg();
/**
 *  Provides a comment box for users to write text.
 */  
                function constructCommentBox() {
                    commentDiv.attr("style", "display: inline-block;")
                    formLabel.attr({
                        class: "formLabel",
                        style: "font-size: 24px;"
                    });
                    formLabel.text('Comments for "' + recipeObj.title +'"');
                    formText.attr({
                        id: "Comment" + recipeObj.rID,
                        class: "form-control commentSave", 
                        placeholder: "My Comments:", 
                        rows: '6'
                    });
                    renderDiv.append(commentDiv);
                    commentDiv.append(formLabel);
                    commentDiv.append(formText);
                };
                constructCommentBox();
/**
 *  Creates a button that lists recipe ingredients, and appends to page.
 */  
                function constructIngredientPopUp() {
                    ingredientBtn.text("Ingredients");
                    ingredientBtn.attr({
                        class: "btn btn-default ingredientBtnBox",
                        title: "Ingredients",
                        style: "display: inline-block; width: 129.5px",
                        'data-toggle': "popover",
                        'data-content': uList.html()
                    });
                    commentDiv.append(ingredientBtn);
                    $('[data-toggle="popover"]').popover({ 
                        html : true, 
                        content : uList, 
                        container : "body"
                    });
                };
                constructIngredientPopUp();
/**
 *  Creates a button to save comments and appends to page.
 */                  
                function constructSaveBtn(){
                    newButton.text("Save Comments");
                    newButton.attr({
                        id: "save" + recipeObj.rID,
                        class: "btn btn-default saveBtn",
                        style: "float: right;"
                    });
                    commentDiv.append(newButton);    
                };
                constructSaveBtn();
/**
 *  Creates a button to remove an individual saved recipe, and appends to page.
 */  
                function constructTrashBtn(){
                    trashBtn.attr({
                        class: "btn btn-default trashButtonBox glyphicon glyphicon-trash",
                        id: "trash" + recipeObj.rID
                    })
                    renderDiv.append(trashBtn);
                }
                constructTrashBtn();

                if (localStorage.getItem(commentKey) != null){
                    $("#" + "Comment" + recipeObj.rID).val(localStorage.getItem(commentKey));
                }
            })
        }
    } 
/**
 *   Creates a button to clear search results, and appends to page.
 */  
    if (searchedArr.length !== 0){
        function constructClearSearchBtn(){
            var newButton = $("<button>");
            newButton.text("Clear History");
            newButton.attr({
                id: "clearButton",
                class: "btn btn-default",
                style: "margin: 0 auto 10px auto; display: block;"
            });
            $("#historyBox").append(newButton);
        };
        constructClearSearchBtn();
/**
 *   Makes an ajax call to food2fork API which queries items saved in local storage history array.
 */  
        function generateHistoryItems(){
            for ( var i = 0 ; i < searchedArr.length; i++ ) {
                var ID = searchedArr[i];
                console.log("RID[i]",searchedArr[i]);
                $.ajax({
                    url: 'https://cors-anywhere.herokuapp.com/' + getURL,
                    method: 'GET',
                    data:{
                        key: APIKey,
                        rId: ID
                    },
                }).done(function (result){
                    $("#historyAppend").parent().show();
                    recipeObj =  {
                        imgURL: JSON.parse(result).recipe.image_url,
                        title: JSON.parse(result).recipe.title,
                        ingredients: JSON.parse(result).recipe.ingredients,
                        rID: JSON.parse(result).recipe.recipe_id,
                        source: JSON.parse(result).recipe.source_url
                    }

                    var anchor = $("<a>");
                    var historyRender = addHistoryDiv();
                    var recipeIMG = $("<img>");
/**
 *   Creates a div for displaying past search result history.
 *   @return {object} div container for recipeObj
 */  
                    function addHistoryDiv() {
                        var newDiv = $("<div>");
                        newDiv.attr({
                            id: recipeObj.rID,
                            class: "well col-xs-3 col-md-1 historyDiv",
                            style: "position: relative; height: 90px; width: 90px;"
                        });
                    $("#historyAppend").append(newDiv);
                    return newDiv;
                    }
/**
 *   Creates images for each recipe searched and appends to page.
 */  
                    function constructHistoryItem() {
                        anchor.attr({
                            href: recipeObj.source,
                            target: "_blank"
                        });
                        recipeIMG.attr({
                            id: "IMG" + recipeObj.rID,
                            src: recipeObj.imgURL,
                            class: "historyItem",
                            style: "height: 50px; width: 50px; display: block; float: left; margin-left: auto; margin-right: auto;",
                            alt: "Image " + recipeObj.rID
                        });
                        historyRender.append(anchor);
                        anchor.append(recipeIMG);
                    };
                    constructHistoryItem();
                })
            }
        };
        generateHistoryItems();
    }

/**
 *   Removes stored recipe from page and associated local storage data .
 */
    $(document).on("click", ".trashButtonBox", function(){
        var removeThis = $(this).parents().eq(0).attr("id");
        var removeIndex = storedRecipes.indexOf(removeThis);
        var saveId = $(this).siblings().children(".saveBtn").attr("id");

        storedRecipes.splice(removeIndex,1);
        localStorage.setItem("storeArr", JSON.stringify(storedRecipes));
        $(this).parents().eq(0).remove();
        localStorage.removeItem(saveId, null);
        $("#resultAppend:empty").parent().hide();
    })
/**
 *   Removes all search history from page and local storage.
 */  
    $(document).on("click", "#clearButton", function(){
        localStorage.removeItem("historyArr");
        $("#historyAppend").remove();
        $("#clearButton").parent().remove();
        $("#historyAppend:empty").parent().hide();
    })

/**
 *   Saves comments in text area to local storage.
 */  
    $(document).on("click", ".saveBtn", function(){
        var saveComment = $(this).siblings(".commentSave").val();
        var saveId = $(this).attr("id");
        localStorage.setItem(saveId, saveComment);
    })
})

