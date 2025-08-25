document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  // Add this helper function at the top inside DOMContentLoaded
  function generateSparkline(data, color = "#38bdf8") {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const width = 100;   // Sparkline width
    const height = 40;   // Sparkline height
    const step = width / (data.length - 1);

    let points = data
      .map((val, i) => {
        const x = i * step;
        const y = height - ((val - min) / (max - min)) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}">
      <polyline 
        points="${points}" 
        fill="none" 
        stroke="${color}" 
        stroke-width="2" 
        stroke-linecap="round"
        stroke-linejoin="round"
        class="sparkline-path"
      />
    </svg>
  `;
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("dashboardData");
    window.location.href = "login.html";
  });

  const user = localStorage.getItem("loggedInUser");
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // ✅ Dashboard Data with Trend Arrays
  const dashboardData = {
    username: "John",
    passengers: {
      total: 1240,
      newToday: 15,
      monthly: [120, 140, 200, 160, 180, 210], // last 6 months
    },
    sales: {
      revenue: "$12,500",
      growth: "+8%",
      monthlyRevenue: [9000, 11000, 12500, 13500, 12800, 14200],
    },
    analytics: {
      activeUsers: 320,
      bounceRate: "34%",
      dailyUsers: [280, 300, 310, 290, 330, 320, 340], // 7 days
    },
    engagement: {
      campaigns: 5,
      successRate: "72%",
      responses: [50, 75, 60, 90, 120], // dummy campaign responses
    },
    reporting: {
      reportsGenerated: 18,
      lastReport: "2 hrs ago",
      reportsOverTime: [5, 8, 12, 14, 16, 18], // growth trend
    },
  };
  localStorage.setItem("dashboardData", JSON.stringify(dashboardData));

  if (
    window.location.pathname.includes("home.html") ||
    window.location.pathname.endsWith("/") ||
    window.location.pathname === ""
  ) {
    const content = document.getElementById("content");
    const navBtns = document.querySelectorAll(".nav-btn");

    navBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const section = btn.getAttribute("data-section");
        loadSection(section);

        navBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    function loadSection(section) {
      switch (section) {
        case "home":
                content.innerHTML = `
            <h2>Welcome, ${dashboardData.username} 👋</h2>
            <div class="cards">
              <div class="card" data-type="passengers">
                <h3>Passengers <span class="label">(Monthly)</span></h3>
                <p>${dashboardData.passengers.total} total</p>
                <small>+${dashboardData.passengers.newToday} today</small>
                <div class="sparkline">
                  ${generateSparkline(dashboardData.passengers.monthly, "#38bdf8")}
                </div>
              </div>
              <div class="card" data-type="sales">
                <h3>Sales <span class="label">(Monthly)</span></h3>
                <p>${dashboardData.sales.revenue}</p>
                <small>${dashboardData.sales.growth} growth</small>
                <div class="sparkline">
                  ${generateSparkline(dashboardData.sales.monthlyRevenue, "#10b981")}
                </div>
              </div>
              <div class="card" data-type="analytics">
                <h3>Analytics <span class="label">(Daily)</span></h3>
                <p>${dashboardData.analytics.activeUsers} active users</p>
                <small>Bounce rate: ${dashboardData.analytics.bounceRate}</small>
                <div class="sparkline">
                  ${generateSparkline(dashboardData.analytics.dailyUsers, "#f59e0b")}
                </div>
              </div>
              <div class="card" data-type="engagement">
                <h3>Engagement <span class="label">(Campaign Responses)</span></h3>
                <p>${dashboardData.engagement.campaigns} campaigns</p>
                <small>Success: ${dashboardData.engagement.successRate}</small>
                <div class="sparkline">
                  ${generateSparkline(dashboardData.engagement.responses, "#ef4444")}
                </div>
              </div>
              <div class="card" data-type="reporting">
                <h3>Reporting <span class="label">(Reports Over Time)</span></h3>
                <p>${dashboardData.reporting.reportsGenerated} reports</p>
                <small>Last: ${dashboardData.reporting.lastReport}</small>
                <div class="sparkline">
                  ${generateSparkline(dashboardData.reporting.reportsOverTime, "#6366f1")}
                </div>
              </div>
            </div>
            `;

          setTimeout(() => {
            document.querySelectorAll(".sparkline-path").forEach(path => {
              const length = path.getTotalLength();
              path.style.strokeDasharray = length;
              path.style.strokeDashoffset = length;
              path.getBoundingClientRect(); // force reflow
              path.style.transition = "stroke-dashoffset 2s ease";
              path.style.strokeDashoffset = 0;
            });
          }, 100);
          document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    const type = card.getAttribute("data-type");

    switch (type) {
      case "passengers":
        window.location.href = "../layout/passenger.html";
        break;
      case "sales":
        window.location.href = "../layout/sales.html";
        break;
      case "analytics":
        window.location.href = "../layout/analytics.html";
        break;
      case "engagement":
        window.location.href = "../layout/engagement.html";
        break;
      case "reporting":
        window.location.href = "../layout/analytics.html"; // since analytics & reporting merged
        break;
    }
  });
});
          break;
        case "passengers":
          window.location.href = "../layout/passenger.html";
          break;
        case "sales":
          window.location.href = "sales.html";
          break;
        case "analytics":
          window.location.href = "analytics.html";
          break;
        case "engagement":
          window.location.href = "engagement.html";
          break;
        case "reporting":
          window.location.href = "reporting.html";
          break;
      }
    }

    loadSection("home");
  } else {
    // Other pages
    const navBtns = document.querySelectorAll(".nav-btn");
    navBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const section = btn.getAttribute("data-section");
        navBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        if (section === "home") {
          window.location.href = "home.html";
        } else if (
          section !==
          window.location.pathname.replace(".html", "").split("/").pop()
        ) {
          window.location.href = `${section}.html`;
        }
      });
    });
  }
});
