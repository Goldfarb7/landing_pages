function getTwoYearsAgoFormatted() {
    let currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 2);
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const month = monthNames[currentDate.getMonth()];
    
    const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
                   (day % 10 === 2 && day !== 12) ? 'nd' :
                   (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
    
    return `${month} ${day}${suffix}, ${year}`;
}


const DB= {
    default: [
        "Hi 👋",
        "I’m Jane from Claim Injury Funds.",
        "Want to find out how much you’re entitled to? Tap Yes! 👇",
        {
            1: {color:"blue", next:"yes1", text:"Yes"}
        }
    ],

    yes1: [
        "Let me ask you a few quick questions to get started",
        "<b>Were you injured in an auto accident?</b>",
        {
            1: {color:"blue", next:"yes2", text:"Yes"},
            2: {color:"blue", next:"yes2", text:"No"}
        }
    ],

    yes2: [
        `<b>Did your auto accident occur after ${getTwoYearsAgoFormatted()}? </b>`,
        {
            1: {color:"blue",next:"yes3", text:"Yes"},
            2: {color:"blue",next:"yes3", text:"No"}
        }
    ],

    yes3: [
        "<b>Was the accident your fault?</b>",
        {
            1: {color:"blue",next:"yes4", text:"Yes"},
            2: {color:"blue",next:"yes4", text:"No"}
        }
    ],

    yes4: [
        "<b>Do you currently have a lawyer?</b>",
        {
            1: {color:"blue",next:"yes5", text:"Yes"},
            2: {color:"blue",next:"yes5", text:"No"},
            3: {color:"blue",next:"yes5", text:"Yes, but looking to change"}
        }
    ],

    yes5: [
        "<b>Fill out name and number to see how much your case is worth</b>",
        {
            1: {color:"blue", html:"<div class='cinput-container'><input id='uname' type='text' placeholder='Your Name' class='cuser-input'> </div>"},
            2: {color:"blue", html:"<div class='cinput-container'><input id='umobile' type='number' placeholder='Mobile No.' class='cuser-input'> </div>"},
            3: {color:"blue", next:"yes6", text:"Submit"},
        }
    ],

    yes6: [
        "<b>🎉Congratulations! 🎁</b>",
        "It looks like based on the info you submitted your accident may qualify for compensation!",
        "Tap the number below to speak to one of our friendly experts for more information on your free case evaluation.. The call takes less than 15 minutes!",
        {
            1: {color:"green",next:"callMe", text:"<b>+13214858331</b>"},
        }
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


function submitInfo(){
   let uname = document.getElementById('uname').value.trim();
   let umobile = document.getElementById('umobile').value.trim();
   if(uname.length > 1 && umobile.length > 9){
     //get user info here
     return true
   }
   else{
     return false
   }
}



async function chat(key, inResponseOf=null){

  if(!key){return}
 
  if(key === "callMe"){
    gtag_report_conversion(); //Fire google analytics event
    fbq('track', 'Contact'); //Fire Meta businees event
    //setting calling number
    const mobileNo = document.getElementById("mobile-number").href;
    return window.open(mobileNo);
  }

  if(key === "yes6"){
    let res = submitInfo();
    if(!res){
        alert("Enter Valid Details !!!");;
        return
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
  }


  let index = 0;
  let jadeId;
  for (const msg of msgs){
    scrollToBottom(); //scrolling to bottom
    await delay(1000);
    
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
            s += `<button onclick="chat('${msg[key]['next']}', inResponseOf='${msg[key]['text']}')" class="${msg[key]['color']} btn">
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





chat("default")









