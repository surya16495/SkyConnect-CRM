document.addEventListener("DOMContentLoaded", () => {
    // Redirect to passenger.html when button is clicked
    const goToPassengerBtn = document.getElementById("goToPassenger");
    if (goToPassengerBtn) {
        goToPassengerBtn.addEventListener("click", () => {
            window.location.href = "../layout/passenger.html";
        });
    }
    if (!window.location.pathname.includes("sales.html")) return;

    // Load leads from passenger localStorage (use 'leadsData' key)
    let leads = JSON.parse(localStorage.getItem("leadsData")) || [];

    let campaigns = JSON.parse(localStorage.getItem("campaigns")) || [
        { id: "CMP-1001", name: "Winter Sale", desc: "Discounts on Intl Flights", platform: "Email" }
    ];

    let offers = JSON.parse(localStorage.getItem("offers")) || [
        { id: "OFF-3001", name: "Holiday Offer", desc: "Flat 15% off", platform: "Web" }
    ];

    let acknowledgements = JSON.parse(localStorage.getItem("acknowledgements")) || [
        { offer: "Holiday Offer", platform: "Web", count: 120 },
        { offer: "Winter Sale", platform: "Email", count: 80 }
    ];

    const subnavBtns = document.querySelectorAll(".subnav-btn");
    const subContent = document.getElementById("subContent");
    const searchInput = document.getElementById("searchInput");

    // Modal
    const formModal = document.getElementById("formModal");
    const formTitle = document.getElementById("formTitle");
    const itemForm = document.getElementById("itemForm");
    const cancelForm = document.getElementById("cancelForm");

    let currentSection = "leads";
    let editIndex = null; // track which card is being edited

    // Render Section
    function renderSection(section, data) {
        currentSection = section;
        let html = `<h3>${section.charAt(0).toUpperCase() + section.slice(1)}</h3>`;
        html += `<div class="cards-container">`;

        if (section === "leads") {
            if (!data.length) {
                html += `<p>No leads available.</p>`;
            } else {
                data.forEach(lead => {
                    html += `
            <div class="data-card">
              <h3>${lead.name} <span class="status status-${lead.status.toLowerCase()}">${lead.status}</span></h3>
              <p><strong>Source:</strong> ${lead.source}</p>
              <p><strong>Interest:</strong> ${lead.interest}</p>
              <p><strong>Assigned:</strong> ${lead.assigned}</p>
              <button class="action-btn">Contact Lead</button>
            </div>`;
                });
            }
        }

        if (section === "campaigns") {
            html += `<button class="action-btn" onclick="openForm('campaigns')">+ New Campaign</button>`;
            data.forEach((c, i) => {
                html += `
          <div class="data-card">
            <h3>${c.name}</h3>
            <p>${c.desc}</p>
            <p><strong>Platform:</strong> ${c.platform}</p>
            <button class="action-btn" onclick="editItem('campaigns', ${i})">Edit</button>
            <button class="action-btn cancel-btn" onclick="deleteItem('campaigns', ${i})">Delete</button>
          </div>`;
            });
        }

        if (section === "offers") {
            html += `<button class="action-btn" onclick="openForm('offers')">+ New Offer</button>`;
            data.forEach((o, i) => {
                html += `
          <div class="data-card">
            <h3>${o.name}</h3>
            <p>${o.desc}</p>
            <p><strong>Platform:</strong> ${o.platform}</p>
            <button class="action-btn" onclick="editItem('offers', ${i})">Edit</button>
            <button class="action-btn cancel-btn" onclick="deleteItem('offers', ${i})">Delete</button>
          </div>`;
            });
        }

        if (section === "acknowledgements") {
            data.forEach(a => {
                html += `
          <div class="data-card">
            <h3>${a.offer}</h3>
            <p><strong>Platform:</strong> ${a.platform}</p>
            <p><strong>Interactions:</strong> ${a.count}</p>
          </div>`;
            });
        }

        html += `</div>`;
        subContent.innerHTML = html;
        updateStats();
    }

    // Stats Update
    function updateStats() {
        document.getElementById("totalLeads").textContent = leads.length;
        document.getElementById("activeCampaigns").textContent = campaigns.length;
        document.getElementById("activeOffers").textContent = offers.length;
        document.getElementById("ackCount").textContent = acknowledgements.reduce((a, b) => a + b.count, 0);
    }

    // Search
    searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        let filtered = [];
        if (currentSection === "leads") filtered = leads.filter(l => JSON.stringify(l).toLowerCase().includes(term));
        if (currentSection === "campaigns") filtered = campaigns.filter(c => JSON.stringify(c).toLowerCase().includes(term));
        if (currentSection === "offers") filtered = offers.filter(o => JSON.stringify(o).toLowerCase().includes(term));
        if (currentSection === "acknowledgements") filtered = acknowledgements.filter(a => JSON.stringify(a).toLowerCase().includes(term));

        renderSection(currentSection, filtered);
    });

    // Subnav Clicks
    subnavBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            subnavBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const section = btn.dataset.section;
            if (section === "leads") renderSection("leads", leads);
            if (section === "campaigns") renderSection("campaigns", campaigns);
            if (section === "offers") renderSection("offers", offers);
            if (section === "acknowledgements") renderSection("acknowledgements", acknowledgements);
        });
    });

    // Modal Functions
    window.openForm = function (type) {
        formModal.classList.add("active");
        formTitle.textContent = type === "campaigns" ? "New Campaign" : "New Offer";
        itemForm.setAttribute("data-type", type);
        editIndex = null;
        itemForm.reset();
    };

    window.editItem = function (type, index) {
        const data = type === "campaigns" ? campaigns : offers;
        const item = data[index];

        formModal.classList.add("active");
        formTitle.textContent = `Edit ${type === "campaigns" ? "Campaign" : "Offer"}`;
        itemForm.setAttribute("data-type", type);
        editIndex = index;

        document.getElementById("itemName").value = item.name;
        document.getElementById("itemDesc").value = item.desc;
        document.getElementById("itemPlatform").value = item.platform;
    };

    window.deleteItem = function (type, index) {
        if (type === "campaigns") {
            campaigns.splice(index, 1);
            localStorage.setItem("campaigns", JSON.stringify(campaigns));
            renderSection("campaigns", campaigns);
        } else {
            offers.splice(index, 1);
            localStorage.setItem("offers", JSON.stringify(offers));
            renderSection("offers", offers);
        }
    };

    cancelForm.addEventListener("click", () => {
        formModal.classList.remove("active");
        itemForm.reset();
    });

    itemForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = itemForm.getAttribute("data-type");
        const newItem = {
            id: (type === "campaigns" ? "CMP-" : "OFF-") + Math.floor(Math.random() * 10000),
            name: document.getElementById("itemName").value,
            desc: document.getElementById("itemDesc").value,
            platform: document.getElementById("itemPlatform").value
        };

        if (type === "campaigns") {
            if (editIndex !== null) {
                campaigns[editIndex] = newItem;
            } else {
                campaigns.push(newItem);
            }
            localStorage.setItem("campaigns", JSON.stringify(campaigns));
            renderSection("campaigns", campaigns);
        } else {
            if (editIndex !== null) {
                offers[editIndex] = newItem;
            } else {
                offers.push(newItem);
            }
            localStorage.setItem("offers", JSON.stringify(offers));
            renderSection("offers", offers);
        }

        formModal.classList.remove("active");
        itemForm.reset();
        editIndex = null;
    });

    // Initial render
    renderSection("leads", leads);
});
