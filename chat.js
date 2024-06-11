
const DB= {
    default: [
        "Hi👋",
        "I’m Jade from The Debt Bureau.",
        "Want to find out if you qualify to write off 50% of your credit card debt? Tap Yes!👇",
        {
            Yes:{color:"blue",next:"yes1"}
        }
    ],

    yes1: [
        "Okay great. Let me ask you 3 quick questions.",
        "Do you have over $15,000 in credit card debt? Tap Yes or No.",
        {
            Yes:{color:"blue",next:"yes2"},
            No:{color:"blue",next:"no2"}
        }
    ],

    yes2: [
        "Are you an American citizen?",
        {
            Yes:{color:"blue",next:"yes3"},
            No:{color:"blue",next:"no3"}
        }
    ],

    no2: [
        "Are you an American citizen?",
        {
            Yes:{color:"blue",next:"yes3"},
            No:{color:"blue",next:"no3"}
        }
    ],

    yes3: [
        "Are you keeping up with your Minimum Payments? Tap Yes or No.",
        {
            Yes:{color:"blue",next:"yes4"},
            No:{color:"blue",next:"no4"}
        }
    ],

    no3: [
        "Are you keeping up with your Minimum Payments? Tap Yes or No.",
        {
            Yes:{color:"blue",next:"yes4"},
            No:{color:"blue",next:"no4"}
        }
    ],

    yes4: [
        "🎉Congratulations!🎁",
        "You’ve just pre-qualified to write off up to 50% of your credit card debt.",
        "This will help put $1,000s back in your pocket!",
        "Tap the number below to speak to one of our friendly experts, to see how much of your credit card debt is eligible for immediate reduction. The call takes less than 15 minutes!",
        {
            485484343:{color:"green",next:"callMe"},
        }
    ],

    no4: [
        "🎉Congratulations!🎁",
        "You’ve just pre-qualified to write off up to 50% of your credit card debt.",
        "This will help put $1,000s back in your pocket!",
        "Tap the number below to speak to one of our friendly experts, to see how much of your credit card debt is eligible for immediate reduction. The call takes less than 15 minutes!",
        {
            485484343:{color:"green",next:"callMe"},
        }
    ],

}




async function chat(key, inResponseOf=null){
  let targetDiv = document.getElementById("chat");
  typing(show=true); //showing typing animation
  let msgs = DB[key]; //reading msgs from Db

  if(inResponseOf){
    removeAllButtons()
    //adding user response into chat
    targetDiv.innerHTML+=`
            <div class="reply-container">
                <div class="msgContainer">
                    <div class="msgDiv"><span class="user-msg">${inResponseOf}</span></div>
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
        // updateJade()
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
            // updateJade()
            targetDiv.innerHTML+=`
                <div class="msg-container">
                    <img class="jade" src="https://cdn.jsdelivr.net/gh/Goldfarb7/landing_pages/jade.jpg" alt="bot image">
                    <div class="msgContainer">
                       <div class="msg">
                          ${createButtons(msg)}
                       </div>
                    </div>
                </div>
            `
     }

    if (index === msgs.length - 1) {
        //This is the last iteration.
        console.log("last id", jadeId);
        document.getElementById(jadeId).style.visibility="visible";
      }

    index++;
     
  }
  typing(show=false); //hiding typing animation
  scrollToBottom(); //scrolling to bottom
}




function createButtons(msg){
    s = ""
    Object.keys(msg).forEach(key => {
        s+=`<button onclick="chat('${msg[key]['next']}', inResponseOf='${key}')" class="${msg[key]['color']} btn">
               ${key}
            </button> `
      });
    return s
}




function updateJade(){
    //to hide all jade/bot images so that only latest msg have image icon
    // let jadeImgs = Array.from(document.getElementById("chat").getElementsByClassName("jade"));
    // jadeImgs.forEach(img=>{
    //     img.style.visibility="hidden"
    // })
}



function generateRandomString(length) {
    return Math.random().toString(36).substring(2, 2 + length);
  }



function typing(show=true){
    if(show){
        // let jadeImgs = Array.from(document.getElementById("chat").getElementsByClassName("jade"));
        // jadeImgs.forEach(img=>{
        //     img.style.visibility="hidden"
        // });
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


chat("default")









