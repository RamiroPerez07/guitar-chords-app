/*
source : https://api.uberchord.com/#searching-multiple-chords-by-voicing-pattern
URL https://api.uberchord.com/v1/chords?voicing={voicings}
*/
const form = document.getElementById("form")
const string6Input = document.getElementById("string-6")
const string5Input = document.getElementById("string-5")
const string4Input = document.getElementById("string-4")
const string3Input = document.getElementById("string-3")
const string2Input = document.getElementById("string-2")
const string1Input = document.getElementById("string-1")
let stringInputs = document.getElementsByClassName("string-input")
stringInputs = [...stringInputs]
const messageText = document.getElementById("form-message")
const cardContainer = document.getElementById("chord-card-container")

/* URL */
let url = "https://api.uberchord.com/v1/chords?voicing="
//########

function getChordPattern(){
    const patternArray = []
    stringInputs.forEach(stringInput => patternArray.push(stringInput.value.toString().toUpperCase()))
    const pattern = patternArray.join("-")
    return pattern;
}

async function searchChordByPattern(){
    const pattern = getChordPattern();
    console.log(pattern)
    try{
        const res = await fetch(url+pattern); 
        const data = await res.json();
        return data;
    }catch(error){
        console.log(error)
        return [];
    }
} 

function createHtmlCard(objChord){
    const arr4comp = objChord.chordName.toString().split(",") //devuelve un array de 4 componentes (esto es predeterminado, ya lo dice la API)
    const bass = (arr4comp[3].length)?(" / "+arr4comp[3].toString()):""
    const chordName = arr4comp.slice(0,3).join(" ")+ bass;
    const tones = objChord.tones.toString().split(",").join(" , ")
    return `
    <div class="card">
        <span class="card-labels">Acorde:</span>
        <h2 class="chord-name chord-result">${chordName}</h2>
        <span class="card-labels">Tonos:</span>
        <p class="chord-tones chord-result">${tones}</p>
        <span class="card-labels">Dedos utilizados:</span>
        <p class="chord-fingering chord-result">${objChord.fingering}</p>
    </div>
    `
}

function renderChordCard(arrayChord){
    cardContainer.innerHTML = arrayChord.map(objChord => createHtmlCard(objChord)).join("")
}

function checkInput(input){
    valid = false;
    const inputValue = input.value.trim().toUpperCase();
    if(isEmpty(inputValue)){
        focusWrongInput(input)
        showError("Debes completar todas las entradas. Si la nota no se toca, recordá colocar 'X'. Si se toca al aire, ingresa '0'.")
    }else if (!isInputValueValid(inputValue)) {
        focusWrongInput(input)
        showError("Se han ingresado caracteres no permitidos. Recordá que solo podes ingresar numeros del 1 al 12 (trastes), X o 0.")
    }else{
        valid=true;
    }
    return valid;
}

function focusWrongInput(input){
    input.classList.add("error")
}

function isEmpty(value){
    return value.length ? false : true;
}

function isInputValueValid(value){
    const regExp = /((^[0-9]$)|(^1[0-2]$))|[X]/;
    return regExp.test(value);
}





function isFormValid(){
    const valid = stringInputs.map(stringInput => checkInput(stringInput)).includes(false)
    return !valid;
}

function showSuccess(){
    messageText.classList.remove("msj-error");
    messageText.classList.add("msj-success");
    stringInputs.forEach(input =>{
        if (input.classList.contains("error")){
            input.classList.remove("error");
        }
    })
    messageText.textContent = "";
}

function showError(message){
    messageText.textContent = "";
    messageText.classList.remove("msj-success");
    messageText.classList.add("msj-error");
    messageText.textContent = message;
}

function init(){
    form.addEventListener("submit",function (event){
        event.preventDefault()
        if (!isFormValid()){
            return;
        };
        showSuccess()
        searchChordByPattern()
          .then(arrayChord =>{
                console.log(arrayChord)
                renderChordCard(arrayChord)
          })
    })
}

init()