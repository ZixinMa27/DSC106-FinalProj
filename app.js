function final_proj(){
    var filePath="dataset/athletes.csv";
    question0(filePath);
    //question1(filePath);
    //question2(filePath);
    //question3(filePath);
    //question4(filePath);
    //question5(filePath);
    //question6(filePath);
}


//take a look for the dataset 
var question0= function(filePath){
    const file = d3.csv(filePath);
    file.then(function(data) {
        console.log(data);
    });       
}

var question1= function(filePath){
    const file = d3.csv(filePath);
    file.then(function(data) {
        
    });       
}


