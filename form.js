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



function getTenDigitsFromPhoneNumber(phoneNumber) {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  // Return only the last 10 digits (if it's longer than 10)
  let ten = digits.slice(-10);
  return ten
}


function validateEmail(email) {
  // Define the regular expression for validating email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Test the email against the pattern
  return emailPattern.test(email);
}


//get data from html Form
/**
 * - gets form's input data when user clicks submit button
 */
const getFormData = ()=>{
    // console.log("tracker ran..");
    let userInputs = {}

    const form = document.getElementById("wf-form-Fill-Form");
    // for selected options
    const checks = form.querySelectorAll("input[type='radio']:checked");
    checks.forEach((checkbox)=>{
        console.log(`${checkbox.name} > ${checkbox.value}`);
        userInputs[checkbox.name] = checkbox.value;
    });


    // for name
    let first_name = document.getElementById("first_name").value || "";
    if(first_name.length === 0){
      alert("Enter First name !!");
      return
    }
    let last_name = document.getElementById("last_name").value || "";
    if(last_name.length === 0){
      alert("Enter Last name !!");
      return
    }
    userInputs["first_name"]  = first_name;
    userInputs["last_name"]  = last_name;


    // for mobile No.
    let phone_no = getTenDigitsFromPhoneNumber(document.getElementById("phone_number").value);
    if(phone_no.toString().length != 10){
      alert("Invalid Phone No.");
      return
    }
    userInputs["phone"] = phone_no;


    // for email
    let email_id = document.getElementById("email").value;
    if(validateEmail(email_id) === false){
       alert('Invalid Email ID.');
       return
    }
    userInputs["email"] = email_id;


    // zipcode
    let zip_code = Number(document.getElementById('zip_code').value) || 0;
    if(zip_code.toString().length != 5){
      alert("Invalid Zip Code !!");
      return
    }
    userInputs['zip_code'] = zip_code;


    // comments
    userInputs['comments'] = document.getElementById("comments").value || "NA";
    
    // trusted form URL
    userInputs['trustedform_cert_url'] = document.querySelectorAll("input[name='xxTrustedFormCertUrl']")[0].value || "";

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
    sendDataToLeadProsper(new_data);

};


document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("button-substitute").addEventListener("click",(e)=>{
      e.preventDefault();
      getFormData();
      
      //firing google ads/meta ads etc. events here
      fbq('track', 'form-submit'); //Fire Meta businees event
      console.log("fire Custom Events ran successfully!!");
  })
});



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

document.getElementById("zip_code").addEventListener("input",(e)=>{
   let zipcode = e.target.value;
   if(zipcode.length === 5){
     getCityAndState(zipcode).then(location => {
       console.log(location);
       //adding user city & state into global variables
       window.user_city = location.city;
       window.user_state = location. state;
     }).catch(error => console.log(error))
   }
})




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
      pastDate.setMonth(currentDate.getMonth() - 6);
  } else if (option.toLowerCase().includes("year")) {
      if (option.toLowerCase().includes("last year")) {
          pastDate = new Date();
          pastDate.setFullYear(currentDate.getFullYear() - 1);
      } else if (option.toLowerCase().includes("2 years")) {
          pastDate = new Date();
          pastDate.setFullYear(currentDate.getFullYear() - 2);
      }
  } else {
      return "Invalid option selected.";
  }

  return formatInjuryDate(pastDate);
}

// Helper function to format the date as MM/DD/YYYY
function formatInjuryDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  // changing date
  let new_day = Math.floor(Math.random() * 30) + 1;
  return `${month}/${new_day}/${year}`;
}


  



  

  


