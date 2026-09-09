/* ==========================================================================
   SHARANYA COURIER SERVICE - SHIPMENT TRACKING ENGINE
   Mock ID Lookup, Animated Stepper Timeline & Simulated Route Map
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTrackingEngine();
});

function initTrackingEngine() {
  const trackForm = document.getElementById('tracking-form');
  const trackInput = document.getElementById('track-input');
  const resultBox = document.getElementById('tracking-result-box');
  const sampleChips = document.querySelectorAll('.sample-chip');

  if (!trackForm || !trackInput || !resultBox) return;

  // Pre-configured mock database
  const mockShipments = {
    'SCS-987654': {
      id: 'SCS-987654',
      status: 'in-transit',
      statusLabel: 'In Transit',
      origin: 'Mumbai Hub (MH-01)',
      destination: 'New Delhi Sorting Center',
      currentLoc: 'NH-48 Jaipur Sorting Facility',
      eta: 'Tomorrow by 2:00 PM',
      sender: 'TechMart Electronics Ltd.',
      recipient: 'Rahul Verma',
      weight: '2.4 kg (Express Parcel)',
      stepsCompleted: 3, // 1 to 5
      timeline: [
        { title: 'Order Booked', time: 'Yesterday, 09:30 AM', desc: 'Shipment registered & manifest generated' },
        { title: 'Picked Up by Courier Agent', time: 'Yesterday, 02:15 PM', desc: 'Picked up from Mumbai warehouse' },
        { title: 'In Transit - Sorting Hub', time: 'Today, 06:45 AM', desc: 'Dispatched via Express Highway Fleet' },
        { title: 'Out for Delivery', time: 'Expected Tomorrow, 09:00 AM', desc: 'Will be assigned to local agent' },
        { title: 'Delivered', time: 'Expected Tomorrow, 02:00 PM', desc: 'OTP verification required' }
      ]
    },
    'SCS-112233': {
      id: 'SCS-112233',
      status: 'out-for-delivery',
      statusLabel: 'Out for Delivery',
      origin: 'Bengaluru Logistics Hub',
      destination: 'Hyderabad Office Hub',
      currentLoc: 'Jubilee Hills Delivery Van #14',
      eta: 'Today by 5:30 PM',
      sender: 'Apex Solutions Pvt Ltd',
      recipient: 'Suresh Menon',
      weight: '1.1 kg (Document Sack)',
      stepsCompleted: 4,
      timeline: [
        { title: 'Order Booked', time: '2 Days Ago, 10:00 AM', desc: 'Booking confirmed' },
        { title: 'Picked Up', time: '2 Days Ago, 04:00 PM', desc: 'In transit to airport cargo' },
        { title: 'Air Cargo Dispatched', time: 'Yesterday, 11:30 PM', desc: 'Landed at Hyderabad Air Gateway' },
        { title: 'Out for Delivery', time: 'Today, 08:15 AM', desc: 'Agent Ramesh Kumar (+91 98765 43210) en route' },
        { title: 'Delivered', time: 'Estimated Today 05:30 PM', desc: 'Signature scan pending' }
      ]
    },
    'SCS-554433': {
      id: 'SCS-554433',
      status: 'delivered',
      statusLabel: 'Delivered',
      origin: 'Chennai Sorting Hub',
      destination: 'Kolkata Central',
      currentLoc: 'Delivered to Recipient',
      eta: 'Delivered Yesterday at 3:45 PM',
      sender: 'Global Handicrafts Co.',
      recipient: 'Ananya Roy',
      weight: '5.8 kg (Gift Box)',
      stepsCompleted: 5,
      timeline: [
        { title: 'Order Booked', time: 'Aug 28, 11:00 AM', desc: 'Order processed' },
        { title: 'Picked Up', time: 'Aug 28, 05:30 PM', desc: 'Consignment packed' },
        { title: 'In Transit', time: 'Aug 29, 08:00 AM', desc: 'Dispatched via Air Express' },
        { title: 'Out for Delivery', time: 'Aug 30, 09:30 AM', desc: 'Assigned to delivery hub' },
        { title: 'Delivered', time: 'Aug 30, 03:45 PM', desc: 'Signed by Ananya Roy (POD Verified)' }
      ]
    }
  };

  // Sample ID Chip Click
  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const code = chip.innerText.trim();
      trackInput.value = code;
      performLookup(code);
    });
  });

  trackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = trackInput.value.trim().toUpperCase();
    if (!query) return;
    performLookup(query);
  });

  // Check URL params for ?id=SCS-1234
  const urlParams = new URLSearchParams(window.location.search);
  const paramId = urlParams.get('id');
  if (paramId) {
    trackInput.value = paramId;
    performLookup(paramId.toUpperCase());
  }

  function performLookup(id) {
    let data = mockShipments[id];

    // Fallback generator for custom user-entered IDs
    if (!data) {
      data = {
        id: id,
        status: 'in-transit',
        statusLabel: 'In Transit',
        origin: 'Regional Distribution Center',
        destination: 'Destination Hub',
        currentLoc: 'Interstate Logistics Corridor',
        eta: 'Within 24-48 Hours',
        sender: 'Registered Merchant',
        recipient: 'Consignee',
        weight: '3.0 kg (Standard Parcel)',
        stepsCompleted: 3,
        timeline: [
          { title: 'Order Booked', time: 'Recent', desc: 'Waybill created successfully' },
          { title: 'Picked Up', time: 'Recent', desc: 'Scanned at origin facility' },
          { title: 'In Transit', time: 'Live Status', desc: 'Consignment moving to final hub' },
          { title: 'Out for Delivery', time: 'Pending', desc: 'Will be dispatched shortly' },
          { title: 'Delivered', time: 'Pending', desc: 'Signature upon arrival' }
        ]
      };
    }

    renderResult(data);
  }

  function renderResult(data) {
    resultBox.classList.add('active');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Render Meta
    document.getElementById('display-track-id').innerText = data.id;
    document.getElementById('display-origin-dest').innerText = `${data.origin} ➔ ${data.destination}`;
    document.getElementById('display-current-loc').innerText = data.currentLoc;
    document.getElementById('display-eta').innerText = data.eta;
    document.getElementById('display-weight').innerText = data.weight;

    const badgeElem = document.getElementById('display-status-badge');
    badgeElem.className = `status-badge ${data.status}`;
    badgeElem.innerHTML = `<i class="lucide-circle-dot">●</i> ${data.statusLabel}`;

    // Render Stepper Timeline
    const stepperContainer = document.getElementById('timeline-stepper');
    const progressBar = document.getElementById('timeline-progress-bar');
    
    // Calculate progress percentage
    const percent = ((data.stepsCompleted - 1) / (data.timeline.length - 1)) * 100;
    if (progressBar) progressBar.style.width = `${percent}%`;

    let stepperHTML = '';
    data.timeline.forEach((step, idx) => {
      const isComp = idx < data.stepsCompleted - 1;
      const isAct = idx === data.stepsCompleted - 1;
      const stateClass = isComp ? 'completed' : (isAct ? 'active' : '');

      stepperHTML += `
        <div class="step-item ${stateClass}">
          <div class="step-node">
            ${isComp ? '✓' : (idx + 1)}
          </div>
          <div>
            <div class="step-label">${step.title}</div>
            <div class="step-time">${step.time}</div>
            <div style="font-size:0.75rem; color:#64748B; margin-top:3px;">${step.desc}</div>
          </div>
        </div>
      `;
    });
    stepperContainer.innerHTML = stepperHTML;

    // Render Route Map Animated Truck
    renderRouteCanvas(percent);
  }

  function renderRouteCanvas(progressPercent) {
    const routeSvg = document.getElementById('route-svg-path');
    if (!routeSvg) return;

    const truckPos = Math.max(10, Math.min(90, progressPercent));

    routeSvg.innerHTML = `
      <!-- Background Highway Line -->
      <line x1="50" y1="80" x2="650" y2="80" stroke="rgba(255,255,255,0.2)" stroke-width="6" stroke-dasharray="10 6" />
      <line x1="50" y1="80" x2="${50 + (600 * (truckPos / 100))}" y2="80" stroke="#FF6B35" stroke-width="6" />

      <!-- Origin Node -->
      <circle cx="50" cy="80" r="12" fill="#0B1F3A" stroke="#FF6B35" stroke-width="4" />
      <text x="50" y="115" fill="#FFF" font-size="12" text-anchor="middle" font-weight="bold">ORIGIN</text>

      <!-- Animated Delivery Truck Icon -->
      <g transform="translate(${40 + (600 * (truckPos / 100)) - 25}, 55)">
        <rect x="0" y="0" width="50" height="28" rx="6" fill="#FF6B35" />
        <path d="M35 8 L48 14 L48 28 L35 28 Z" fill="#0B1F3A" />
        <circle cx="12" cy="28" r="5" fill="#FFF" />
        <circle cx="38" cy="28" r="5" fill="#FFF" />
        <text x="25" y="18" fill="#FFF" font-size="9" font-weight="bold" text-anchor="middle">SCS</text>
      </g>

      <!-- Destination Node -->
      <circle cx="650" cy="80" r="12" fill="#0B1F3A" stroke="#FFFFFF" stroke-width="4" />
      <text x="650" y="115" fill="#FFF" font-size="12" text-anchor="middle" font-weight="bold">DESTINATION</text>
    `;
  }
}
