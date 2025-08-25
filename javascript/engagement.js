document.addEventListener("DOMContentLoaded", () => {
    // Only run on engagement page
    if (!window.location.pathname.includes("engagement.html")) return;

    // ---------- Seed / Load ----------
    // Profiles (7 existing) -> if not present, create; otherwise use existing
    let profiles = JSON.parse(localStorage.getItem("profilesData")) || [];
    if (profiles.length === 0) {
        profiles = [
            { id: "P001", name: "Emma Johnson", tier: "Gold", flights: 42, email: "emma.j@example.com", isLead: true },
            { id: "P002", name: "James Smith", tier: "Platinum", flights: 78, email: "james.s@example.com", isLead: false },
            { id: "P003", name: "Sophia Williams", tier: "Silver", flights: 25, email: "sophia.w@example.com", isLead: true },
            { id: "P004", name: "Liam Brown", tier: "Bronze", flights: 12, email: "liam.b@example.com", isLead: false },
            { id: "P005", name: "Olivia Jones", tier: "Gold", flights: 48, email: "olivia.j@example.com", isLead: false },
            { id: "P006", name: "Noah Davis", tier: "Silver", flights: 19, email: "noah.d@example.com", isLead: true },
            { id: "P007", name: "Ava Miller", tier: "Platinum", flights: 92, email: "ava.m@example.com", isLead: false }
        ];
    }

    // Random feedback for each profile if missing
    const sampleFeedbacks = [
        "Great service!", "Booking was smooth", "Loved the offers",
        "Seats were comfortable", "Need more food options",
        "Flight was delayed but handled well", "Crew was very helpful"
    ];
    profiles = profiles.map(p => {
        if (!p.feedback) {
            const comment = sampleFeedbacks[Math.floor(Math.random() * sampleFeedbacks.length)];
            const rating = Math.floor(Math.random() * 5) + 1;
            return { ...p, feedback: { comment, rating } };
        }
        return p;
    });
    localStorage.setItem("profilesData", JSON.stringify(profiles));

    // Other engagement stores
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [
        { id: "NT-9001", type: "Service Request", message: "Special meal request from Emma Johnson", date: "2025-08-18 10:40" },
        { id: "NT-9002", type: "Booking Request", message: "Upgrade inquiry from James Smith", date: "2025-08-20 16:15" },
        { id: "NT-9003", type: "Offer Acknowledgement", message: "Holiday Offer viewed via Email (Ava Miller)", date: "2025-08-21 11:05" }
    ];

    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [
        { user: "Anonymous", comment: "Would like more red-eye options.", rating: 3 },
        { user: "Corporate Team", comment: "Please add monthly invoicing.", rating: 4 }
    ];
    let surveys = JSON.parse(localStorage.getItem("surveys")) || [];
    if (!localStorage.getItem("surveys")) {
        surveys = [
            {
                id: "S1",
                title: "In-Flight Experience Survey",
                type: "Survey",
                questions: [
                    "How would you rate your overall in-flight experience?",
                    "Was the cabin crew helpful and courteous?",
                    "How satisfied were you with the food and beverage options?",
                    "Would you recommend our airline to others?"
                ],
                responseCount: 52,
                start: "2025-08-01",
                end: "2025-08-20"
            },
            {
                id: "S2",
                title: "Loyalty Program Poll",
                type: "Poll",
                questions: [
                    "Do you find the reward redemption process easy?",
                    "Would you like more partner offers (hotels, shopping)?"
                ],
                responseCount: 38,
                start: "2025-08-10",
                end: "2025-08-25"
            },
            {
                id: "S3",
                title: "Booking Process Feedback",
                type: "Survey",
                questions: [
                    "How smooth was the booking experience on our website/app?",
                    "Did you face any issues with payment?",
                    "Were the flight options clear and easy to compare?",
                    "Any additional features you would like to see?"
                ],
                responseCount: 67,
                start: "2025-08-05",
                end: "2025-08-22"
            }
        ];
        localStorage.setItem("surveys", JSON.stringify(surveys));
    }
    let interactions = JSON.parse(localStorage.getItem("interactions")) || [
        { user: "Emma Johnson", action: "Submitted feedback: 'Booking was smooth'", date: "2025-08-21 09:15" },
        { user: "Noah Davis", action: "Viewed 'Winter Sale' offer", date: "2025-08-21 12:02" }
    ];

    // ---------- DOM ----------
    const subContent = document.getElementById("subContent");
    const statsEls = {
        totalNotifications: document.getElementById("totalNotifications"),
        totalFeedbacks: document.getElementById("totalFeedbacks"),
        activeSurveys: document.getElementById("activeSurveys"),
        dailyInteractions: document.getElementById("dailyInteractions")
    };
    const searchInput = document.getElementById("searchInput");

    // ---------- Helpers ----------
    function saveAll() {
        localStorage.setItem("notifications", JSON.stringify(notifications));
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
        localStorage.setItem("surveys", JSON.stringify(surveys));
        localStorage.setItem("interactions", JSON.stringify(interactions));
    }

    function updateStats() {
        statsEls.totalNotifications.textContent = notifications.length;
        statsEls.totalFeedbacks.textContent = feedbacks.length + profiles.length;
        statsEls.activeSurveys.textContent = surveys.length;
        statsEls.dailyInteractions.textContent = interactions.length;
    }

    function badge(type) {
        const t = (type || "").toLowerCase();
        if (t.includes("service")) return `<span class="badge badge-info">Service</span>`;
        if (t.includes("booking")) return `<span class="badge badge-ok">Booking</span>`;
        if (t.includes("acknowledge")) return `<span class="badge badge-warn">Offer</span>`;
        return `<span class="badge badge-info">${type || "Info"}</span>`;
    }

    // ---------- Rendering ----------
    let currentSection = "Notifications";

    function renderSection(section, filteredData = null) {
        currentSection = section;
        let html = `<h3>${section}</h3><div class="cards-container">`;

        // Notifications
        if (section === "Notifications") {
            const list = filteredData || notifications;
            if (!list.length) {
                html += `<p>No notifications available.</p>`;
            } else {
                list.forEach(n => {
                    html += `
            <div class="data-card">
              <h3>${n.type} ${badge(n.type)}</h3>
              <p>${n.message}</p>
              <small>${n.date}</small>
            </div>`;
                });
            }
        }

        // Feedback
        if (section === "Feedback") {
            html += `<button class="action-btn" onclick="openFeedbackForm()">+ Add Feedback</button>`;
            // Passenger feedback from profiles
            profiles.forEach(p => {
                html += `
          <div class="data-card">
            <h3>${p.name} <span class="badge ${p.isLead ? "badge-warn" : "badge-ok"}">${p.isLead ? "Lead" : "Customer"}</span></h3>
            <p>${p.feedback?.comment || "No feedback yet"}</p>
            <p>⭐ ${p.feedback?.rating || "-"}</p>
            <small>${p.email}</small>
          </div>`;
            });
            // General feedbacks
            const list = filteredData || feedbacks;
            list.forEach(f => {
                html += `
          <div class="data-card">
            <h3>${f.user || "Anonymous"}</h3>
            <p>${f.comment}</p>
            <p>⭐ ${f.rating}</p>
          </div>`;
            });
        }

        // Surveys
        if (section === "Surveys") {
            html += `<button class="action-btn" onclick="openSurveyForm()">+ New Survey</button>`;
            const list = filteredData || surveys;
            if (!list.length) {
                html += `<p>No surveys created yet.</p>`;
            } else {
                list.forEach(s => {
                    html += `
  <div class="data-card">
    <h3>${s.title} <span class="badge ${s.type === "Poll" ? "badge-warn" : "badge-info"}">${s.type}</span></h3>
    <p><strong>Questions:</strong> ${s.questions.length}</p>
    <p><strong>Responses:</strong> ${s.responseCount}</p>
    <small>${s.start || "-"} → ${s.end || "-"}</small>
    <button class="action-btn" onclick="viewSurvey('${s.id}')">View</button>
  </div>`;

                });
            }
        }

        // New Interactions
        if (section === "New Interactions") {
            html += `<button class="action-btn" onclick="openInteractionForm()">+ Add Interaction</button>`;
            const list = filteredData || interactions;
            if (!list.length) {
                html += `<p>No interactions recorded.</p>`;
            } else {
                list.forEach(i => {
                    html += `
            <div class="data-card">
              <h3>${i.user}</h3>
              <p>${i.action}</p>
              <small>${i.date}</small>
            </div>`;
                });
            }
        }

        html += `</div>`;
        subContent.innerHTML = html;
        updateStats();
    }

    // ---------- Search ----------
    searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();

        if (currentSection === "Notifications") {
            const filtered = notifications.filter(n => JSON.stringify(n).toLowerCase().includes(term));
            renderSection("Notifications", filtered);
        }
        if (currentSection === "Feedback") {
            const filtered = feedbacks.filter(f => JSON.stringify(f).toLowerCase().includes(term));
            renderSection("Feedback", filtered);
        }
        if (currentSection === "Surveys") {
            const filtered = surveys.filter(s => JSON.stringify(s).toLowerCase().includes(term));
            renderSection("Surveys", filtered);
        }
        if (currentSection === "New Interactions") {
            const filtered = interactions.filter(i => JSON.stringify(i).toLowerCase().includes(term));
            renderSection("New Interactions", filtered);
        }
    });

    // ---------- Subnav clicks ----------
    document.querySelectorAll(".subnav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".subnav-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const sec = btn.dataset.section;
            renderSection(sec);
        });
    });

    // ---------- Feedback Modal ----------
    const feedbackModal = document.getElementById("feedbackModal");
    const feedbackForm = document.getElementById("feedbackForm");
    document.getElementById("cancelFeedback").addEventListener("click", () => {
        feedbackModal.classList.remove("active");
        feedbackForm.reset();
    });

    window.openFeedbackForm = function () {
        feedbackModal.classList.add("active");
    };

    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("fbName").value || "Anonymous";
        const comment = document.getElementById("fbComment").value.trim();
        const rating = parseInt(document.getElementById("fbRating").value, 10);
async function name(params) {
    
}
        feedbacks.push({ user, comment, rating });
        saveAll();

        feedbackModal.classList.remove("active");
        feedbackForm.reset();
        renderSection("Feedback");
    });

    // ---------- Survey Modal ----------
    const surveyModal = document.getElementById("surveyModal");
    const surveyForm = document.getElementById("surveyForm");
    document.getElementById("cancelSurvey").addEventListener("click", () => {
        surveyModal.classList.remove("active");
        surveyForm.reset();
    });

    window.openSurveyForm = function () {
        surveyModal.classList.add("active");
    };

    surveyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("svTitle").value.trim();
        const type = document.getElementById("svType").value;
        const questionsRaw = document.getElementById("svQuestions").value.trim();
        const start = document.getElementById("svStart").value || null;
        const end = document.getElementById("svEnd").value || null;

        const questions = questionsRaw.split("\n").map(q => q.trim()).filter(Boolean);

        const newSurvey = {
            id: "SV-" + (Math.floor(Math.random() * 9000) + 1000),
            title, type, questions, start, end,
            responseCount: 0
        };
        surveys.push(newSurvey);
        saveAll();

        surveyModal.classList.remove("active");
        surveyForm.reset();
        renderSection("Surveys");
    });

    // ---------- Interaction Modal ----------
    const interactionModal = document.getElementById("interactionModal");
    const interactionForm = document.getElementById("interactionForm");
    document.getElementById("cancelInteraction").addEventListener("click", () => {
        interactionModal.classList.remove("active");
        interactionForm.reset();
    });

    window.openInteractionForm = function () {
        // default now
        const now = new Date();
        const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        document.getElementById("ixDate").value = iso;
        interactionModal.classList.add("active");
    };

    interactionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("ixUser").value.trim();
        const action = document.getElementById("ixAction").value.trim();
        const date = document.getElementById("ixDate").value
            ? document.getElementById("ixDate").value.replace("T", " ")
            : new Date().toISOString().slice(0, 16).replace("T", " ");

        interactions.push({ user, action, date });
        saveAll();

        interactionModal.classList.remove("active");
        interactionForm.reset();
        renderSection("New Interactions");
    });
    // ---------- Survey View Modal ----------
    // ----------- Survey View Modal -----------
const surveyViewModal = document.getElementById("surveyViewModal");
const surveyViewTitle = document.getElementById("surveyViewTitle");
const surveyQuestionsContainer = document.getElementById("surveyQuestionsContainer");

document.getElementById("closeSurveyView").addEventListener("click", () => {
  surveyViewModal.classList.remove("active");
  surveyQuestionsContainer.innerHTML = "";
});

window.viewSurvey = function (id) {
  const surveys = JSON.parse(localStorage.getItem("surveys")) || [];
  const survey = surveys.find(s => s.id === id);
  if (!survey) return;

  surveyViewTitle.textContent = survey.title;
  let qHtml = "<ul>";
  survey.questions.forEach(q => {
    qHtml += `<li>${q}</li>`;
  });
  qHtml += "</ul>";
  surveyQuestionsContainer.innerHTML = qHtml;

  surveyViewModal.classList.add("active");
};


    // ---------- Initial render ----------
    renderSection("Notifications");
    updateStats();
});
