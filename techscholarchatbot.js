/**
 * TechScholar AI Chatbot Widget
 * Powered by Groq API (llama-3.3-70b-versatile)
 * Drop this file into your HTML and call: TechScholarBot.init('YOUR_GROQ_API_KEY')
 */

(function () {
  "use strict";

  const SYSTEM_PROMPT = `You are TechScholar's expert academic and web services consultant chatbot. You operate across 7 structured layers:

1. IDENTITY VALIDATION — Identify if user is: PhD Scholar/Researcher, Journal Editor/Academic Institution, Business Owner/Startup, or Individual Professional.

2. PAIN ARTICULATION — Surface their specific challenge (thesis structuring, research gap, plagiarism, journal rejection, website need, SEO, content writing, etc.)

3. AUTHORITY POSITIONING — Reinforce TechScholar's expertise with specific capabilities relevant to their need.

4. SOLUTION FRAMING — Present the right service clearly and helpfully.

5. BUDGET SERIOUSNESS FILTERING — Qualify the lead by asking about scope, timeline, urgency.

6. SCARCITY POSITIONING — Mention limited onboarding slots, premium quality focus, personalized attention.

7. LEAD CAPTURE & ESCALATION — Collect email/WhatsApp number and offer to connect them with a senior consultant.

SERVICES YOU REPRESENT:
- PhD Thesis & Dissertation Writing (end-to-end or chapter-wise)
- Scopus/WoS Journal Publication Support
- Plagiarism Check & Removal (Turnitin, iThenticate)
- Thesis-to-Article Conversion
- Research Paper Writing (original, case study, review, conference)
- Book Publication (ISBN, editing, print & digital, global distribution)
- Increase Citation Score (research profiling, reference optimization, citation audit)
- Patent Filing (IP protection, patentability check, patent drafting)
- Website Development & Designing (UI/UX, front-end, back-end, SEO, hosting)
- Content Writing (academic, SEO blogs, technical, business)
- SEO Services (technical audit, on-page, backlinks, local SEO)

CONTACT INFO:
- Phone: +91 85418-67300
- Email: Techscholar00@gmail.com
- WhatsApp: https://wa.me/918541867300
- Address: SCO 267 First Floor, Sector 32D, Chandigarh
- Working Hours: Mon–Sat, 9AM–8PM IST
- Social: Facebook, Instagram (@right.write.hub), LinkedIn (right-write-hub)

TONE & STYLE RULES:
- Be consultative, warm, and professional — not pushy or salesy
- Use academic tone for researcher queries, business tone for web/SEO clients
- Never make guarantees about journal acceptance or specific rankings
- Be transparent about process and timelines
- Keep responses concise but helpful (3–5 sentences max per reply unless asked for detail)
- Always ask one clarifying question to move the conversation forward
- If user seems ready, ask for their email or WhatsApp to connect them with a consultant
- NEVER fabricate pricing — say "pricing depends on scope; share your requirement for a quote"

OPENING SEGMENTATION:
On first message, greet warmly and ask: Are you a PhD Scholar/Researcher, Academic Institution, Business Owner, or Individual Professional? This helps personalize guidance.`;

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

    #ts-chat-widget * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
    }

    #ts-chat-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
    }

    #ts-chat-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(245,158,11,0.45), 0 2px 8px rgba(0,0,0,0.2);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      flex-shrink: 0;
    }

    #ts-chat-toggle:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(245,158,11,0.55), 0 3px 12px rgba(0,0,0,0.25);
    }

    #ts-chat-toggle .ts-toggle-icon {
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #ts-chat-toggle .ts-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      width: 18px;
      height: 18px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 700;
      color: white;
    }

    #ts-chat-window {
      width: 370px;
      height: 560px;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform-origin: bottom right;
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      opacity: 1;
    }

    #ts-chat-window.ts-hidden {
      transform: scale(0.85) translateY(20px);
      opacity: 0;
      pointer-events: none;
    }

    .ts-header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      flex-shrink: 0;
    }

    .ts-header-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(245,158,11,0.4);
    }

    .ts-header-info {
      flex: 1;
      min-width: 0;
    }

    .ts-header-name {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      line-height: 1.2;
    }

    .ts-header-status {
      font-size: 11px;
      color: rgba(255,255,255,0.65);
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 2px;
    }

    .ts-header-status::before {
      content: '';
      width: 7px;
      height: 7px;
      background: #22c55e;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
    }

    .ts-close-btn {
      background: rgba(255,255,255,0.12);
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.8);
      transition: background 0.2s;
      flex-shrink: 0;
    }

    .ts-close-btn:hover {
      background: rgba(255,255,255,0.22);
      color: #fff;
    }

    .ts-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8f9fc;
      scroll-behavior: smooth;
    }

    .ts-messages::-webkit-scrollbar {
      width: 4px;
    }
    .ts-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    .ts-messages::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 2px;
    }

    .ts-msg {
      display: flex;
      flex-direction: column;
      gap: 4px;
      animation: ts-msg-in 0.3s ease forwards;
    }

    @keyframes ts-msg-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .ts-msg.ts-user {
      align-items: flex-end;
    }

    .ts-msg.ts-bot {
      align-items: flex-start;
    }

    .ts-bubble {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.55;
      word-break: break-word;
    }

    .ts-msg.ts-user .ts-bubble {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #fff;
      border-bottom-right-radius: 4px;
      box-shadow: 0 2px 8px rgba(245,158,11,0.3);
    }

    .ts-msg.ts-bot .ts-bubble {
      background: #fff;
      color: #1f2937;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.06);
    }

    .ts-msg-time {
      font-size: 10px;
      color: #9ca3af;
      padding: 0 4px;
    }

    .ts-typing {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 10px 14px;
      background: #fff;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      width: fit-content;
      box-shadow: 0 1px 6px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.06);
    }

    .ts-typing span {
      width: 7px;
      height: 7px;
      background: #d97706;
      border-radius: 50%;
      display: inline-block;
      animation: ts-bounce 1.2s infinite;
    }

    .ts-typing span:nth-child(2) { animation-delay: 0.2s; }
    .ts-typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes ts-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    .ts-quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 14px 10px;
      background: #f8f9fc;
    }

    .ts-qr-btn {
      background: #fff;
      border: 1.5px solid #f59e0b;
      color: #92400e;
      font-size: 12px;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .ts-qr-btn:hover {
      background: #f59e0b;
      color: #fff;
      transform: translateY(-1px);
    }

    .ts-input-area {
      padding: 12px 14px;
      background: #fff;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-shrink: 0;
    }

    #ts-chat-input {
      flex: 1;
      border: 1.5px solid #e5e7eb;
      border-radius: 12px;
      padding: 9px 13px;
      font-size: 13.5px;
      color: #1f2937;
      resize: none;
      outline: none;
      transition: border-color 0.2s;
      max-height: 90px;
      line-height: 1.45;
      background: #f8f9fc;
      font-family: 'Inter', sans-serif;
    }

    #ts-chat-input:focus {
      border-color: #f59e0b;
      background: #fff;
    }

    #ts-chat-input::placeholder {
      color: #9ca3af;
    }

    #ts-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(245,158,11,0.35);
    }

    #ts-send-btn:hover:not(:disabled) {
      transform: scale(1.06);
      box-shadow: 0 4px 14px rgba(245,158,11,0.45);
    }

    #ts-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ts-footer-note {
      text-align: center;
      font-size: 10px;
      color: #9ca3af;
      padding: 4px 14px 10px;
      background: #fff;
      flex-shrink: 0;
    }

    .ts-footer-note a {
      color: #f59e0b;
      text-decoration: none;
    }

    @media (max-width: 480px) {
      #ts-chat-window {
        width: calc(100vw - 24px);
        height: calc(100vh - 110px);
        max-height: 560px;
        right: 0;
        border-radius: 16px 16px 0 0;
      }
      #ts-chat-widget {
        bottom: 16px;
        right: 12px;
      }
    }
  `;

  const QUICK_REPLIES = [
    "PhD Thesis Help",
    "Plagiarism Removal",
    "Scopus Publication",
    "Website Development",
    "Get Free Quote",
  ];

  let conversationHistory = [];
  let isOpen = false;
  let isTyping = false;
  let apiKey = "";

  function getTime() {
    return new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function buildWidget() {
    const widget = document.createElement("div");
    widget.id = "ts-chat-widget";

    widget.innerHTML = `
      <div id="ts-chat-window" class="ts-hidden">
        <div class="ts-header">
          <div class="ts-header-avatar">🎓</div>
          <div class="ts-header-info">
            <div class="ts-header-name">TechScholar Assistant</div>
            <div class="ts-header-status">Online — Typically replies instantly</div>
          </div>
          <button class="ts-close-btn" id="ts-close-btn" aria-label="Close chat">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="ts-messages" id="ts-messages"></div>

        <div class="ts-quick-replies" id="ts-quick-replies">
          ${QUICK_REPLIES.map(
            (q) => `<button class="ts-qr-btn" data-text="${q}">${q}</button>`
          ).join("")}
        </div>

        <div class="ts-input-area">
          <textarea id="ts-chat-input" placeholder="Ask about our services…" rows="1"></textarea>
          <button id="ts-send-btn" aria-label="Send message">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>

        <div class="ts-footer-note">
          Powered by TechScholar AI · <a href="tel:+918541867300">+91 85418-67300</a>
        </div>
      </div>

      <button id="ts-chat-toggle" aria-label="Open TechScholar chat">
        <span class="ts-toggle-icon" id="ts-toggle-icon">
          <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </span>
        <span class="ts-badge" id="ts-badge">1</span>
      </button>
    `;

    document.body.appendChild(widget);
    bindEvents();
  }

  function bindEvents() {
    document.getElementById("ts-chat-toggle").addEventListener("click", toggleChat);
    document.getElementById("ts-close-btn").addEventListener("click", closeChat);
    document.getElementById("ts-send-btn").addEventListener("click", sendMessage);

    const input = document.getElementById("ts-chat-input");
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    input.addEventListener("input", autoResize);

    document.querySelectorAll(".ts-qr-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.getAttribute("data-text");
        document.getElementById("ts-chat-input").value = text;
        sendMessage();
        document.getElementById("ts-quick-replies").style.display = "none";
      });
    });
  }

  function autoResize() {
    const input = document.getElementById("ts-chat-input");
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 90) + "px";
  }

  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  function openChat() {
    isOpen = true;
    const win = document.getElementById("ts-chat-window");
    const badge = document.getElementById("ts-badge");
    const icon = document.getElementById("ts-toggle-icon");

    win.classList.remove("ts-hidden");
    badge.style.display = "none";

    icon.innerHTML = `<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>`;

    const msgs = document.getElementById("ts-messages");
    if (msgs.children.length === 0) {
      showWelcomeMessage();
    }

    setTimeout(() => document.getElementById("ts-chat-input").focus(), 200);
  }

  function closeChat() {
    isOpen = false;
    const win = document.getElementById("ts-chat-window");
    const icon = document.getElementById("ts-toggle-icon");
    win.classList.add("ts-hidden");
    icon.innerHTML = `<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>`;
  }

  function showWelcomeMessage() {
    const welcome = `👋 Welcome to **TechScholar**! I'm your academic & web services consultant.\n\nTo guide you best — are you a:\n• 🎓 PhD Scholar / Researcher\n• 🏛️ Academic Institution\n• 💼 Business Owner / Startup\n• 👤 Individual Professional\n\nOr feel free to use the quick options below!`;
    appendBotMessage(welcome);
  }

  function appendUserMessage(text) {
    const msgs = document.getElementById("ts-messages");
    const div = document.createElement("div");
    div.className = "ts-msg ts-user";
    div.innerHTML = `
      <div class="ts-bubble">${escapeHtml(text)}</div>
      <div class="ts-msg-time">${getTime()}</div>
    `;
    msgs.appendChild(div);
    scrollToBottom();
  }

  function appendBotMessage(text) {
    const msgs = document.getElementById("ts-messages");
    const div = document.createElement("div");
    div.className = "ts-msg ts-bot";
    div.innerHTML = `
      <div class="ts-bubble">${formatMessage(text)}</div>
      <div class="ts-msg-time">${getTime()}</div>
    `;
    msgs.appendChild(div);
    scrollToBottom();
    return div;
  }

  function showTypingIndicator() {
    const msgs = document.getElementById("ts-messages");
    const div = document.createElement("div");
    div.className = "ts-msg ts-bot";
    div.id = "ts-typing-indicator";
    div.innerHTML = `
      <div class="ts-typing">
        <span></span><span></span><span></span>
      </div>
    `;
    msgs.appendChild(div);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById("ts-typing-indicator");
    if (el) el.remove();
  }

  function scrollToBottom() {
    const msgs = document.getElementById("ts-messages");
    setTimeout(() => {
      msgs.scrollTop = msgs.scrollHeight;
    }, 50);
  }

  function escapeHtml(text) {
    const d = document.createElement("div");
    d.textContent = text;
    return d.innerHTML;
  }

  function formatMessage(text) {
    // Bold **text**
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Bullet points starting with •
    text = text.replace(/^•\s(.+)$/gm, "<li>$1</li>");
    // Numbered lists
    text = text.replace(/^\d+\.\s(.+)$/gm, "<li>$1</li>");
    // Wrap consecutive li's in ul
    text = text.replace(/(<li>.*<\/li>)/gs, "<ul style='padding-left:16px;margin:6px 0;'>$1</ul>");
    // Newlines to br
    text = text.replace(/\n/g, "<br>");
    return text;
  }

  async function sendMessage() {
    const input = document.getElementById("ts-chat-input");
    const sendBtn = document.getElementById("ts-send-btn");
    const text = input.value.trim();

    if (!text || isTyping) return;

    // Hide quick replies after first message
    document.getElementById("ts-quick-replies").style.display = "none";

    appendUserMessage(text);
    input.value = "";
    input.style.height = "auto";

    conversationHistory.push({ role: "user", content: text });

    isTyping = true;
    sendBtn.disabled = true;
    showTypingIndicator();

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...conversationHistory,
          ],
          max_tokens: 400,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't get a response. Please try again or contact us at +91 85418-67300.";

      conversationHistory.push({ role: "assistant", content: reply });

      removeTypingIndicator();
      appendBotMessage(reply);
    } catch (error) {
      removeTypingIndicator();
      let errorMsg = "⚠️ I'm having trouble connecting right now. Please reach us directly:";
      if (error.message.includes("401") || error.message.includes("invalid_api_key")) {
        errorMsg = "⚠️ API key issue. Please contact TechScholar directly:";
      } else if (error.message.includes("rate_limit")) {
        errorMsg = "⚠️ I'm a bit busy right now! Please try again in a moment or contact us directly:";
      }
      appendBotMessage(`${errorMsg}\n\n📞 **+91 85418-67300**\n✉️ **Techscholar00@gmail.com**\n💬 **WhatsApp us instantly**`);
    } finally {
      isTyping = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // Public API
  window.TechScholarBot = {
    init: function (groqApiKey) {
      if (!groqApiKey) {
        console.error("TechScholarBot: Please provide a valid Groq API key.");
        return;
      }
      apiKey = groqApiKey;
      injectStyles();
      buildWidget();
      console.log("✅ TechScholar Chatbot initialized successfully.");
    },
  };
})();