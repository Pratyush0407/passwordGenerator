const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = ""; // To make password empty on pageload
let passwordLength = 10; // To make password length set as 10 on page load
let checkCount = 0; // To keep track of the number of checkboxes that are checked on page load
handleSlider()
setIndicator('#ccc');
function handleSlider(){ //Set password length
    inputSlider.value = passwordLength; //On page load it should be equal to 10
    lengthDisplay.innerText = passwordLength; //To show this value on page load
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRndInteger(min,max){
    return Math.floor(Math.random()  * (max - min)) + min; // this will return values from min to max
}

function generateRandomNumber(){
    return getRndInteger(0,9); // This will give number from 0 to 9 means single digit only
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123)); // Converting number to char and returning it
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}   

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum); //Char at that particular index
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){ // This is the function to copy the password to clipboard
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); // This will copy the password to clipboard which is a await 
        copyMsg.innerText = "Copied!"; 
    }
    catch(e){
        copyMsg.innerText = "Failed!";
    }
    copyMsg.classList.add("active"); // This will make copy span visible

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    for (let i = array.length -1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[i];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handelCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++; // to check if checkbox is checked or not
    });
    
if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
}

}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handelCheckBoxChange);
})

inputSlider.addEventListener('input',(e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click',()=>{
    if(checkCount <= 0) return; // None of the checkbox is selected

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = ''; // Remove old passwords 

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);
    //compulsary addition 
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    //remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex](); 
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password; // Show in UI
    calcStrength();
})