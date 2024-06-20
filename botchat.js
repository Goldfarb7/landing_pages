
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
        "<b>Were you physically injured in an automobile accident?</b>",
        {
            1: {color:"blue", next:"yes2", text:"Yes"},
            2: {color:"blue", next:"no2", text:"No"}
        }
    ],

    yes2: [
        "<b>When did the accident occur?</b>",
        {
            1: {color:"blue",next:"yes3", text:"Within 1 Month"},
            2: {color:"blue",next:"yes3", text:"Within 1 Year"},
            3: {color:"blue",next:"yes3", text:"Within 2 Years"},
            4: {color:"blue",next:"yes3", text:"More Than 2 Years Ago"}
        }
    ],

    no2: [
        "<b>When did the accident occur?</b>",
        {
            1: {color:"blue",next:"yes3", text:"Within 1 Month"},
            2: {color:"blue",next:"yes3", text:"Within 1 Year"},
            3: {color:"blue",next:"yes3", text:"Within 2 Years"},
            4: {color:"blue",next:"yes3", text:"More Than 2 Years Ago"}
        }
    ],

    yes3: [
        "<b>Did the accident cause hospitalization, medical treatment, surgery or missed work?</b>",
        {
            1: {color:"blue",next:"yes4", text:"Yes"},
            2: {color:"blue",next:"no4", text:"No"}
        }
    ],

    yes4: [
        "<b>What best describes your type of injury?</b>",
        {
            1: {color:"blue",next:"yes5", text:"Traumatic Head Injury"},
            2: {color:"blue",next:"yes5", text:"Back, Neck, and Soft Tissue Injuries (including Whiplash)"},
            3: {color:"blue",next:"yes5", text:"Burns and Broken Bones"},
        }
    ],

    no4: [
        "<b>What best describes your type of injury?</b>",
        {
            1: {color:"blue",next:"yes5", text:"Traumatic Head Injury"},
            2: {color:"blue",next:"yes5", text:"Back, Neck, and Soft Tissue Injuries (including Whiplash)"},
            3: {color:"blue",next:"yes5", text:"Burns and Broken Bones"},
        }
    ],

    yes5: [
        "<b>What best describes the severity of your injuries?</b>",
        {
            1: {color:"blue",next:"yes6", text:"Minor to Moderate"},
            2: {color:"blue",next:"yes6", text:"Severe"},
            3: {color:"blue",next:"yes6", text:"Critical to Life-threatening"},
        }
    ],

    yes6: [
        "<b>Was a police report filed?</b>",
        {
            1: {color:"blue",next:"yes7", text:"Yes"},
            2: {color:"blue",next:"yes7", text:"No"},
        }
    ],

    yes7: [
        "<b>Were you at fault for the accident?</b>",
        {
            1: {color:"blue",next:"yes8", text:"Yes, the accident was my fault"},
            2: {color:"blue",next:"yes8", text:"No, the accident was not my fault"},
        }
    ],

    yes8: [
        "<b>Is an attorney helping you with your claim or have you already received compensation?</b>",
        {
            1: {color:"blue",next:"yes9", text:"Yes"},
            2: {color:"blue",next:"yes9", text:"No"},
        }
    ],

    yes9: [
        "<b>🎉Congratulations! 🎁</b>",
        "It looks like based on the info you submitted your accident may qualify for compensation!",
        "Tap the number below to speak to one of our friendly experts for more information on your free case evaluation.. The call takes less than 15 minutes!",
        {
            1: {color:"green",next:"callMe", text:"<b>+13214858331</b>"},
        }
    ],

}


async function chat(key, inResponseOf=null){
 
  if(key === "callMe"){
    gtag_report_conversion(); //Fire google analytics event
    fbq('track', 'Contact'); //Fire Meta businees event
    //setting calling number
    const mobileNo = document.getElementById("mobile-number").href;
    return window.open(mobileNo);
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
    s = ""
    Object.keys(msg).forEach(key => {
        //button value check (for final button value change i.e. alloted no. by ringba)
        let btnValue = msg[key]['next'] ==="callMe" ? document.getElementById("mobile-number").href.split(":").pop().trim() : msg[key]['text'];
        //creating button
        s+=`<button onclick="chat('${msg[key]['next']}', inResponseOf='${msg[key]['text']}')" class="${msg[key]['color']} btn">
               ${btnValue}
            </button> `
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









