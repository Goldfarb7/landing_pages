var userInputs = {}




function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
            
    // Limit input to 10 digits
    if (value.length > 10) {
        value = value.slice(0, 10);
    }

    // Format the value as (xxx) xxx-xxxx
    let formattedValue = value;
    if (value.length > 6) {
        formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length > 3) {
        formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}`;
    } else if (value.length > 0) {
        formattedValue = `(${value.slice(0, 3)}`;
    }

    // Set the formatted value back into the input field
    input.value = formattedValue;
}


const numberTag = `
<div class='cinput-container'>
      <input id='umobile' type="tel" placeholder='10 digit mobile no.' class='cuser-input'
       oninput="formatPhoneNumber(this,this.value)"
      >
</div>
`


const usernameTag = `
<div class='cinput-container'>
    <input id='uname' type='text' placeholder='Full name' class='cuser-input'> 
</div>
`

 /**
  * - allow number input only, if length is 5, then gets city and state
  * @param {element} el : zip code input tag
  */
function validateIntZip(el){
    el.value = el.value.replace(/\D/g, '');
    if(el.value.length === 5){
        getCityAndState(el.value).then(location => {
          console.log(location);
          //adding user city & state into global variables
          window.user_city = location.city;
          window.user_state = location. state;
        }).catch(error => console.log(error))
      }
}

const userZipCodeTag = `
<div class='cinput-container'>
    <input id='uzip_code' type="text" maxlength="5" placeholder='5 digit zip-code' class='cuser-input' 
     oninput='validateIntZip(this)'> 
</div>
`


const userEmailTag = `
<div class='cinput-container'>
    <input id='uemail' type="text" placeholder='Email id' class='cuser-input'> 
</div>
`



const DB= {
    default: [
        "Hi 👋",
        "I’m Jane from Claim Injury Funds.",
        "Want to find out how much you're entitled to? Let me ask you a few quick questions to get started.",
        "<b>Were you injured in an auto accident?</b>",
        {
            1: {color:"blue", next:"yes2", text:"Yes"},
            2: {color:"blue", next:"yes2", text:"No"}
        }
    ],

    // yes1: [
    //     "Let me ask you a few quick questions to get started",
    //     "<b>Were you injured in an auto accident?</b>",
    //     {
    //         1: {color:"blue", next:"yes2", text:"Yes"},
    //         2: {color:"blue", next:"yes2", text:"No"}
    //     }
    // ],

    yes2: [
        // "Did your auto accident occur within the last 2 years?",
        "When did the accident occurred?",
        {
            1: {color:"blue",next:"yes3", text:"Within Last 30 Days", key:"accident_time", value:"Within Last 30 Days"},
            2: {color:"blue",next:"yes3", text:"Within Last 6 months", key:"accident_time", value:"Within Last 6 months"},
            3: {color:"blue",next:"yes3", text:"Last Year", key:"accident_time", value:"Last Year"},
            4: {color:"blue",next:"yes3", text:"In Last 2 Years", key:"accident_time", value:"In Last 2 Years"}
        }
    ],

    yes3: [
        "<b>Was the accident your fault?</b>",
        {
            1: {color:"blue",next:"yes4", text:"No", key:"is_victim_fault", value:"No"},
            2: {color:"blue",next:"yes4", text:"Yes", key:"is_victim_fault", value:"Yes"}
        }
    ],

    yes4: [
        "<b>Do you currently have a lawyer?</b>",
        {
            1: {color:"blue",next:"yes5", text:"No", key:"is_lawyer", value:"No"},
            2: {color:"blue",next:"yes5", text:"Yes", key:"is_lawyer", value:"Yes"},
            3: {color:"blue",next:"yes5", text:"Yes, but looking to change", key:"is_lawyer", value:"No"}
        }
    ],

    yes5: [
        // "<b>Fill out name and number to see how much your case is worth</b>",
        "<b>Fill out a few details to see how much your case is worth</b>",
        {
            1: {color:"blue", html:`${usernameTag}`},
            2: {color:"blue", html:`${numberTag}`},
            3: {color:"blue", html:`${userZipCodeTag}`},
            4: {color:"blue", html:`${userEmailTag}`},
            5: {color:"blue", next:"yes6", text:"Submit"},
        }
    ],

    yes6: [
        // "<b>🎉Congratulations! 🎁</b>",
        // "It looks like based on the info you submitted your accident may qualify for compensation!",
        // "Tap the number below to speak to one of our friendly experts for more information on your free case evaluation.. The call takes less than 15 minutes!",
        // {
        //     1: {color:"green",next:"callMe", text:"<b>+13214858331</b>"},
        // }
        "Your injury likely qualifies for compensation!",
        "<b>A legal representative will call in the next 5 MINUTES.</b>",
        " Please keep your phone nearby to review your case."
    ],

    // yes9: [
    //     "<b>🎉Congratulations! 🎁</b>",
    //     "It looks like based on the info you submitted your accident may qualify for compensation!",
    //     "Tap the number below to speak to one of our friendly experts for more information on your free case evaluation.. The call takes less than 15 minutes!",
    //     {
    //         1: {color:"green",next:"callMe", text:"<b>+13214858331</b>"},
    //     }
    // ],

}


function validatePhoneNumber() {
    // Get the phone number input value
    const phoneNumber = document.getElementById('umobile').value;
    // Regular expression to match the format (xxx) xxx-xxxx
    const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
    // Test if the phone number matches the pattern
    if (!phonePattern.test(phoneNumber)) {
        alert('Please enter a valid phone number 🙁');
        return false;  // Prevent form submission if invalid
    }
    else{
        // Remove all non-digit characters
        const digits = phoneNumber.replace(/\D/g, '');
        // Return only the last 10 digits (if it's longer than 10)
        let ten = digits.slice(-10);
        if((ten.length === 10) && (!ten.startsWith("1"))){
            window.phoneNumber = ten;
            return true;  // Allow form submission if valid
        }
        else{
            alert("Invalid Phone No. !!")
            return false
        }
        
    }
}


function validateZipCode(){
    const zipCode = document.getElementById('uzip_code').value;
    if(zipCode.length != 5){
        alert("Enter Valid Zip Code !!");
        return false
    }
    else{ 
        //get zipcode here
        window.zipCode = zipCode;
        return true 
    }
}


function validateEmail(email) {
    // Define the regular expression for validating email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Test the email against the pattern
    if(emailPattern.test(email)){
        // get email here
        window.email = email;
        return true
    }
    else{
        alert("Enter a valid Email Address !!");
        return false
    }
  }


function validateName(name){
   name = name.trim();
   if(name.includes(" ")){
     let nameParts = name.split(" ")
     window.firstName = nameParts.shift();
     window.lastName = nameParts.join(" ");
     return true
   }
   else{
     alert("Please Enter Full Name !!");
     return false
   }
}


function submitInfo(){
   const uname = document.getElementById('uname').value.trim();
   const emailId = document.getElementById("uemail").value.trim();
    //    let umobile = document.getElementById('umobile').value.trim();
    if(uname.length <= 1){
        alert('Please enter your name 🙁');
        return false
    }
   else if(validateName(uname) && validatePhoneNumber() && validateZipCode() && validateEmail(emailId)){
     return true
   }
   else{
     return false
   }
}



async function chat(key, inResponseOf=null, msgObj={}){

  if(!key){return}
 
  if(key === "callMe"){
    gtag_report_conversion(); //Fire google analytics event
    fbq('track', 'chat-LP-lead'); //Fire Meta businees event
    //setting calling number
    const mobileNo = document.getElementById("mobile-number").href;
    return window.open(mobileNo);
  }

  if(key === "yes6"){
    let res = submitInfo();
    if(!res){
        // alert("Enter Valid Details !!!");
        return
    }
    else{
        //upload data to leadProsper here
        getFormData();
    }
  }


  let targetDiv = document.getElementById("chat");
  typing(show=true); //showing typing animation
  let msgs = DB[key]; //reading msgs from Db

  if(inResponseOf){
    removeAllButtons()
    //adding user response into chat
    targetDiv.innerHTML+=`
            <div class="reply-container">
                <div class="msgContainer">
                    <div class="msgDiv"><span class="user-msg">${inResponseOf}&nbsp;</span></div>
                </div>
                <img class="user-img" src="https://cdn.jsdelivr.net/gh/Goldfarb7/landing_pages/user.png" alt="user image">
            </div>
        `

    if(key === "yes6"){
        await delay(2300); //for submit delay animation
       }
     
    // adding user data into userInputs object
    delete msgObj.undefined;
    console.log("msg obj is: ",msgObj);
    if(msgObj){
        Object.keys(msgObj).forEach(key=>{
                userInputs[key] = msgObj[key];
        })
        
    }
   
  }


  let index = 0;
  let jadeId;
  for (const msg of msgs){
    scrollToBottom(); //scrolling to bottom
    await delay(100);
    
     //if element is a string
     if(typeof(msg) === "string"){
        jadeId = generateRandomString(10);
        targetDiv.innerHTML+=`
            <div class="msg-container">
                <img class="jade" id="${jadeId}" src="https://cdn.jsdelivr.net/gh/Goldfarb7/landing_pages/jade.jpg" alt="bot image">
                <div class="msgContainer">
                    <div class="msgDiv"><span class="msg">${msg}</span></div>
                </div>
            </div>
        `
     }
     else if(typeof(msg) === "object"){
            targetDiv.innerHTML+=`
                <div class="msg-container">
                    <img class="jade" src="https://cdn.jsdelivr.net/gh/Goldfarb7/landing_pages/jade.jpg" alt="bot image">
                    <div class="msgContainer">
                       <div class="msg" style="background-color:transparent">
                          ${createButtons(msg)}
                       </div>
                    </div>
                </div>
            `
     }

    if (index === msgs.length - 1) {
        //This is the last iteration.
        // console.log("last id", jadeId);
        document.getElementById(jadeId).style.visibility="visible";
      }

    index++;
     
  }
  typing(show=false); //hiding typing animation
  scrollToBottom(); //scrolling to bottom
//   customClear(key);
}
 



function createButtons(msg){
    // to create button/input response option(s) for user.
    s = ""
    Object.keys(msg).forEach(key => {
        //button value check (for final button value change i.e. alloted no. by ringba)
        let btnValue = msg[key]['next'] ==="callMe" ? "📞&nbsp;" + document.getElementById("mobile-number").href.split(":").pop().trim() : msg[key]['text'];

        if(msg[key]['text'] != null){
            //creating button
            s += `<button onclick="chat('${msg[key]['next']}', inResponseOf='${msg[key]['text']}', msgObj={ ${msg[key]?.key}: '${msg[key]?.value}' } )" class="${msg[key]['color']} btn">
                    ${btnValue}
                 </button> `
        }
        if(msg[key]['html'] != null){
            // inserting HTML element for user response
            s += ` ${msg[key]['html']} `
        }
        
      });
    return s
}



function generateRandomString(length) {
    return Math.random().toString(36).substring(2, 2 + length);
  }



function typing(show=true){
    if(show){
        document.getElementById('typing-container').style.display="flex"
    }
    else{
        document.getElementById('typing-container').style.display="none"
    }
    
}




// Helper function to create a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



function removeAllButtons(){
    //to remove all buttons
    let allBtns = Array.from(document.getElementsByClassName('btn'));
    allBtns.forEach(btn=>{
        btn.parentElement.parentElement.parentElement.remove()
    })
}




function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight, // Scroll to the height of the document
        behavior: 'smooth' // For a smooth scrolling effect
      });
}


// for google analytics event
function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof(url) != 'undefined') {
        window.location = url;
      }
    };
    gtag('event', 'conversion', {
        'send_to': 'AW-16576154023/KyNXCOuhgbsZEKeTkOA9',
        'event_callback': callback
    });
    return false;
  }



// function customClear(key){
//     if(key==="yes9"){
//         Array.from(document.getElementsByClassName('btn')).pop().parentElement.style.backgroundColor="transparent";
//     }
// }





chat("default");











//.......................................... For LeadProsper Upload......................................



console.log("LeadProsper script loaded...");
var lp_mva_data = {
    "lp_campaign_id": "23230",
    "lp_supplier_id": "63311",
    "lp_key": "1g1vigpzlczgd3",
    "user_agent": navigator.userAgent || "",
    "landing_page_url": window.location.href || "",
};

// Get the current URL (or use a specific URL)
const url = new URL(window.location.href);
// Use URLSearchParams to get the query parameters
const params = new URLSearchParams(url.search);
// Check if the 'test' parameter is present and equals 'true'
if (params.get('test') === 'true') {
  console.log("Testing Mode Activated !!!");
  lp_mva_data["lp_action"] = "test"
}

//global variables for dynamic fetch output data
window.user_city = "";
window.user_state = "";
window.user_ip = "";



//get data from html Form
/**
 * - gets form's input data when user clicks submit button
 */
const getFormData = ()=>{
    // console.log("tracker ran..");
    console.log(userInputs);
    // for name
    userInputs["first_name"]  = window.firstName;
    userInputs["last_name"]  = window.lastName;
    // for mobile No.
    userInputs["phone"] = window.phoneNumber;
    // for email
    userInputs["email"] = window.email;
    // zipcode
    userInputs['zip_code'] = Number(window.zipCode);
    // comments
    userInputs['comments'] = "NA";
    // trusted form URL
    userInputs['trustedform_cert_url'] = ""//todo ;

    lp_mva_data["city"] = window.user_city || "";
    lp_mva_data["state"] = window.user_state || "";
    lp_mva_data['ip_address'] = window.user_ip || "";

    // getting accident date
    let accident_date = calculateInjuryDate(userInputs['accident_time']);
    console.log(`Accident Date is: ${accident_date}`);
    userInputs["accident_date"] = accident_date;

    let new_data = {...lp_mva_data,...userInputs};
    console.log("New User Data: ", new_data);

    // sending data to LeadProsper
    // sendDataToLeadProsper(new_data);

};


// document.addEventListener("DOMContentLoaded",()=>{
//   document.getElementById("button-substitute").addEventListener("click",(e)=>{
//       e.preventDefault();
//       getFormData();
      
//       //firing google ads/meta ads etc. events here
//       fbq('track', 'form-submit'); //Fire Meta businees event
//       console.log("fire Custom Events ran successfully!!");
//   })
// });



//send data to leadProsper server
/**
 * 
 * @param data - JS object (Lead info) to POST to leadProsper
 */
function sendDataToLeadProsper(data){
    let url = "https://api.leadprosper.io/direct_post"

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json()) // Parses the response as JSON
    .then(json => console.log(json))
    .catch(error => console.error('Error:', error));
}




/**
 * 
 * @param resource - URL to make request
 * @param options - any other data to append in request
 * @param timeout - request timeout
 * @returns - request's response (NOT as JSON)
 */
async function fetchWithTimeout(resource, options = {}, timeout = 6000) {
    const controller = new AbortController();
    const { signal } = controller;
  
    const fetchPromise = fetch(resource, { ...options, signal });
  
    const timeoutId = setTimeout(() => controller.abort(), timeout);
  
    try {
        const response = await fetchPromise;
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
  }


  /**
* - get user IP and update the global user_ip variable
* - will hit another API if first one fails
*/
async function getIpInfoWithFallback() {
    const ipapiUrl = 'https://ipapi.co/json/';
    const ipinfoUrl = 'https://ipinfo.io?token=57b648e0910bb2'; // Replace with your token
  
    try {
      // Try fetching IP info from ipapi
      const response = await fetchWithTimeout(ipapiUrl);
      const data = await response.json();
  
      console.log('IP Info from ipapi.co:');
      console.log(`IP: ${data.ip}`);
      //add ip into lP_MVA JSON here
      window.user_ip = data.ip;
  
    } catch (error) {
      console.error('Error fetching IP info from ipapi.co, attempting fallback:', error);
  
      try {
        // Fall back to fetchWithTimeout
        const response = await fetchWithTimeout(ipinfoUrl);
        const data = await response.json();
  
        console.log('IP Info from ipinfo.io:');
        console.log(`IP: ${data.ip}`);
        //add ip into lP_MVA JSON here
        window.user_ip = data.ip;
  
      } catch (fallbackError) {
        console.error('Error fetching IP info from ipinfo.io:', fallbackError);
      }
    }
  }
  
  // Call the function to get IP Address
  getIpInfoWithFallback();



/**
* - get city, state from zipCode
* {zipCode} - string: target zip-code 
* returns - object: {city:city_name, state: state abbreviation}
*/
async function getCityAndState(zipCode) {
    const zippopotamUrl = `https://api.zippopotam.us/us/${zipCode}`;
    const apiKey = "01f66604f067c0e7a3af20e045db4510"
    const positionStackUrl = `https://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${zipCode}&limit=1`;
  
    try {
        // First, try the Zippopotam API with a 5-second timeout
        let response = await fetchWithTimeout(zippopotamUrl, {}, 5000);
        if (!response.ok) throw new Error('Zippopotam API request failed');
        
        let data = await response.json();
        return {
            city: data.places[0]['place name'],
            state: data.places[0]['state abbreviation']
        };
    } catch (error) {
        console.error("Error with Zippopotam API: ", error.message);
  
        // Fallback to the PositionStack API
        try {
            let response = await fetch(positionStackUrl);
            if (!response.ok) throw new Error('PositionStack API request failed');
  
            let data = await response.json();
            const city = data.data[0].locality || data.data[0].region;  // Fallback logic for missing data
            const state = data.data[0].region_code || data.data[0].region;
            return {
                city, state
            };
        } catch (error) {
            console.error("Error with PositionStack API: ", error.message);
            throw new Error('Both API requests failed');
        }
    }
  }
  
  // test Usage
  // getCityAndState('90210')
  //   .then(location => console.log(location))
  //   .catch(error => console.error(error));
  




  /**
 * calculates rough date idea from accident time range option value
 * @param option value choosen for: "When did the accident or injury occur?"
 * @returns approx accident date in MM/DD/YYYY format
 */
function calculateInjuryDate(option) {
    const currentDate = new Date();
    let pastDate;
  
    if (option.toLowerCase().includes("30 days")) {
        pastDate = new Date();
        pastDate.setDate(currentDate.getDate() - 30);
    } else if (option.toLowerCase().includes("6 months")) {
        pastDate = new Date();
        let randomNum1 = Math.floor(Math.random() * 3) + 3;
        pastDate.setMonth(currentDate.getMonth() - randomNum1);
    } else if (option.toLowerCase().includes("year")) {
        if (option.toLowerCase().includes("last year")) {
            pastDate = new Date();
            pastDate.setFullYear(currentDate.getFullYear() - 1);
            let randomNum2 = Math.floor(Math.random() * 5) + 6;
            pastDate.setMonth(randomNum2);
        } else if (option.toLowerCase().includes("2 years")) {
            pastDate = new Date();
            // pastDate.setFullYear(currentDate.getFullYear() - 2);
            const randomNum = Math.floor(Math.random() * 4) + 16;
            pastDate.setMonth(currentDate.getMonth() - randomNum);
        }
    } else {
        // return "Invalid option selected.";
        alert("something went wrong!!");
        location.reload(true);
    }
  
    return formatInjuryDate(pastDate);
  }
  
// Helper function to format the date as MM/DD/YYYY
function formatInjuryDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    // changing date
    let new_day = (Math.floor(Math.random() * 30) + 1).toString().padStart(2,"0");
    return `${month}/${new_day}/${year}`;
}
  
  
    
  

    

































