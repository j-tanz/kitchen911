$(document).ready(function(){
    var recipeObj = {};
    var numSearch = 0;
    var resultArr = [];

//This should trigger search on enter keypress but wont work?  Tried moving it all over too...WTF!!!
    $(document).on("keyup", function(event){
        event.preventDefault();
        if (event.keyCode === 13) {
            $("#searchBttn").click();
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
                    rID: JSON.parse(result).recipe.recipe_id,
                    source: JSON.parse(result).recipe.source_url
                }
                // console.log(result);
// Function to create a new <div/> & assignId = "div"rId#
            function addNewDiv() {
                var newDiv = $("<div>");
                newDiv.attr("id", recipeObj.rID);
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
            var anchor = $("<a>");
            var popupDiv = $("<div>");
            
// Append Ajax results to DOM
//popup div
      
//insidediv 
            insideDiv.attr("style", "position: relative; margin: 25px;")
            renderDiv.append(insideDiv);
//Star      
            starSpan.attr("class", "glyphicon glyphicon-star-empty starSpan");
            insideDiv.append(starSpan);
//trash
            trashSpan.attr("class", "glyphicon glyphicon-trash trashSpan media-right");
            trashSpan.attr("id", "trash" + recipeObj.rID);
            insideDiv.append(trashSpan);
//Image     
            anchor.attr("href", recipeObj.source);
            anchor.attr("target", "_blank");
            renderDiv.append(anchor);
            recipeIMG.attr("id", "IMG" + recipeObj.rID);
            recipeIMG.attr("src", recipeObj.imgURL);
            recipeIMG.attr("class", "mouseOn linkUrl");
            recipeIMG.attr("style","height: 250px; width: 250px; margin-left: auto; margin-right: auto; display: block" );
            anchor.append(recipeIMG);
//popup
            popupDiv.text(recipeObj.ingredients);
            popupDiv.attr("class", "popUpDiv");
            popupDiv.attr("id", "pop" + recipeObj.rID);
            renderDiv.append(popupDiv);

            $(document).on("mouseover", ".mouseOn", function() {
                // console.log("over", $(this).parent().siblings(".popUpDiv"));
                $(this).parent().siblings(".popUpDiv").hide();
            }).mouseout(function() {
                $(this).parent().siblings(".popUpDiv").show();
            });
            // console.log(this);
//Title
            recipeTitle.text(recipeObj.title);
            recipeTitle.attr("class", "recipeDesc");
            renderDiv.append(recipeTitle);  
//trash a result                  
            $(document).on("click", ".trashSpan", function(){
                $(this).parents().eq(1).remove();
            })

                });
            }    
        }
    });
    
    var storedRecipes = JSON.parse(localStorage.getItem("storeArr")) || [];
    
    $(document).on("click", ".starSpan", function(){
        var storeThis = $(this).parents().eq(1).attr("id");
        if(storedRecipes.indexOf(storeThis) === -1){
            storedRecipes.push(storeThis);
            localStorage.setItem("storeArr", JSON.stringify(storedRecipes));
            addNewSave();  
            // addToBox();
        }
        console.log(storedRecipes);
        console.log(storeThis);

        function addNewSave() {
            var newSave = $("<div>");
            newSave.attr("id", storeThis);
            newSave.attr("class", "well col-xs-12 col-md-6 savedR");
            newSave.attr("style", "position: relative;");
            $("#favoritesBox").append(newSave);
            return newSave;
        }
        var boxSave = addNewSave();

        // function addToBox() {
            // boxSave.append(storeThis);
        // }
        
})

    // if(localStorage.getItem(storedRecipes.indexOf(storeThis)) === -1 )





});

// <div id="id01" class="w3-modal">
//     <div class="w3-modal-content">
//       <div class="w3-container">
//         <span onclick="document.getElementById('id01').style.display='none'" class="w3-button w3-display-topright">&times;</span>
//         <p>Some text. Some text. Some text.</p>
//         <p>Some text. Some text. Some text.</p>
//       </div>
//     </div>
//   </div>


// function createPopup(){
//     var popup = open("", "Popup", "width=300,height=200");
//     var txtOk = popup.document.createElement("TEXTAREA");
//     var aOk = popup.document.createElement("a");
//     aOk.innerHTML = "Click here";
    
//     popup.document.body.appendChild(txtOk);
//     popup.document.body.appendChild(aOk);
//     }
   


// WE MAY STILL NEED THIS LATER:
            // $.each(recipeObj[0].ingredients, function() {
            //     for ( var i = 0; i < recipeObj[0].ingredients.length; i++ ) {
            //     $('ul').append("<li><h6 class='ingredientsList'"> + recipeObj[0].ingredients[i] + "</h6></li>");
            //     $("resultsBox").append(ingredientList);

            //     }
            // })



            // $("#pdf1img").wrap($('<a>',{
            //     href: '/Content/pdf/' + data.pdf1
            //  }));

            // $(document).on("click", ".linkUrl", function()
            // } )
            // $(document).on("mouseover", ".mouseOn", function(){
            //     var popup = open("", "Popup", "width=300,height=200");
            //     var txtOk = popup.document.createElement("TEXTAREA");
            //     var aOk = popup.document.createElement("a");
            //     aOk.innerHTML = "Click here";
                // 
                // popupDiv.attr("id", "popup" + recipeObj.rID);
                // ingredientList.text(recipeObj.ingredients);
                // popupDiv.append(ingredientList);
            // })




