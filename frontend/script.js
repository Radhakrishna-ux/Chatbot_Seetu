document.addEventListener("DOMContentLoaded", function () {
    // Get the landing container that should trigger navigation
    let navigateElement = document.getElementById("navigateChat");

    if (navigateElement) {
        navigateElement.addEventListener("click", function () {
            // Apply a fade-out effect before navigating
            document.body.style.transition = "opacity 0.5s ease-in-out";
            document.body.style.opacity = "0";
            setTimeout(() => {
                window.location.href = "Chat.html";
                // Redirect after fade-out
            }, 500);
        });
    }
    // Restore opacity when chat page loads
    document.body.style.opacity = "1";
})
document.addEventListener("DOMContentLoaded", function () {
    let chatBox = document.getElementById("chatbox");
    let userInput = document.getElementById("userInput");
    let sendBtn = document.getElementById("sentBtn");
    if (sendBtn) {
        sendBtn.addEventListener("click", function () {
            sendMessage();
        });
    }
    if (userInput) {
        userInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        let userText = userInput.value.trim();
        if (userText === "")
           
            return;
        // Append student message to chat
        appendMessage(userText, "student");

        console.log("sendMessage() function called!");
        
        
        console.log("User input:",userText);
        // send the message to FastAPI backend
        
         // Adjust URL based on your backend server
        fetch("https://chatbot-2-5b60.onrender.com/chat",{
            method: "POST",
            // using post instead of GET
            headers : {
                "Content-Type": "applicatiin/json",
                "Accept": "application/json"
            },
            body:JSON.stringify({message:userText})
            // send user input in the request body
        })

       
            .then(response => {
                if(!response.ok){
                    throw new Error(`HTTP error!Status:${response.status}`);
                }
                return response.json();
            } )
            .then(data =>{
                console.log("Received:", data);
                if(data && data.reply){
                    appendMessage(data.reply,"teacher");
                    // display bot reply
                }else{
                    appendMessage("No response from server .","teacher");
                }
            })
            .catch(error =>{
                console.error("Fetch error:",error);
                appendMessage("Error connecting to server.","teacher");
            });
                
             
        // Clear input field
        userInput.value = "";
    }

    function appendMessage(text, sender) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);

        let img = document.createElement("img");
        img.src = sender === "student" ? "Student1.png" : "teacher1.png";
        img.classList.add("chat-icon");

        let textDiv = document.createElement("div");
        textDiv.classList.add("message-text");
        // check if text contains a link
        textDiv.innerHTML = formatMessage(text);

        if (sender === "student") {
            messageDiv.appendChild(img);
            messageDiv.appendChild(textDive);
        } else {
            messageDiv.appendChild(img);
            messageDiv.appendChild(textDiv);
        }
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    function formatMessage(text){
        // regular expression to detect URLs
        let urlRegex= / (https? : \/\/[^\s]+)/g;
        // replace detected URLs with clickable links
        return text.replace(urlRegex,'<a href="$1" target="_black">$1</a>');
    }
});
