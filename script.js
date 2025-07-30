// 2d array of all animals
// columns:
// name (string)
// size (int)
// speed (int)
// weapons (int)
// deadly rating (int)
let global_animals = [[],[],[],[],[]];

// The animal (array) the user is trying to guess
let global_correct = ["hippopotamus",5,4,4,5];

let global_no_guess_elements = [];

let global_guess_elements = [];

let global_guesses = [];

load_animal_file();

// Adds 6 empty guess boxes to the page
for (let i = 0; i < 6; i++){
    let new_no_guess_element = document.getElementById("defaultNoGuessHolder").cloneNode(true);
    new_no_guess_element.id = "noGuessHolder" + String(i);
    global_no_guess_elements.push(new_no_guess_element);
    document.getElementById("noGuessHolderBox").appendChild(new_no_guess_element);
}
global_no_guess_elements[0].innerHTML = "Guess 1/6";

add_animal(["hippopotamus",5,4,4,5]);
add_animal(["poison dart frog",1,2,5,5]);

load_suggestions();

// loads animals from animals.txt into global_animals
async function load_animal_file(){

    let response = await fetch("animals.txt");
    let raw_text = response.text();

    fetch('animals.txt').then(response => response.text()).then(text => raw_text = text);

    console.log(raw_text);


}

function load_suggestions(){

    let datalist = document.getElementById("animals");

    for (let i = 0; i < global_animals[0].length; i++){
        let new_element = document.createElement("option");
        new_element.value = global_animals[0][i];
        datalist.appendChild(new_element);
    }
}

// Runs upon the guess button being pressed
async function guess_pressed(){

    let guess_string = document.getElementById("guessBox").value.toLowerCase();

    let guess_index = global_animals[0].indexOf(guess_string);

    if (guess_index == -1){
        console.log("animal not in database");
        return;
    }

    let animal_array = get_animal(guess_index);

    console.log(global_guesses);
    console.log(animal_array);

    if (array_includes(global_guesses,animal_array)){
        console.log("Already guessed this animal");
        return;
    }

    global_guesses.push(animal_array);

    // if it was the last guess or correct, removes the guess option
    if (global_no_guess_elements.length == 1 || are_arrays_equal(global_correct,animal_array)){
        document.getElementById("guessRow").remove();
    }

    // updates the guess number on the first empty guess element
    global_no_guess_elements[0].innerHTML = "Guess " + String(2 + (6 - global_no_guess_elements.length)) + "/6";

    // removes an empty guess element
    global_no_guess_elements.slice(-1)[0].remove();
    global_no_guess_elements.pop();

    // removes the last detailed guess results
    if (global_guess_elements.length != 0){
        global_guess_elements.slice(-1)[0].remove();
        global_guess_elements.pop();
    }
    

    // adds the detailed guess results element
    display_guess_results(animal_array);
}

async function display_guess_results(animal_array){

    // creates the box around the guess result
    let new_guess_element = document.createElement("div");
    new_guess_element.className = "guessHolder";

    global_guess_elements.push(new_guess_element);

    let new_guess_row_name = document.createElement("div");
    new_guess_row_name.className = "guessTitle";
    new_guess_element.appendChild(new_guess_row_name);
    new_guess_row_name.innerHTML = animal_array[0];

    // the string that is displayed next to the rating of each stat
    let stat_names = [
        "Size...............",
        "Speed............",
        "Weapons........",
        "Deadly Rating",
    ];

    // for each stat of the animal
    for (let i = 0; i < 4; i++){

        let correctness = "correct";

        if (animal_array[i+1] > global_correct[i+1]){
            correctness = "toohigh";
        } else if (animal_array[i+1] < global_correct[i+1]){
            correctness = "toolow";
        }

        let new_guess_row = document.getElementById("defaultGuessHolderRow").cloneNode(true);
        let new_stat_name = new_guess_row.getElementsByClassName("statNameHolder").item(0);
        let skull_holder_element = new_guess_row.getElementsByClassName("guessHolderSkulls").item(0);

        new_guess_element.appendChild(new_guess_row);
        new_guess_row.removeAttribute("id");

        new_stat_name.innerHTML = stat_names[i];

        let skull_elements = [];

        for (let j = 0; j < animal_array[i+1]; j++){
            let new_skull = document.createElement("img");

            // sets the right image corresponding to the correct clue to the correct animal
            if (correctness == "correct"){
                new_skull.src = "green_skull.png";
            } else if (j < animal_array[i+1] - 1) {
                new_skull.src = "yellow_skull.png";
            } else {
                switch (correctness){
                    case "toolow":
                        new_skull.src = "yellow_skull_right.png";
                        break;
                    case "toohigh":
                        new_skull.src = "yellow_skull_left.png";
                        break;
                }
            }
            

            skull_holder_element.appendChild(new_skull);
        }
    }

    document.getElementById("guessHolderBox").appendChild(new_guess_element);

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

// checks if two arrays contain the same elements
// note if they both contain arrays, those arrays must have the same reference to return true
function are_arrays_equal(array1,array2){
    console.log("checking");
    console.log(array1);
    console.log(array2);
	if (array1.length != array2.length){
        console.log("lengths not equal");
		return false;
	}
	for (let i = 0; i<array1.length; i++){
        console.log(array1[i]);
		if (array1[i] != array2[i]){
			return false;
		}
	}
	return true;
}

// checks if array1 has array2 as an element
function array_includes(array1,array2){
    let included = false;
    for (let i = 0; i < array1.length; i++){
        let element = array1[i];
        console.log(element);
        if (element.constructor === Array){
            if (are_arrays_equal(element,array2)){
                included = true;
            }
        } 
    }
    return included;
}
