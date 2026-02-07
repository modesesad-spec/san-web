document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mainContent = document.getElementById('mainContent');
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingText = document.getElementById('loadingText');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const aiModeSelect = document.getElementById('aiMode');
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page');
    const logoutBtn = document.getElementById('logoutBtn');
    const clearChatBtn = document.getElementById('clearChat');
    const exportBtn = document.getElementById('exportBtn');
    const timeDisplay = document.getElementById('timeDisplay');
    const voiceToggle = document.getElementById('voiceToggle');
    const charCount = document.getElementById('charCount');
    const notificationList = document.getElementById('notificationList');
    
    // State
    let chatHistory = [];
    let isVoiceActive = false;
    let recognition = null;
    
    // Initialize
    setTimeout(() => {
        const loadingSteps = [
            "Loading neural network...",
            "Initializing AI modules...",
            "Connecting to RNY-Y core...",
            "Preparing interface...",
            "System ready!"
        ];
        
        let step = 0;
        const loadingInterval = setInterval(() => {
            if (step < loadingSteps.length) {
                loadingText.textContent = loadingSteps[step];
                step++;
            } else {
                clearInterval(loadingInterval);
                loadingScreen.style.display = 'none';
                mainContent.style.display = 'flex';
                
                // Show welcome notification
                showNotification('AI System initialized successfully', 'success');
                
                // Start clock
                updateClock();
                setInterval(updateClock, 1000);
                
                // Load saved chat
                loadChatHistory();
            }
        }, 800);
    }, 1000);
    
    // Set username
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user') || localStorage.getItem('rnyy_user') || 'User';
    usernameDisplay.textContent = username;
    
    // Update clock
    function updateClock() {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
    
    // Navigation
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            
            // Update active menu
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected page
            pages.forEach(p => p.classList.remove('active'));
            document.getElementById(page + 'Page').classList.add('active');
            
            if (page === 'history') {
                loadHistoryList();
            }
        });
    });
    
    // Send message
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        messageInput.value = '';
        updateCharCount();
        
        // Show typing indicator
        showTypingIndicator();
        
        // Generate AI response (simulated)
        setTimeout(() => {
            removeTypingIndicator();
            const aiResponse = generateAIResponse(message, aiModeSelect.value);
            addMessage(aiResponse, 'ai');
            
            // Save to history
            saveToHistory(message, aiResponse);
            
            // Scroll to bottom
            scrollToBottom();
        }, 1000 + Math.random() * 1000);
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-sender">${sender === 'user' ? usernameDisplay.textContent : 'RNY-Y AI'}</div>
                <div class="message-text">${formatMessage(text)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Format message (basic markdown)
    function formatMessage(text) {
        // Convert markdown-like syntax
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
        
        // Check for code blocks
        if (formatted.includes('```')) {
            formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, 
                '<pre><code class="language-$1">$2</code></pre>');
        }
        
        return formatted;
    }
    
    // Generate AI response (simulated)
    function generateAIResponse(userMessage, mode) {
        const responses = {
            assistant: [
                `I understand you're asking about "${userMessage}". Based on my analysis, I recommend a systematic approach. First, gather requirements, then prototype, test, and deploy.`,
                `That's an interesting question about "${userMessage}". Let me break it down: 1) Identify core components, 2) Design architecture, 3) Implement securely, 4) Test thoroughly.`,
                `Regarding "${userMessage}", here's my detailed response: The optimal solution involves multiple layers of security and efficiency considerations.`,
                `I've analyzed "${userMessage}". The solution requires careful planning. Would you like me to generate specific code or documentation?`
            ],
            hacking: [
                `Security analysis for "${userMessage}": Scanning for vulnerabilities... Detected potential attack vectors. Implementing countermeasures.`,
                `Penetration testing protocol initiated for "${userMessage}". Firewall bypass techniques available. Encryption methods: AES-256 recommended.`,
                `Target: "${userMessage}". Running security audit... 3 vulnerabilities found. Patching recommendations generated.`,
                `Cybersecurity mode active. For "${userMessage}", recommend: 1) Update all dependencies 2) Implement WAF 3) Regular security scans.`
            ],
            code: [
                `Generating code for "${userMessage}":\n\n\`\`\`javascript\n// Code solution\nfunction solveProblem() {\n    console.log("Implementation here");\n}\n\`\`\``,
                `Here's the script for "${userMessage}":\n\n\`\`\`python\ndef main():\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    main()\n\`\`\``,
                `Code template for "${userMessage}":\n\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Solution</title>\n</head>\n<body>\n    <!-- Implementation -->\n</body>\n</html>\n\`\`\``
            ],
            creative: [
                `Creative mode activated! For "${userMessage}", imagine a world where technology merges with art. The possibilities are endless!`,
                `✨ Creative spark! ✨\n\n"${userMessage}" inspires me to think beyond limits. Let's create something extraordinary together!`,
                `Innovation mode: "${userMessage}" could be transformed into a revolutionary concept. Think interactive, immersive, intelligent!`,
                `Artistic interpretation of "${userMessage}": Visualize data as colors, algorithms as music, code as poetry.`
            ]
        };
        
        const modeResponses = responses[mode] || responses.assistant;
        const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];
        
        // Add some randomness
        const randomFacts = [
            "\n\n*Did you know? RNY-Y AI processes information at quantum speeds.*",
            "\n\n*Pro tip: Use shift+enter for new lines in chat.*",
            "\n\n*System note: All conversations are encrypted end-to-end.*"
        ];
        
        return randomResponse + randomFacts[Math.floor(Math.random() * randomFacts.length)];
    }
    
    // Typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-sender">RNY-Y AI</div>
                <div class="message-text">
                    <span class="typing-dots">
                        <span>.</span><span>.</span><span>.</span>
                    </span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    
    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }
    
    // Scroll to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Character count
    function updateCharCount() {
        const length = messageInput.value.length;
        charCount.textContent = `${length}/2000`;
        charCount.style.color = length > 1900 ? '#f00' : '#8af';
    }
    
    messageInput.addEventListener('input', updateCharCount);
    
    // Send message events
    sendMessageBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
        
        // Auto-resize textarea
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Clear chat
    clearChatBtn.addEventListener('click', function() {
        if (confirm('Clear all chat messages?')) {
            chatMessages.innerHTML = `
                <div class="message ai-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-sender">RNY-Y AI</div>
                        <div class="message-text">
                            Chat cleared. How can I assist you today?
                        </div>
                        <div class="message-time">Just now</div>
                    </div>
                </div>
            `;
            
            showNotification('Chat cleared', 'success');
        }
    });
    
    // Export chat
    exportBtn.addEventListener('click', function() {
        const chatText = Array.from(chatMessages.querySelectorAll('.message-text'))
            .map(el => `${el.closest('.user-message') ? 'User' : 'AI'}: ${el.textContent}`)
            .join('\n\n');
        
        const blob = new Blob([`RNY-Y AI Chat Export\n${new Date().toLocaleString()}\n\n${chatText}`], 
            { type: 'text/plain' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rnyy-chat-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification('Chat exported successfully', 'success');
    });
    
    // Voice recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
            updateCharCount();
            voiceToggle.classList.remove('active');
            isVoiceActive = false;
        };
        
        recognition.onerror = function() {
            voiceToggle.classList.remove('active');
            isVoiceActive = false;
            showNotification('Voice recognition failed', 'error');
        };
        
        voiceToggle.addEventListener('click', function() {
            if (!isVoiceActive) {
                recognition.start();
                this.classList.add('active');
                isVoiceActive = true;
                showNotification('Listening... Speak now', 'warning');
            } else {
                recognition.stop();
                this.classList.remove('active');
                isVoiceActive = false;
            }
        });
    } else {
        voiceToggle.style.display = 'none';
    }
    
    // Save to history
    function saveToHistory(userMsg, aiMsg) {
        const historyItem = {
            id: Date.now(),
            user: userMsg,
            ai: aiMsg,
            timestamp: new Date().toISOString(),
            mode: aiModeSelect.value
        };
        
        chatHistory.push(historyItem);
        localStorage.setItem('rnyy_chat_history', JSON.stringify(chatHistory));
    }
    
    // Load chat history
    function loadChatHistory() {
        const saved = localStorage.getItem('rnyy_chat_history');
        if (saved) {
            chatHistory = JSON.parse(saved);
        }
    }
    
    // Load history list
    function loadHistoryList() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        if (chatHistory.length === 0) {
            historyList.innerHTML = '<div class="history-item"><p style="color: #8af; text-align: center;">No history yet</p></div>';
            return;
        }
        
        // Group by date
        const grouped = {};
        chatHistory.forEach(item => {
            const date = new Date(item.timestamp).toLocaleDateString();
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(item);
        });
        
        // Create list
        Object.entries(grouped).forEach(([date, items]) => {
            const dateDiv = document.createElement('div');
            dateDiv.className = 'history-item';
            
            const preview = items[items.length - 1].user;
            dateDiv.innerHTML = `
                <div class="history-date">${date} (${items.length} messages)</div>
                <div class="history-preview">${preview.substring(0, 100)}${preview.length > 100 ? '...' : ''}</div>
            `;
            
            dateDiv.addEventListener('click', function() {
                if (confirm('Load this conversation? Current chat will be cleared.')) {
                    // Clear current chat
                    chatMessages.innerHTML = '';
                    
                    // Load conversation
                    items.forEach(item => {
                        addMessage(item.user, 'user');
                        addMessage(item.ai, 'ai');
                    });
                    
                    // Switch to chat page
                    menuItems.forEach(i => i.classList.remove('active'));
                    document.querySelector('[data-page="chat"]').classList.add('active');
                    pages.forEach(p => p.classList.remove('active'));
                    document.getElementById('chatPage').classList.add('active');
                    
                    showNotification('Conversation loaded', 'success');
                }
            });
            
            historyList.appendChild(dateDiv);
        });
    }
    
    // Notifications
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const icons = {
            success: 'fa-check',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-icon ${type}">
                <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
                <span class="notification-time">Just now</span>
            </div>
        `;
        
        notificationList.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Logout
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('rnyy_user');
            window.location.href = 'index.html';
        }
    });
    
    // Clear notifications
    document.getElementById('clearNotif')?.addEventListener('click', function() {
        notificationList.innerHTML = '';
    });
    
    // Fullscreen toggle
    document.getElementById('fullscreenBtn')?.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(console.log);
            this.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            this.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });
    
    // Initial welcome message
    setTimeout(() => {
        if (chatMessages.children.length === 1) { // Only has welcome message
            addMessage("Try asking me anything! I can generate code, analyze security, brainstorm ideas, or answer questions.", 'ai');
        }
    }, 2000);
});