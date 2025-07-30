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

let global_seed = 318;

// Adds 6 empty guess boxes to the page
for (let i = 0; i < 6; i++){
    let new_no_guess_element = document.getElementById("defaultNoGuessHolder").cloneNode(true);
    new_no_guess_element.id = "noGuessHolder" + String(i);
    global_no_guess_elements.push(new_no_guess_element);
    document.getElementById("noGuessHolderBox").appendChild(new_no_guess_element);
}
global_no_guess_elements[0].innerHTML = "Guess 1/6";

// makes pressing enter count as guessing
document.getElementById("guessBox").addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        guess_pressed();
    }
})

setup_page();

// runs upon the page loading
async function setup_page(){

    console.log("loading file");

    // reads the file for animals to use in the game
    await load_animal_file();

    console.log("loading suggestions");

    // loads animals into suggestions for the text box
    load_suggestions();

    console.log("getting answer");

    // gets the correct answer
    get_global_correct();
}

// loads animals from animals.txt into global_animals
async function load_animal_file(){

    // loads text file
    let response = await fetch("animals.txt");

    console.log("first await done");

    let raw_text = await response.text();

    console.log("second await done");

    // splits file by new lines
    let animal_rows = raw_text.split(/\r?\n/);

    // resets global_animals to empty
    global_animals = [[],[],[],[],[]];

    // pushes each animal's data to the global array
    for (let row = 0; row < animal_rows.length; row++){
        let animal = animal_rows[row].split(",");
        for (let col = 0; col < animal.length; col++){
            if (col == 0){
                global_animals[col].push(animal[col]);
            } else {
                global_animals[col].push(parseInt(animal[col]));
            }
        }
    }

}

// loads an animal into global_correct depending on the date
// ensures that you get full cycles of all the animals before any are repeated
function get_global_correct(){

    console.log("running");

    // get the amount of days since the epoch
    let now = new Date();
    let days_since_epoch = Math.floor(now/8.64e7);
    
    // amount of animals
    let animal_count = global_animals.length;

    // ensures the seed is different every time all the animals are cycled
    let full_cycles = Math.floor(days_since_epoch/animal_count);
    global_seed = 318318 + (3*full_cycles);

    // how many days into the current cycle of animals we are
    let cycle_pos = days_since_epoch % animal_count;

    // picks a random animal
    let animal_name_list = structuredClone(global_animals[0]);
    animal_name_list = shuffle(animal_name_list, global_seed);
    let correct_name = animal_name_list[cycle_pos];
    let correct_index = global_animals[0].indexOf(correct_name);

    // updates the global correct to the corresponding animal_array
    global_correct = get_animal(correct_index);

    console.log(cycle_pos);
    console.log(full_cycles);
    console.log(global_correct);

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
    document.getElementById("guessBox").value = "";

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

    // if it was the last guess or correct, replaces guess option with text
    // otherwise updates guess count
    if (are_arrays_equal(global_correct,animal_array)){
        document.getElementById("guessRow").innerHTML = "Congratulations!";
    } else if (global_no_guess_elements.length == 1){
        document.getElementById("guessRow").innerHTML = "Out of tries...<br>The correct answer was:<br>" + global_correct[0];
    } else {
        // updates the guess number on the first empty guess element
        global_no_guess_elements[0].innerHTML = "Guess " + String(2 + (6 - global_no_guess_elements.length)) + "/6";
    }

    

    // removes an empty guess element
    global_no_guess_elements.slice(-1)[0].remove();
    global_no_guess_elements.pop();

    // removes the last detailed guess results
    if (global_guess_elements.length != 0){
        global_guess_elements.slice(-1)[0].remove();
        global_guess_elements.pop();
    }

    // adds a non-detailed guess result for the last guess, if it exists
    if (global_guesses.length > 0){
        display_simple_result(global_guesses.slice(-1)[0]);
    }
    
    // records the guess
    global_guesses.push(animal_array);

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
        "Size..................",
        "Speed...............",
        "Weapons...........",
        "Deadly Rating...",
    ];

    // for each stat of the animal
    for (let i = 0; i < 4; i++){

        // gets how the guess relates to the correct answer
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

    // adds the element to the page
    document.getElementById("guessHolderBox").appendChild(new_guess_element);

}

// creates a simplified element to display previous guesses
async function display_simple_result(animal_array){

    // creates the box around the guess result
    let guess_box = document.createElement("div");
    guess_box.className = "guessHolder";
    global_guess_elements.push(guess_box);

    // adds a single row to the box
    let guess_row = document.createElement("div");
    guess_row.className = "guessHolderRow";
    guess_box.appendChild(guess_row);

    // adds the name of the animal to the start of the row
    let animal_title = document.createElement("div");
    animal_title.className = "statNameHolder";
    guess_row.appendChild(animal_title);
    animal_title.innerHTML = animal_array[0];

    // adds the element containing the skull images to the row
    let skull_holder = document.createElement("div");
    skull_holder.className = "guessHolderSkulls";
    skull_holder.style.width = "220px";
    guess_row.appendChild(skull_holder);

    // for each category
    for (let i = 0; i < 4; i++){

        // gets how the guess relates to the correct answer
        let correctness = "correct";
        if (animal_array[i+1] > global_correct[i+1]){
            correctness = "toohigh";
        } else if (animal_array[i+1] < global_correct[i+1]){
            correctness = "toolow";
        }

        // creates the skull image
        let new_skull = document.createElement("img");

        switch (correctness){
            case "correct":
                new_skull.src = "green_skull.png";
                break;
            case "toolow":
                new_skull.src = "yellow_skull_right.png";
                break;
            case "toohigh":
                new_skull.src = "yellow_skull_left.png";
                break;
        }

        skull_holder.appendChild(new_skull);

        let skull_label = document.createElement("div");
        skull_label.innerHTML = String(animal_array[i+1]);
        skull_holder.appendChild(skull_label);

    }
        
    // adds the element to the page
    document.getElementById("guessHolderBox").appendChild(guess_box);

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

// array shuffling algo i took from stackoverflow
function shuffle(array, global_seed) {                // <-- ADDED ARGUMENT
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(random(global_seed) * m--);        // <-- MODIFIED LINE

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++global_seed                                     // <-- ADDED LINE
  }

  return array;
}

function random(global_seed) {
  var x = Math.sin(global_seed++) * 10000; 
  return x - Math.floor(x);
}