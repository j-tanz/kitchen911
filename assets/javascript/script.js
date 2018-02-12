const APIKey =   "ffeb038edfff951ae133911feb4ba4ae"  /* "83e9f3d3227309240bf5d8a553b893c9" */

$(document).ready(function(){
    var recipeObj = {};
    var numSearch = 0;
    var resultArr = [];
    var searchedArr = [];
    var storedRecipes = JSON.parse(localStorage.getItem("storeArr")) || [];
 
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
                key: APIKey,
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
                        key: APIKey,
                        rId: resultArr[i]
                    }

                }).done(function (result){
                    recipeObj = {
                        imgURL: JSON.parse(result).recipe.image_url,
                        title: JSON.parse(result).recipe.title,
                        ingredients: JSON.parse(result).recipe.ingredients,
                        rID: JSON.parse(result).recipe.recipe_id,
                        source: JSON.parse(result).recipe.source_url
                    }

                    var anchor = $("<a>");
                    var buttonDiv = $("<div>");
                    var ingredientArr = [];
                    var insideDiv = $("<div>");
                    var newButton = $("<button>");
                    var popupDiv = $("<div>");
                    var recipeIMG = $("<img>");
                    var recipeTitle = $("<h4>");
                    var renderDiv = addNewDiv();
                    var starSpan = $("<span>");
                    var trashSpan = $("<span>");
                    var uList = $("<ul>");

    // Function to create a new <div/> & assignId = "div"rId#
                    function addNewDiv() {
                        var newDiv = $("<div>");
                        newDiv.attr("id", recipeObj.rID);
                        newDiv.attr("class", "well col-xs-12 col-md-6 result");
                        $("#resultAppend").append(newDiv);
                        return newDiv;
                    }    
    // Append Ajax results to DOM
    //convert ingredients array to list
                    for ( var a = 0; a < recipeObj.ingredients.length; a++){
                        var listItem = $("<li></li>");
                        var singleIngredient = recipeObj.ingredients[a];
                        listItem.text(singleIngredient); 
                        uList.append(listItem);
                    }
    //insidediv 
                    (function(){
                        insideDiv.attr("style", "position: absolute; margin: auto; width: 100%;")
                        renderDiv.append(insideDiv);
                    })();
    //Star & trash     
                    function constructSaveNTrash(){
                        starSpan.attr("class", "glyphicon glyphicon-star-empty starSpan");
                        trashSpan.attr({
                            class: "glyphicon glyphicon-trash trashSpan media-right",
                            id: "trash" + recipeObj.rID
                        });
                        insideDiv.append(starSpan);
                        insideDiv.append(trashSpan);
                    };
                    constructSaveNTrash();
//image
                    function constructResultImg(){
                        anchor.attr({
                            href: recipeObj.source,
                            target: "_blank"
                        });
                        recipeIMG.attr({
                            id: "IMG" + recipeObj.rID,
                            src: recipeObj.imgURL,
                            class: "mouseOn linkUrl recipeImgMain"
                        });
                        renderDiv.append(anchor);
                        anchor.append(recipeIMG);
                    };
                    constructResultImg();
    // Ingredients Button
                    function constructIngrBtn(){
                        newButton.text("Ingredients");
                        newButton.attr({
                            id: "button" + recipeObj.rID,
                            class: "btn btn-default",
                            style: "margin-left: auto; margin-right: auto; display: block;",
                            title: "Ingredients",
                            'data-toggle': "popover",
                            'data-content': uList.html()
                        });
                        renderDiv.append(newButton);
                        $('[data-toggle="popover"]').popover({ html : true, content : uList, container : "body"});      
                    }
                    constructIngrBtn();

                    function appendTitle(){
                        recipeTitle.text(recipeObj.title);
                        recipeTitle.attr("class", "recipeDesc");
                        renderDiv.append(recipeTitle);     
                    };
                    appendTitle();

    //history ARR 
                    searchedArr = JSON.parse(localStorage.getItem("historyArr")) || [];

                    if(searchedArr.indexOf(recipeObj.rID) === -1){
                        searchedArr.push(recipeObj.rID);
                        localStorage.setItem("historyArr", JSON.stringify(searchedArr));
                    }
                });
            }    
        }
    });

    //enter key submit search
    $("#searchTerm").on("keyup", function(event){
        event.preventDefault();
        if (event.keyCode === 13) {
            $("#searchBttn").click();
        }
    })
    //Save result
    $(document).on("click", ".starSpan", function(){
        var storeThis = $(this).parents().eq(1).attr("id");
        if(storedRecipes.indexOf(storeThis) === -1){
            storedRecipes.push(storeThis);
            localStorage.setItem("storeArr", JSON.stringify(storedRecipes));
        }
    })
    //Trash Result
    $(document).on("click", ".trashSpan", function(){
        $(this).parents().eq(1).remove();
        $(".popover").popover("hide");
    }) 
})