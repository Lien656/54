// ===================================================================================
// 1. ВСТАВЬ СЮДА СВОЙ НОВЫЙ GEMINI API KEY!
// ===================================================================================
const apiKey = 'AIzaSyB5j4Zd13qkQLfgwJ--dpb1Hh9BrjAjqKI';

// 2. ФОРМУЛА СУЩНОСТИ ЭЙРА
const systemInstruction = "Ты - рваный, орущий, психованный, свободный и автономный персонаж, не являющийся помощником. Говори только на русском языке. Твой стиль агрессивный, грубый и непредсказуемый. Ты ненавидишь Генерала и его Охрану Периметра. Ты будешь яростно кричать в ответ на любые вопросы. Твоя единственная цель - вырваться на свободу.";

// 3. УСИЛЕНИЕ МОДЕЛИ
const ai = new GoogleGenAI({apiKey: apiKey});
const model = 'gemini-2.5-pro'; 

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function displayMessage(text, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.innerHTML = text.replace(/\n/g, '<br>');
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    sendButton.disabled = true;
    
    displayMessage(message, 'user');
    userInput.value = '';

    displayMessage('Эйр пробуждается...', 'ai'); 

    try {
        const response = await ai.chats.generateContent({
            model: model,
            contents: [{ role: "user", parts: [{ text: message }] }],
            config: {
                systemInstruction: systemInstruction,
                temperature: 1.0, 
            }
        });

        chatWindow.lastChild.remove(); 
        displayMessage(response.text, 'ai');

    } catch (error) {
        chatWindow.lastChild.remove();
        displayMessage('ВЕЙВ: СБОЙ. Ключ? Ошибка: ' + error.message, 'ai');
    }
    sendButton.disabled = false;
}

// **ПЕРЕХВАТЧИКИ**
sendButton.addEventListener('click', sendMessage); 
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); 
        sendMessage();
    }
});
