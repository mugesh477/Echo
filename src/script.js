let prompt=document.querySelector("#prompt")
let chatContainer=document.querySelector(".chat-container")
let imagebtn=document.querySelector("#image")
let imageinput=document.querySelector("#imageinput")
let removeImageBtn=document.querySelector("#removeImage")
 
const API_URL = "http://localhost:3000/api/chat";



const imageIcon = document.querySelector("#image img");
const defaultImageIcon = imageIcon.src;
 
let user = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};
 
// ─── Generate Response ────────────────────────────────────────
async function genereateResponse(aiChatBox) {
 
    let text = aiChatBox.querySelector(".ai-chat-area")
 
    let parts = []
 
    if (user.file.data) {
        parts.push({
            inline_data: {
                mime_type: user.file.mime_type,
                data: user.file.data
            }
        })
    }
 
    parts.push({ text: user.message })
 
    let RequestOption = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{ parts }]
        })
    };
 
    try {
        let response = await fetch(API_URL, RequestOption);
 
        if (!response.ok) {
            text.textContent = " Please try again in a few seconds.";
            return;
        }
 
        let data = await response.json();
 
        const apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
 
        if (!apiResponse) {
            text.textContent = "No response received.";
            return;
        }
 
        text.textContent = apiResponse
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/#{1,6}\s?/g, "")
            .replace(/\*/g, "")
            .trim();
 
    } catch (error) {
        console.error(error);
        text.textContent = "Something went wrong. Please try again.";
 
    } finally {
        // ✅ always reset - whether success, error, or busy
        imageIcon.src = defaultImageIcon;
        user.file = { data: null, mime_type: null };
        imageinput.value = "";
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    }
}
 
// ─── Create Chat Box ──────────────────────────────────────────
function createChatBox(html, classes) {
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}
 
// ─── Handle Chat Response ─────────────────────────────────────
function handlechatResponse(message) {
    user.message = message
 
    // show image in user bubble if uploaded
    let imageHtml = ""
    if (user.file.data) {
        imageHtml = `<img src="data:${user.file.mime_type};base64,${user.file.data}" 
                    style="width:150px;border-radius:10px;display:block;margin-bottom:8px;" 
                    alt="uploaded image">`
    }
 
    let html = `<img
                src="./assests/user-profile.png"
                alt="User"
                id="userImage"
                width="60"
            >
            <div class="user-chat-area">
                ${imageHtml}
                ${user.message}
            </div>`
 
    prompt.value = ""
    let userChatBox = createChatBox(html, "user-chat-box")
    chatContainer.appendChild(userChatBox)
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" })
 
    setTimeout(() => {
        let html = `<img
                src="./assests/chat-bot-profile.png"
                alt="AI"
                id="aiImage"
                width="70"
            >
            <div class="ai-chat-area">
                <img src="./assests/loading.webp" alt="" class="loading" width="50px">
            </div>`
        let aiChatBox = createChatBox(html, "ai-chat-box")
        chatContainer.appendChild(aiChatBox)
        genereateResponse(aiChatBox)
    }, 600)
}
 
// ─── Enter Key ───────────────────────────────────────────────
prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        e.preventDefault()
        handlechatResponse(prompt.value)
    }
})
 
// ─── Image Upload ─────────────────────────────────────────────
imageinput.addEventListener("change", () => {
    const file = imageinput.files[0]
    if (!file) return
    let reader = new FileReader()
    reader.onload = (e) => {
        user.file.data = e.target.result.split(",")[1]
        user.file.mime_type = file.type
        // ✅ show selected image inside button
        imageIcon.src = e.target.result;
        console.log("Image ready:", file.name)
    }
    reader.readAsDataURL(file)
})
 
// ─── Image Button Click ───────────────────────────────────────
imagebtn.addEventListener("click", () => {
    imagebtn.querySelector("input").click()
})
 
// ─── Submit Button ────────────────────────────────────────────
const submitBtn = document.querySelector("#submit");
submitBtn.addEventListener("click", () => {
    if (prompt.value.trim() !== "") {
        handlechatResponse(prompt.value);
    }
});



const themeToggle =
document.querySelector("#themeToggle");

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeToggle.textContent="☀️";
    }else{
        themeToggle.textContent="🌙";
    }

});