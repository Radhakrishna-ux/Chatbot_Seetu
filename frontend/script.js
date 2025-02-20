document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM is loaded");

    const userInput = document.getElementById("userInput");
    const navigateElement = document.getElementById("navigateChat");
    const sendBtn = document.getElementById("sendBtn"); //  Fixed ID
    const chatBox = document.getElementById("chatBox"); //  Fixed ID
    
    //  Function to append messages
    function appendMessage(message, sender) {
        if (!chatBox) {
            console.error("Error: chatBox element not found.");
            return;
        }
        
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.textContent = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    //  Define sendMessage after appendMessage
    window.sendMessage = function () {
        if (!userInput) {
            console.error("Error: userInput element not found.");
            return;
        }
       
        const userText = userInput.value.trim();
        if (userText === "") return;

        appendMessage(userText, "student"); // Now it exists
        console.log("sendMessage() function called with input:", userText);

        //  Send message to FastAPI backend
        fetch("https://chatbot-2-5b60.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ message: userText })
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.reply) {
                appendMessage(data.reply, "teacher");
            } else {
                appendMessage("No response from server.", "teacher");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            appendMessage("Error connecting to server.", "teacher");
        });

        //  Clear input field
        userInput.value = "";
    };

    //  Navigation transition effect
    if (navigateElement) {
        navigateElement.addEventListener("click", function () {
            document.body.style.transition = "opacity 0.5s ease-in-out";
            document.body.style.opacity = "0";
            setTimeout(() => {
                window.location.href = "chat.html";
            }, 500);
        });
    }

    //  Restore opacity on page load
    document.body.style.opacity = "1";

    //  Add event listener for the send button
    if (sendBtn) {
        sendBtn.addEventListener("click", sendMessage);
    }

    //  Add event listener for "Enter" key press
    if (userInput) {
        userInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                sendMessage();
       
            }
        });
    }
});










