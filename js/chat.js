// Groq Chat Integration
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/v1/chat/completions';

class GroqChat {
    constructor() {
        this.initializeChat();
        this.attachEventListeners();
    }

    initializeChat() {
        // Create chat container if it doesn't exist
        if (!document.getElementById('groq-chat-container')) {
            const chatHTML = `
                <div id="groq-chat-container" class="chat-container">
                    <div class="chat-header">
                        <h3>Chat Assistant</h3>
                        <button id="chat-minimize">−</button>
                    </div>
                    <div class="chat-messages" id="chat-messages"></div>
                    <div class="chat-input-container">
                        <textarea id="chat-input" placeholder="Type your message..." rows="1"></textarea>
                        <button id="chat-send">Send</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', chatHTML);
        }

        // Add any required CSS variables
        document.documentElement.style.setProperty('--bg-deep-1', '#1a1a1a');
        document.documentElement.style.setProperty('--bg-deep-2', '#2a2a2a');
        document.documentElement.style.setProperty('--brand-teal', '#00796b');
    }

    attachEventListeners() {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('chat-send');
        // Groq Chat Integration (client-side)
        // NOTE: Exposing an API key in client-side JS is insecure. Prefer a backend proxy for production.
        const GROQ_API_KEY = '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';
        const GROQ_API_URL = 'https://api.groq.com/v1/chat/completions';

        class GroqChat {
            constructor() {
                this.initializeChat();
                this.attachEventListeners();
            }

            initializeChat() {
                if (!document.getElementById('groq-chat-container')) {
                    const chatHTML = `
                        <div id="groq-chat-container" class="chat-container">
                            <div class="chat-header">
                                <h3>Chat Assistant</h3>
                                <button id="chat-minimize">−</button>
                            </div>
                            <div class="chat-messages" id="chat-messages"></div>
                            <div class="chat-input-container">
                                <textarea id="chat-input" placeholder="Type your message..." rows="1"></textarea>
                                <button id="chat-send">Send</button>
                            </div>
                        </div>
                    `;
                    document.body.insertAdjacentHTML('beforeend', chatHTML);
                }

                // ensure CSS variables exist
                const style = document.documentElement.style;
                if (!style.getPropertyValue('--bg-deep-1')) {
                    style.setProperty('--bg-deep-1', '#1a1a1a');
                    style.setProperty('--bg-deep-2', '#2a2a2a');
                    style.setProperty('--brand-teal', '#00796b');
                }
            }

            attachEventListeners() {
                const chatInput = document.getElementById('chat-input');
                const sendButton = document.getElementById('chat-send');
                const minimizeButton = document.getElementById('chat-minimize');
                const chatContainer = document.getElementById('groq-chat-container');

                sendButton.addEventListener('click', () => this.sendMessage());

                chatInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendMessage();
                    }
                });

                minimizeButton.addEventListener('click', () => {
                    chatContainer.classList.toggle('minimized');
                    minimizeButton.textContent = chatContainer.classList.contains('minimized') ? '+' : '−';
                });

                chatInput.addEventListener('input', () => {
                    chatInput.style.height = 'auto';
                    chatInput.style.height = chatInput.scrollHeight + 'px';
                });
            }

            async sendMessage() {
                const chatInput = document.getElementById('chat-input');
                const sendButton = document.getElementById('chat-send');
                const message = chatInput.value.trim();
                if (!message) return;

                // show user's message immediately
                this.addMessage(message, 'user');

                // clear and disable while waiting
                chatInput.value = '';
                chatInput.disabled = true;
                sendButton.disabled = true;

                const typingId = this.showTypingIndicator();

                try {
                    const resp = await fetch(GROQ_API_URL, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${GROQ_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: 'openai/gpt-oss-20b',
                            messages: [
                                {
                                    role: 'system',
                                    content: "You are \"EmpowerBot\" — a friendly, helpful assistant that helps users with the website. Keep answers concise and polite."
                                },
                                { role: 'user', content: message }
                            ],
                            temperature: 0.7,
                            max_tokens: 1024,
                            top_p: 1,
                            stream: false
                        })
                    });

                    // remove typing indicator
                    this.removeTypingIndicator(typingId);

                    if (!resp.ok) {
                        const text = await resp.text();
                        throw new Error(`API error ${resp.status}: ${text}`);
                    }

                    const data = await resp.json();
                    const botText = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || 'Sorry, no response.';
                    this.addMessage(botText, 'assistant');

                } catch (err) {
                    console.error('Chat error', err);
                    this.removeTypingIndicator(typingId);
                    this.addMessage('Sorry — there was an error contacting the chat service.', 'assistant');
                } finally {
                    chatInput.disabled = false;
                    sendButton.disabled = false;
                    chatInput.focus();
                    chatInput.style.height = 'auto';
                }
            }

            showTypingIndicator() {
                const id = 'typing-' + Date.now();
                const html = `<div id="${id}" class="chat-message assistant-message typing-indicator"><span></span><span></span><span></span></div>`;
                const messages = document.getElementById('chat-messages');
                messages.insertAdjacentHTML('beforeend', html);
                messages.scrollTop = messages.scrollHeight;
                return id;
            }

            removeTypingIndicator(id) {
                const el = document.getElementById(id);
                if (el) el.remove();
            }

            addMessage(content, role) {
                const container = document.getElementById('chat-messages');
                const div = document.createElement('div');
                div.className = `chat-message ${role}-message`;
                div.innerHTML = this.formatMessage(content);
                container.appendChild(div);
                container.scrollTop = container.scrollHeight;
            }

            formatMessage(text) {
                if (!text) return '';
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const escaped = String(text)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                return escaped.replace(urlRegex, '<a href="$1" target="_blank">$1</a>').replace(/\n/g, '<br>');
            }
        }

        // Initialize chat when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            new GroqChat();
        });