$(document).ready(function(){
    var foodObj = {};
    $("#searchBttn").on("click", function(event){
        event.preventDefault();
        var recipeSearch = $("#searchTerm").val();
        var queryURL = "http://food2fork.com/api/search";
        var getURL = "http://food2fork.com/api/get";
        // console.log("search", recipeSearch);
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
              lookUpId();       
        });

function lookUpId() {
        console.log("id", foodObj[recipeSearch].rID);
        console.log(getURL);
        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/' + getURL,
            method: 'GET',
            data:{
                key: "ffeb038edfff951ae133911feb4ba4ae",
                rId: foodObj[recipeSearch].rID
            }
          }).done(function(result){
            console.log(result)
          });
        }
    });
});
