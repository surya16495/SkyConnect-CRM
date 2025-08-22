document.addEventListener("DOMContentLoaded", () => {
    const analyticsContent = document.getElementById("analyticsContent");
    const subnavBtns = document.querySelectorAll(".subnav-btn");

    // Dummy Campaign Data
    let campaigns = JSON.parse(localStorage.getItem("campaigns")) || [
        { title: "Holiday Discounts", spend: 5000, revenue: 12000, status: "Ongoing" },
        { title: "New Route Promo", spend: 3000, revenue: 7000, status: "Closed" },
        { title: "Summer Deals", spend: 4000, revenue: 10000, status: "Upcoming" },
        { title: "Corporate Flyers", spend: 8000, revenue: 20000, status: "Ongoing" }
    ];
    localStorage.setItem("campaigns", JSON.stringify(campaigns));

    // Dummy Financial Data
    const financials = {
        monthlyRevenue: [12000, 15000, 18000, 20000, 25000, 23000, 27000, 30000, 32000, 35000, 37000, 40000],
        monthlySpend: [5000, 7000, 8000, 8500, 9000, 9500, 10000, 12000, 13000, 14000, 15000, 16000],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    };

    subnavBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            subnavBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderSection(btn.dataset.section);
        });
    });

    function renderSection(section) {
        analyticsContent.innerHTML = "";

        if (section === "customers") {
            const profiles = JSON.parse(localStorage.getItem("profilesData")) || [];
            const leads = JSON.parse(localStorage.getItem("leadsData")) || [];
            const active = profiles.filter(p => !p.isLead).length;
            const satisfaction = Math.floor(Math.random() * 20) + 80; // dummy %

            analyticsContent.innerHTML = `
        <h3>Customer Analytics</h3>
        <div class="report-card">
          <p><strong>Total Customers:</strong> ${profiles.length}</p>
          <p><strong>Leads:</strong> ${leads.length}</p>
          <p><strong>Active Customers:</strong> ${active}</p>
          <p><strong>Satisfaction Rate:</strong> ${satisfaction}%</p>
        </div>
        <div class="chart-container">
          <canvas id="customerChart"></canvas>
        </div>
      `;

            new Chart(document.getElementById("customerChart"), {
                type: "doughnut",
                data: {
                    labels: ["Leads", "Active Customers"],
                    datasets: [{
                        data: [leads.length, active],
                        backgroundColor: ["#f59e0b", "#10b981"],
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: "bottom" } }
                }
            });

        } else if (section === "campaigns") {
            analyticsContent.innerHTML = `
        <h3>Campaign & Spend Analytics</h3>
        <div class="chart-container">
          <canvas id="campaignChart"></canvas>
        </div>
      `;

            new Chart(document.getElementById("campaignChart"), {
                type: "bar",
                data: {
                    labels: campaigns.map(c => c.title),
                    datasets: [
                        {
                            label: "Spend ($)",
                            data: campaigns.map(c => c.spend),
                            backgroundColor: "#38bdf8"
                        },
                        {
                            label: "Revenue ($)",
                            data: campaigns.map(c => c.revenue),
                            backgroundColor: "#10b981"
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: { tooltip: { enabled: true }, legend: { position: "bottom" } },
                    animation: { duration: 1000 }
                }
            });

        } else if (section === "revenue") {
            analyticsContent.innerHTML += `
  <div class="chart-container">
  <h3>Year-over-Year Revenue Comparison</h3>
    <canvas id="yoyChart"></canvas>
  </div>
`;

            new Chart(document.getElementById("yoyChart"), {
                type: "bar",
                data: {
                    labels: financials.labels,
                    datasets: [
                        {
                            label: "2023 Revenue ($)",
                            data: financials.monthlyRevenue.map(v => v * 0.8), // dummy past year ~20% lower
                            backgroundColor: "#f59e0b"
                        },
                        {
                            label: "2024 Revenue ($)",
                            data: financials.monthlyRevenue,
                            backgroundColor: "#38bdf8"
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: { tooltip: { enabled: true }, legend: { position: "bottom" } },
                    animation: { duration: 1000 }
                }
            });

        } else if (section === "reports") {
            analyticsContent.innerHTML = `
    <h3>Reports & Insights</h3>
    <div class="report-card">
      <h3>Passenger Overview</h3>
      <p>1240 passengers, 87% satisfaction, 42 pending requests.</p>
      <button class="view-report-btn" data-report="passenger">View Report</button>
    </div>
    <div class="report-card">
      <h3>Sales Insights</h3>
      <p>Leads: 150, Campaigns: ${campaigns.length}, Avg Offer Acceptance: 65%.</p>
      <button class="view-report-btn" data-report="sales">View Report</button>
    </div>
    <div class="report-card">
      <h3>Engagement Updates</h3>
      <p>72% campaign success rate, 300+ survey responses this month.</p>
      <button class="view-report-btn" data-report="engagement">View Report</button>
    </div>
    <div class="report-card">
      <h3>Financial Summary</h3>
      <p>Annual revenue growth +12%, ROI across campaigns ~ 250%.</p>
      <button class="view-report-btn" data-report="financial">View Report</button>
    </div>
  `;

            attachReportEvents();
        }
    }
    function attachReportEvents() {
  const btns = document.querySelectorAll(".view-report-btn");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.report;
      openReportModal(type);
    });
  });
}

function openReportModal(type) {
  let title = "", desc = "";

  switch(type) {
    case "passenger":
      title = "Passenger Overview Report";
      desc = `
        <p><strong>Total Passengers:</strong> 1240</p>
        <p><strong>New Today:</strong> 15</p>
        <p><strong>Satisfaction Rate:</strong> 87%</p>
        <p><strong>Pending Requests:</strong> 42</p>
        <p>This report helps management monitor overall passenger growth and service quality trends.</p>
      `;
      break;
    case "sales":
      title = "Sales Insights Report";
      desc = `
        <p><strong>Total Leads:</strong> 150</p>
        <p><strong>Campaigns Active:</strong> ${campaigns.length}</p>
        <p><strong>Average Offer Acceptance:</strong> 65%</p>
        <p>Provides visibility into sales funnel health and effectiveness of campaigns.</p>
      `;
      break;
    case "engagement":
      title = "Customer Engagement Report";
      desc = `
        <p><strong>Campaign Success Rate:</strong> 72%</p>
        <p><strong>Survey Responses:</strong> 300+</p>
        <p><strong>New Feedback Today:</strong> 45</p>
        <p>Tracks how customers interact with campaigns, offers, and surveys.</p>
      `;
      break;
    case "financial":
      title = "Financial Summary Report";
      desc = `
        <p><strong>Annual Revenue Growth:</strong> +12%</p>
        <p><strong>ROI Across Campaigns:</strong> ~250%</p>
        <p><strong>Monthly Average Spend:</strong> $10,500</p>
        <p>Helps leadership evaluate overall financial health, campaign performance, and ROI trends.</p>
      `;
      break;
  }

  // Inject modal
  const modal = document.createElement("div");
  modal.className = "report-modal-overlay active";
  modal.innerHTML = `
    <div class="report-modal">
      <button class="modal-close">Close</button>
      <h3>${title}</h3>
      ${desc}
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".modal-close").addEventListener("click", () => {
    modal.remove();
  });
}


    // Load default
    renderSection("customers");
});
