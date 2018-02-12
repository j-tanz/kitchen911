const APIKey =   "ffeb038edfff951ae133911feb4ba4ae"   /*   "83e9f3d3227309240bf5d8a553b893c9"   */

$(document).ready(function(){
    var storedRecipes = JSON.parse(localStorage.getItem("storeArr")) || [];
    var searchedArr = JSON.parse(localStorage.getItem("historyArr")) || [];
    var getURL = "http://food2fork.com/api/get";
    var recipeObj = [];
    var ID;

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
                var formText = $("<textarea class='form-control commentSave' placeholder='My Comments:' rows='6'></textarea>");
                var ingredientBtn = $("<button>");
                var ingredientArr = [];
                var ingredientList = $("<ul>");
                var newButton = $("<button>");
                var newDiv = $("<div>");
                var recipeIMG = $("<img>");
                var renderDiv = addNewDiv();
                var trashBtn = $("<button>");
                var trashSpan = $("<span>");
                var uList = $("<ul>");

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
                        style: "height: 200px; width: 200px;"
                    });
                    anchor.append(recipeIMG);
                };
                constructImg();
             
                function constructCommentBox() {
                    commentDiv.attr("style", "display: inline-block;")
                    formLabel.attr({
                        class: "formLabel",
                        style: "font-size: 24px;"
                    });
                    formLabel.text('Comments for "' + recipeObj.title +'"');
                    formText.attr("id", "Comment" + recipeObj.rID);
                    renderDiv.append(commentDiv);
                    commentDiv.append(formLabel);
                    commentDiv.append(formText);
                };
                constructCommentBox();

                function constructIngredientPopUp() {
                    ingredientBtn.text("Ingredients");
                    ingredientBtn.attr({
                        class: "btn btn-default ingredientBtn",
                        title: "Ingredients",
                        style: "display: inline-block;",
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

                function constructTrashBtn(){
                    trashBtn.attr({
                        class: "btn btn-default trashButton glyphicon glyphicon-trash",
                        id: "trash" + recipeObj.rID,
                        style: "font-size: 42px; float: right; color: rgb(177, 42, 42);"
                    })
                    renderDiv.append(trashBtn);
                }
                constructTrashBtn();

//If a saved comment exists in LS, set textarea text to that stored comment
                if (localStorage.getItem(commentKey) != null){
                    $("#" + "Comment" + recipeObj.rID).val(localStorage.getItem(commentKey));
                }
            })
        }
    } 

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

//WTF NEWDIV ASK IN CLASS//

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

                    function constructHistoryItem() {
                        anchor.attr({
                            href: recipeObj.source,
                            target: "_blank"
                        });
                        recipeIMG.attr({
                            id: "IMG" + recipeObj.rID,
                            src: recipeObj.imgURL,
                            class: "historyItem",
                            style: "height: 50px; width: 50px; display: block; float: left; margin-left: auto; margin-right: auto;"
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
// WHAT????
    // console.log(searchedArr !== [], searchedArr);

    //Remove Saved recipeBox result
    $(document).on("click", ".trashButton", function(){
        var removeThis = $(this).parents().eq(0).attr("id");
        var removeIndex = storedRecipes.indexOf(removeThis);
        var saveId = $(this).siblings().children(".saveBtn").attr("id");

        storedRecipes.splice(removeIndex,1);
        localStorage.setItem("storeArr", JSON.stringify(storedRecipes));
        $(this).parents().eq(0).remove();
        localStorage.removeItem(saveId, null);
    })

    $(document).on("click", "#clearButton", function(){
        localStorage.removeItem("historyArr");
        $("#historyAppend").remove();
        $("#clearButton").parent().remove();
    })
//commit comment in textarea to LS
    $(document).on("click", ".saveBtn", function(){
        var saveComment = $(this).siblings(".commentSave").val();
        var saveId = $(this).attr("id");
        localStorage.setItem(saveId, saveComment);
    })
})

