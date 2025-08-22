document.addEventListener("DOMContentLoaded", () => {
  // Only run if we're on the passenger page
  if (window.location.pathname.includes("passenger.html")) {
    // Initialize flight data in localStorage if not exists
    let flightData = JSON.parse(localStorage.getItem("flightData"));
    if (!flightData) {
      flightData = [
        { id: "FL-7890", from: "JFK", to: "LHR", via: "", date: "2023-11-15", time: "14:30", duration: "7h 15m", status: "Scheduled" },
        { id: "FL-7891", from: "LAX", to: "DXB", via: "", date: "2023-11-18", time: "08:45", duration: "16h 30m", status: "Scheduled" },
        { id: "FL-7892", from: "ORD", to: "CDG", via: "LHR", date: "2023-11-20", time: "16:20", duration: "8h 45m", status: "Scheduled" },
        { id: "FL-7893", from: "DFW", to: "HNL", via: "", date: "2023-10-05", time: "11:15", duration: "8h 10m", status: "Completed" },
        { id: "FL-7894", from: "SFO", to: "SIN", via: "HKG", date: "2023-11-25", time: "22:10", duration: "17h 20m", status: "Delayed" },
        { id: "FL-7895", from: "ATL", to: "FRA", via: "", date: "2023-12-01", time: "13:40", duration: "9h 5m", status: "Scheduled" },
        { id: "FL-7896", from: "SEA", to: "NRT", via: "", date: "2023-11-28", time: "09:25", duration: "11h 15m", status: "Cancelled" }
      ];
      localStorage.setItem("flightData", JSON.stringify(flightData));
    }

    // Store leads dummy data in localStorage if not present
    if (!localStorage.getItem("leadsData")) {
      const leadsData = [
        { id: "LD-1001", name: "Noah Davis", source: "Web Search", interest: "Business Class", status: "New", assigned: "John M." },
        { id: "LD-1002", name: "Ava Miller", source: "Social Media", interest: "First Class", status: "Contacted", assigned: "Sarah K." },
        { id: "LD-1003", name: "William Wilson", source: "Referral", interest: "Economy", status: "Qualified", assigned: "Mike T." },
        { id: "LD-1004", name: "Isabella Taylor", source: "Travel Fair", interest: "Premium Economy", status: "New", assigned: "John M." },
        { id: "LD-1005", name: "Mason Anderson", source: "Web Ad", interest: "Business Class", status: "Contacted", assigned: "Sarah K." },
        { id: "LD-1006", name: "Charlotte Thomas", source: "Email Campaign", interest: "First Class", status: "Qualified", assigned: "Mike T." }
      ];
      localStorage.setItem("leadsData", JSON.stringify(leadsData));
    }

    // Modal elements
    const editFlightModal = document.getElementById("editFlightModal");
    const flightForm = document.getElementById("flightForm");
    const cancelEditBtn = document.getElementById("cancelEdit");
    let currentFlightId = null;

    // Open modal to edit flight
    function openEditFlightModal(flightId) {
      const flight = flightData.find(f => f.id === flightId);
      if (!flight) return;

      currentFlightId = flightId;
      document.getElementById("flightId").value = flight.id;
      document.getElementById("flightFrom").value = flight.from;
      document.getElementById("flightTo").value = flight.to;
      document.getElementById("flightVia").value = flight.via;
      document.getElementById("flightDate").value = flight.date;
      document.getElementById("flightTime").value = flight.time;
      document.getElementById("flightDuration").value = flight.duration;

      editFlightModal.classList.add("active");
    }

    // Close modal
    function closeEditFlightModal() {
      editFlightModal.classList.remove("active");
      currentFlightId = null;
    }

    // Save flight changes
    flightForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!currentFlightId) return;

      const flightIndex = flightData.findIndex(f => f.id === currentFlightId);
      if (flightIndex === -1) return;

      // Get original flight to check for time changes
      const originalFlight = flightData[flightIndex];

      // Update flight data
      flightData[flightIndex] = {
        ...flightData[flightIndex],
        from: document.getElementById("flightFrom").value,
        to: document.getElementById("flightTo").value,
        via: document.getElementById("flightVia").value,
        date: document.getElementById("flightDate").value,
        time: document.getElementById("flightTime").value,
        duration: document.getElementById("flightDuration").value
      };

      // Check if time changed and update status to Delayed if needed
      if ((originalFlight.time !== flightData[flightIndex].time ||
        originalFlight.date !== flightData[flightIndex].date) &&
        flightData[flightIndex].status !== "Cancelled") {
        flightData[flightIndex].status = "Delayed";
      }

      // Save to localStorage
      localStorage.setItem("flightData", JSON.stringify(flightData));

      // Re-render flights
      renderSection('flights', flightData);

      // Close modal
      closeEditFlightModal();
    });

    // Cancel edit
    cancelEditBtn.addEventListener("click", closeEditFlightModal);

    // Close modal when clicking outside
    editFlightModal.addEventListener("click", (e) => {
      if (e.target === editFlightModal) {
        closeEditFlightModal();
      }
    });

    // Cancel a flight
    function cancelFlight(flightId) {
      const flightIndex = flightData.findIndex(f => f.id === flightId);
      if (flightIndex === -1) return;

      flightData[flightIndex].status = "Cancelled";
      localStorage.setItem("flightData", JSON.stringify(flightData));
      renderSection('flights', flightData);
    }

    // Dummy Data for other sections
    const passengerData = {
      profiles: [
        { id: 1, name: "Emma Johnson", tier: "Gold", flights: 42, email: "emma.j@example.com", phone: "+1-555-0123", status: "Active" },
        { id: 2, name: "James Smith", tier: "Platinum", flights: 78, email: "james.s@example.com", phone: "+1-555-0124", status: "Active" },
        { id: 3, name: "Sophia Williams", tier: "Silver", flights: 25, email: "sophia.w@example.com", phone: "+1-555-0125", status: "Active" },
        { id: 4, name: "Liam Brown", tier: "Bronze", flights: 12, email: "liam.b@example.com", phone: "+1-555-0126", status: "Inactive" },
        { id: 5, name: "Olivia Jones", tier: "Gold", flights: 48, email: "olivia.j@example.com", phone: "+1-555-0127", status: "Active" },
        { id: 6, name: "Noah Davis", tier: "Silver", flights: 19, email: "noah.d@example.com", phone: "+1-555-0128", status: "Active" },
        { id: 7, name: "Ava Miller", tier: "Platinum", flights: 92, email: "ava.m@example.com", phone: "+1-555-0129", status: "Active" },
        { id: 8, name: "William Wilson", tier: "Bronze", flights: 8, email: "william.w@example.com", phone: "+1-555-0130", status: "Inactive" }
      ],
      leads: [
        { id: "LD-1001", name: "Noah Davis", source: "Web Search", interest: "Business Class", status: "New", assigned: "John M." },
        { id: "LD-1002", name: "Ava Miller", source: "Social Media", interest: "First Class", status: "Contacted", assigned: "Sarah K." },
        { id: "LD-1003", name: "William Wilson", source: "Referral", interest: "Economy", status: "Qualified", assigned: "Mike T." },
        { id: "LD-1004", name: "Isabella Taylor", source: "Travel Fair", interest: "Premium Economy", status: "New", assigned: "John M." },
        { id: "LD-1005", name: "Mason Anderson", source: "Web Ad", interest: "Business Class", status: "Contacted", assigned: "Sarah K." },
        { id: "LD-1006", name: "Charlotte Thomas", source: "Email Campaign", interest: "First Class", status: "Qualified", assigned: "Mike T." }
      ],
      bookings: [
        { id: "BK-5501", passenger: "Emma Johnson", flight: "JFK to LHR", date: "2023-11-15", class: "Business", status: "Confirmed", price: "$2,450" },
        { id: "BK-5502", passenger: "James Smith", flight: "LAX to DXB", date: "2023-11-18", class: "First", status: "Confirmed", price: "$5,320" },
        { id: "BK-5503", passenger: "Sophia Williams", flight: "ORD to CDG", date: "2023-11-20", class: "Premium Economy", status: "Pending", price: "$1,580" },
        { id: "BK-5504", passenger: "Liam Brown", flight: "DFW to HNL", date: "2023-10-05", class: "Economy", status: "Completed", price: "$620" },
        { id: "BK-5505", passenger: "Olivia Jones", flight: "SFO to SIN", date: "2023-11-25", class: "Business", status: "Confirmed", price: "$3,850" },
        { id: "BK-5506", passenger: "Noah Davis", flight: "ATL to FRA", date: "2023-12-01", class: "Premium Economy", status: "Confirmed", price: "$1,720" }
      ],
      requests: [
        { id: "SR-3001", passenger: "Emma Johnson", type: "Special Meal", date: "2023-11-10", status: "Completed", assigned: "Catering Team" },
        { id: "SR-3002", passenger: "James Smith", type: "Seat Upgrade", date: "2023-11-12", status: "In Progress", assigned: "Ground Staff" },
        { id: "SR-3003", passenger: "Sophia Williams", type: "Baggage Query", date: "2023-11-14", status: "New", assigned: "Not Assigned" },
        { id: "SR-3004", passenger: "Liam Brown", type: "Flight Change", date: "2023-10-01", status: "Completed", assigned: "Booking Team" },
        { id: "SR-3005", passenger: "Olivia Jones", type: "VIP Service", date: "2023-11-20", status: "In Progress", assigned: "VIP Concierge" },
        { id: "SR-3006", passenger: "Noah Davis", type: "Special Assistance", date: "2023-11-22", status: "New", assigned: "Not Assigned" }
      ],
      programs: [
        { name: "Frequent Flyer", members: 850, status: "Active", renews: "2024-01-15" },
        { name: "Business Elite", members: 120, status: "Active", renews: "2024-02-28" },
        { name: "Student Traveler", members: 315, status: "Active", renews: "2023-12-10" },
        { name: "Family Package", members: 240, status: "Active", renews: "2024-03-22" },
        { name: "Senior Comfort", members: 180, status: "Upcoming", renews: "2024-05-05" },
        { name: "Corporate Plus", members: 95, status: "Active", renews: "2024-04-15" }
      ]
    };

    // Store all passengerData sections in localStorage for use in other modules
    localStorage.setItem("profilesData", JSON.stringify(passengerData.profiles));
    localStorage.setItem("leadsData", JSON.stringify(passengerData.leads));
    localStorage.setItem("bookingsData", JSON.stringify(passengerData.bookings));
    localStorage.setItem("requestsData", JSON.stringify(passengerData.requests));
    localStorage.setItem("programsData", JSON.stringify(passengerData.programs));

    const subnavBtns = document.querySelectorAll(".subnav-btn");
    const subContent = document.getElementById("subContent");
    const searchInput = document.getElementById("searchInput");
    let currentView = 'cards'; // Default view

    // Function to render content based on section
    function renderSection(section, data) {
      let html = `
        <div class="view-toggle">
          <button class="toggle-btn ${currentView === 'cards' ? 'active' : ''}" data-view="cards">Cards View</button>
          <button class="toggle-btn ${currentView === 'list' ? 'active' : ''}" data-view="list">List View</button>
        </div>
        <h3>${section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
      `;

      if (currentView === 'cards') {
        html += renderCardsView(section, data);
      } else {
        html += renderListView(section, data);
      }

      subContent.innerHTML = html;

      // Add event listeners to view toggle buttons
      document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentView = btn.getAttribute('data-view');
          renderSection(section, data);
        });
      });

      // Add event listeners to passenger card view buttons (only for profiles)
      if (section === "profiles") {
        document.querySelectorAll(".view-btn").forEach(btn => {
          btn.addEventListener("click", e => {
            const id = e.target.getAttribute("data-id");
            const p = data.find(p => p.id == id);
            openPassengerModal(p);
          });
        });
      }
    }
    function openPassengerModal(passenger) {
      document.getElementById("modalPassengerName").textContent = passenger.name;
      document.getElementById("modalPassengerEmail").textContent = passenger.email;
      document.getElementById("modalPassengerPhone").textContent = passenger.phone;
      document.getElementById("modalPassengerStatus").textContent = passenger.status;
      document.getElementById("modalPassengerLead").textContent = passenger.isLead ? "Yes" : "No";

      document.getElementById("passengerModal").classList.add("active");
    }

    // Close modal
    document.getElementById("closePassengerModal").addEventListener("click", () => {
      document.getElementById("passengerModal").classList.remove("active");
    });


    function renderCardsView(section, data) {
      let html = `<div class="cards-container">`;

      switch (section) {
        case "profiles":
          let cardsHtml = '';
          data.forEach(p => {
            cardsHtml += `
                <div class="data-card passenger-item">
                  <h3>${p.name}</h3>
                  <p><strong>Email:</strong> ${p.email}</p>
                  <p><strong>Phone:</strong> ${p.phone}</p>
                  <p><strong>Status:</strong> <span class="status status-${p.status.toLowerCase()}">${p.status}</span></p>
                  <button class="action-btn view-btn" data-id="${p.id}">View</button>
                </div>
              `;
          });
          html += cardsHtml;
          break;
        case "flights":
          data.forEach(flight => {
            // Determine status indicator color
            let statusClass = "status-active";
            if (flight.status === "Delayed") statusClass = "status-delayed";
            if (flight.status === "Cancelled") statusClass = "status-cancelled";

            html += `
              <div class="data-card">
                <h3>
                  <span>${flight.id}</span>
                  <span class="status status-${flight.status.toLowerCase() === 'scheduled' ? 'active' : flight.status.toLowerCase()}">${flight.status}</span>
                </h3>
                <div class="status-indicator ${statusClass}"></div>
                <div class="flight-info">
                  <div class="flight-route">
                    <span>${flight.from}</span>
                    <span class="flight-arrow">→</span>
                    <span>${flight.to}</span>
                  </div>
                  ${flight.via ? `<p><strong>Via:</strong> ${flight.via}</p>` : ''}
                  <p><strong>Date:</strong> ${flight.date}</p>
                  <p><strong>Time:</strong> ${flight.time}</p>
                  <p><strong>Duration:</strong> ${flight.duration}</p>
                </div>
                <div class="action-buttons">
                  <button class="action-btn" onclick="openEditFlightModal('${flight.id}')">Edit</button>
                  <button class="action-btn cancel-btn" onclick="cancelFlight('${flight.id}')" ${flight.status === "Cancelled" ? 'disabled style="opacity: 0.5;"' : ''}>Cancel Flight</button>
                </div>
              </div>
            `;
          });
          break;

        case "leads":
          data.forEach(lead => {
            html += `
              <div class="data-card">
                <h3>${lead.name} <span class="status status-${lead.status.toLowerCase() === 'new' ? 'pending' : 'active'}">${lead.status}</span></h3>
                <p><strong>Source:</strong> ${lead.source}</p>
                <p><strong>Interest:</strong> ${lead.interest}</p>
                <p><strong>Assigned:</strong> ${lead.assigned}</p>
                <button class="action-btn">Contact Lead</button>
              </div>
            `;
          });
          break;

        case "bookings":
          data.forEach(booking => {
            html += `
              <div class="data-card">
                <h3>Booking ${booking.id} <span class="status status-${booking.status.toLowerCase() === 'confirmed' ? 'active' : booking.status.toLowerCase() === 'pending' ? 'pending' : 'active'}">${booking.status}</span></h3>
                <p><strong>Passenger:</strong> ${booking.passenger}</p>
                <p><strong>Flight:</strong> ${booking.flight}</p>
                <p><strong>Date:</strong> ${booking.date}</p>
                <p><strong>Class:</strong> ${booking.class}</p>
                <p><strong>Price:</strong> ${booking.price}</p>
                <button class="action-btn">Manage Booking</button>
              </div>
            `;
          });
          break;

        case "requests":
          data.forEach(request => {
            html += `
              <div class="data-card">
                <h3>Request ${request.id} <span class="status status-${request.status.toLowerCase() === 'completed' ? 'active' : request.status.toLowerCase() === 'new' ? 'pending' : 'active'}">${request.status}</span></h3>
                <p><strong>Passenger:</strong> ${request.passenger}</p>
                <p><strong>Type:</strong> ${request.type}</p>
                <p><strong>Date:</strong> ${request.date}</p>
                <p><strong>Assigned:</strong> ${request.assigned}</p>
                <button class="action-btn">Update Request</button>
              </div>
            `;
          });
          break;

        case "programs":
          data.forEach(program => {
            html += `
              <div class="data-card">
                <h3>${program.name} <span class="status status-${program.status.toLowerCase() === 'active' ? 'active' : 'pending'}">${program.status}</span></h3>
                <p><strong>Members:</strong> ${program.members}</p>
                <p><strong>Status:</strong> ${program.status}</p>
                <p><strong>Renews:</strong> ${program.renews}</p>
                <button class="action-btn">Program Details</button>
              </div>
            `;
          });
          break;
      }

      html += `</div>`;
      return html;
    }

    function renderListView(section, data) {
      let html = `<table class="data-table">`;

      switch (section) {
        case "profiles":
          html += `
            <thead>
              <tr>
                <th>Name</th>
                <th>Tier</th>
                <th>Flights</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
          `;
          data.forEach(passenger => {
            html += `
              <tr>
                <td>${passenger.name}</td>
                <td>${passenger.tier}</td>
                <td>${passenger.flights}</td>
                <td>${passenger.email}</td>
                <td><span class="status status-${passenger.status.toLowerCase() === 'active' ? 'active' : 'cancelled'}">${passenger.status}</span></td>
                <td><button class="action-btn">View</button></td>
              </tr>
            `;
          });
          break;

        case "flights":
          html += `
            <thead>
              <tr>
                <th>Flight ID</th>
                <th>From</th>
                <th>To</th>
                <th>Via</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
          `;
          data.forEach(flight => {
            // Determine status indicator color
            let statusClass = "status-active";
            if (flight.status === "Delayed") statusClass = "status-delayed";
            if (flight.status === "Cancelled") statusClass = "status-cancelled";

            html += `
              <tr>
                <td>${flight.id}</td>
                <td>${flight.from}</td>
                <td>${flight.to}</td>
                <td>${flight.via || '-'}</td>
                <td>${flight.date}</td>
                <td>
                  <span class="status-indicator ${statusClass}"></span>
                  <span class="status status-${flight.status.toLowerCase() === 'scheduled' ? 'active' : flight.status.toLowerCase()}">${flight.status}</span>
                </td>
                <td>
                  <button class="action-btn" onclick="openEditFlightModal('${flight.id}')">Edit</button>
                  <button class="action-btn cancel-btn" onclick="cancelFlight('${flight.id}')" ${flight.status === "Cancelled" ? 'disabled style="opacity: 0.5;"' : ''}>Cancel</button>
                </td>
              </tr>
            `;
          });
          break;

        case "leads":
          html += `
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Source</th>
                <th>Interest</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
          `;
          data.forEach(lead => {
            html += `
              <tr>
                <td>${lead.id}</td>
                <td>${lead.name}</td>
                <td>${lead.source}</td>
                <td>${lead.interest}</td>
                <td><span class="status status-${lead.status.toLowerCase() === 'new' ? 'pending' : 'active'}">${lead.status}</span></td>
                <td><button class="action-btn">Contact</button></td>
              </tr>
            `;
          });
          break;

        case "bookings":
          html += `
            <thead>
              <tr>
                <th>ID</th>
                <th>Passenger</th>
                <th>Flight</th>
                <th>Class</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
          `;
          data.forEach(booking => {
            html += `
              <tr>
                <td>${booking.id}</td>
                <td>${booking.passenger}</td>
                <td>${booking.flight}</td>
                <td>${booking.class}</td>
                <td><span class="status status-${booking.status.toLowerCase() === 'confirmed' ? 'active' : booking.status.toLowerCase() === 'pending' ? 'pending' : 'active'}">${booking.status}</span></td>
                <td><button class="action-btn">Manage</button></td>
              </tr>
            `;
          });
          break;

        case "requests":
          html += `
            <thead>
              <tr>
                <th>ID</th>
                <th>Passenger</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
          `;
          data.forEach(request => {
            html += `
              <tr>
                <td>${request.id}</td>
                <td>${request.passenger}</td>
                <td>${request.type}</td>
                <td>${request.date}</td>
                <td><span class="status status-${request.status.toLowerCase() === 'completed' ? 'active' : request.status.toLowerCase() === 'new' ? 'pending' : 'active'}">${request.status}</span></td>
                <td><button class="action-btn">Update</button></td>
              </tr>
            `;
          });
          break;

        case "programs":
          html += `
            <thead>
              <tr>
                <th>Name</th>
                <th>Members</th>
                <th>Status</th>
                <th>Renews</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
          `;
          data.forEach(program => {
            html += `
              <tr>
                <td>${program.name}</td>
                <td>${program.members}</td>
                <td><span class="status status-${program.status.toLowerCase() === 'active' ? 'active' : 'pending'}">${program.status}</span></td>
                <td>${program.renews}</td>
                <td><button class="action-btn">Details</button></td>
              </tr>
            `;
          });
          break;
      }

      html += `</tbody></table>`;
      return html;
    }

    // Initial render should respect whichever subnav-btn has "active"
    const defaultSection = document.querySelector(".subnav-btn.active").getAttribute("data-section");
    if (defaultSection === "flights") {
      renderSection(defaultSection, flightData);
    } else {
      renderSection(defaultSection, passengerData[defaultSection]);
    }

    // Add event listeners to subnav buttons
    subnavBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        // toggle active button
        subnavBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // update content
        const section = btn.getAttribute("data-section");
        if (section === 'flights') {
          renderSection(section, flightData);
        } else {
          renderSection(section, passengerData[section]);
        }
      });
    });

    // Add search functionality
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const activeSection = document.querySelector(".subnav-btn.active").getAttribute("data-section");

      let filteredData;
      if (activeSection === 'flights') {
        filteredData = flightData.filter(flight => {
          return JSON.stringify(flight).toLowerCase().includes(searchTerm);
        });
      } else {
        filteredData = passengerData[activeSection].filter(item => {
          return JSON.stringify(item).toLowerCase().includes(searchTerm);
        });
      }

      renderSection(activeSection, filteredData);
    });

    // Make functions available globally for onclick attributes
    window.openEditFlightModal = openEditFlightModal;
    window.cancelFlight = cancelFlight;
  }
});