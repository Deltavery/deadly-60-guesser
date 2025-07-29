// 2d array of all animals
// columns:
// name (string)
// size (int)
// speed (int)
// weapons (int)
// deadly rating (int)
let global_animals = [[],[],[],[],[]];

let global_correct = "hippopotamus";

add_animal(["hippopotamus",5,4,4,5]);
add_animal(["poison dart frog",1,2,5,5]);

load_suggestions();

function load_suggestions(){

    let datalist = document.getElementById("animals");

    for (let i = 0; i < global_animals[0].length; i++){
        let new_element = document.createElement("option");
        new_element.value = global_animals[0][i];
        datalist.appendChild(new_element);
    }
}

async function guess_pressed(){

    let guess_string = document.getElementById("guessBox").value.toLowerCase();

    let guess_index = global_animals[0].indexOf(guess_string);

    let test_output_div = document.getElementById("testOutputRow");

    if (guess_index == -1){
        test_output_div.innerHTML = "animal not in database";
        return;
    }

    
    let animal_array = get_animal(guess_index);
    let output_string_test = "";
    for (let i = 0; i <= 4; i++){
        output_string_test += String(animal_array[i]) + " ";
    }
    test_output_div.innerHTML = output_string_test;
}

async function display_guess_results(){
    
}


function add_animal(animal_array){
    for (let i = 0; i <= 4; i++){
        global_animals[i].push(animal_array[i]);
    }
}

function get_animal(index){
    let return_array = [];
    for (let i = 0; i <= 4; i++){
        return_array.push(global_animals[i][index]);
    }
    return return_array;
}
