const APIKey =   "ffeb038edfff951ae133911feb4ba4ae"  /* "83e9f3d3227309240bf5d8a553b893c9" */

$(document).ready(function(){
    var recipeObj = {};
    var numSearch = 0;
    var resultArr = [];
    var searchedArr = [];
    var storedRecipes = JSON.parse(localStorage.getItem("storeArr")) || [];
 

    $("#resultAppend:empty").parent().hide();
    
    // console.log(resultArr.length);

/**
 *  Fetches recipe search term from page and makes ajax request to food2fork API.
*/
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

/**
 *   Makes an ajax call to food2fork API and fetches recipeObj.
 */  
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
                    $("#resultAppend").parent().show();
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
                    var starBtn = $("<button>");
                    var trashBtn = $("<button>");
                    var uList = $("<ul>");

/**
 * Function to create a new <div/> & assignId = "div"rId#
 * @return {object} -  a div containing recipeObj.rID
 */  

                    function addNewDiv() {
                        var newDiv = $("<div>");
                        newDiv.attr({
                            id: recipeObj.rID,
                            class: "well col-xs-12 col-md-6 result",
                            style: "position: relative"
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
 * Creates star (favorite) button and appends to page.
 */     
                    function constructStarBtn(){
                        starBtn.attr({
                            class: "btn btn-default glyphicon glyphicon-star-empty starBtn",
                            style: "background-color: transparent; background-repeat: no-repeat; outline: none; overflow: hidden;",
                            id: "star" + recipeObj.rID
                        });
                        renderDiv.append(starBtn);
                    };
                    constructStarBtn();

/**
 * Formats searched recipe result image as a link and appends to page. 
 */
                    function constructResultImg(){
                        anchor.attr({
                            href: recipeObj.source,
                            target: "_blank"
                        });
                        recipeIMG.attr({
                            id: "IMG" + recipeObj.rID,
                            src: recipeObj.imgURL,
                            class: "mouseOn linkUrl recipeImgMain",
                            alt: "Image " + recipeObj.rID
                        });
                        renderDiv.append(anchor);
                        anchor.append(recipeIMG);
                    };
                    constructResultImg();

/**
 * Creates trash button and appends to page.
 */
                    function constructTrashBtn(){
                        trashBtn.attr({
                            class: "btn btn-default glyphicon glyphicon-trash trashBtnSearch",
                            style: "background-color: transparent; background-repeat: no-repeat; outline: none; overflow: hidden;",
                            id: "trash" + recipeObj.rID
                        });
                        renderDiv.append(trashBtn);
                    }
                    constructTrashBtn();
                 
/**
 *  Creates an ingredients button that displays "Ingredients" from the recipeObj and appends to page.
 */  
                    function constructIngrBtn(){
                        newButton.text("Ingredients");
                        newButton.attr({
                            id: "button" + recipeObj.rID,
                            class: "btn btn-default ingredientBtn",
                            style: "margin-left: auto; margin-right: auto; display: block;",
                            title: "Ingredients",
                            'data-placement':"auto",
                            'data-toggle': "popover",
                            'data-content': uList.html()
                        });
                        renderDiv.append(newButton);
                        $('[data-toggle="popover"]').popover({ html : true, content : uList, container : "body"});      
                    }
                    constructIngrBtn();

/**
 *   Appends title of searched recipe onto page.
 */  
                    function appendTitle(){
                        recipeTitle.text(recipeObj.title);
                        recipeTitle.attr("class", "recipeDesc");
                        renderDiv.append(recipeTitle);     
                    };
                    appendTitle();

     
                    searchedArr = JSON.parse(localStorage.getItem("historyArr")) || [];

                    if(searchedArr.indexOf(recipeObj.rID) === -1){
                        searchedArr.push(recipeObj.rID);
                        localStorage.setItem("historyArr", JSON.stringify(searchedArr));
                    }
                });
            }    
        }
    });

/**
 *  Listens for enter key to trigger search.
 */    
    $("#searchTerm").on("keyup", function(event){
        event.preventDefault();
        if (event.keyCode === 13) {
            $("#searchBttn").click();
        }
    })

/**
 *  Evaluates a recipe's ID and stores that value in local storage array. 
 */  
    $(document).on("click", ".starBtn", function(){
        var storeThis = $(this).parents().eq(0).attr("id");
        if(storedRecipes.indexOf(storeThis) === -1){
            storedRecipes.push(storeThis);
            localStorage.setItem("storeArr", JSON.stringify(storedRecipes));
        }
    })

/**
 *  Removes a search result from the page.
 */  
    $(document).on("click", ".trashBtnSearch", function(){
        $(this).parents().eq(0).remove();
        $(".popover").popover("hide");
        $("#resultAppend:empty").parent().hide();
    }) 
})