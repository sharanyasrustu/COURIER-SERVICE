/* ==========================================================================
   SHARANYA COURIER SERVICE - INSTANT FREIGHT RATE & VOLUME CALCULATOR
   Volumetric Weight Computation, Tier Matrix & Printable Quote Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCalculatorEngine();
});

function initCalculatorEngine() {
  const calcForm = document.getElementById('rate-calc-form');
  if (!calcForm) return;

  const weightSlider = document.getElementById('calc-weight-slider');
  const weightDisplay = document.getElementById('calc-weight-display');
  const lengthInput = document.getElementById('calc-length');
  const widthInput = document.getElementById('calc-width');
  const heightInput = document.getElementById('calc-height');
  const tierOptions = document.querySelectorAll('.tier-option');

  let selectedTier = 'express'; // default express air

  // Slider change update
  if (weightSlider && weightDisplay) {
    weightSlider.addEventListener('input', () => {
      weightDisplay.innerText = `${weightSlider.value} kg`;
      calculateRate();
    });
  }

  // Dimension inputs auto update
  [lengthInput, widthInput, heightInput].forEach(inp => {
    inp?.addEventListener('input', calculateRate);
  });

  // Tier selection click
  tierOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      tierOptions.forEach(t => t.classList.remove('selected'));
      opt.classList.add('selected');
      selectedTier = opt.getAttribute('data-tier');
      calculateRate();
    });
  });

  // City selection change
  document.getElementById('origin-city')?.addEventListener('change', calculateRate);
  document.getElementById('dest-city')?.addEventListener('change', calculateRate);
  document.getElementById('package-type')?.addEventListener('change', calculateRate);

  // Form submit trigger modal
  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    openQuoteModal();
  });

  // Initial Calculation
  calculateRate();

  function calculateRate() {
    const actualWeight = parseFloat(weightSlider?.value || 1);
    const l = parseFloat(lengthInput?.value || 20);
    const w = parseFloat(widthInput?.value || 15);
    const h = parseFloat(heightInput?.value || 10);

    // Volumetric Weight (cm / 5000)
    const volumetricWeight = (l * w * h) / 5000;
    const chargeableWeight = Math.max(actualWeight, volumetricWeight);

    // Base rates per kg by tier
    let ratePerKg = 80;
    let etaText = '2 - 3 Business Days';

    if (selectedTier === 'standard') {
      ratePerKg = 45;
      etaText = '3 - 5 Business Days';
    } else if (selectedTier === 'express') {
      ratePerKg = 90;
      etaText = '24 - 48 Hours';
    } else if (selectedTier === 'sameday') {
      ratePerKg = 220;
      etaText = 'Same Day (Within 12 Hours)';
    }

    const baseCost = Math.round(chargeableWeight * ratePerKg + 120);
    const fuelSurcharge = Math.round(baseCost * 0.12);
    const gst = Math.round((baseCost + fuelSurcharge) * 0.18);
    const totalAmount = baseCost + fuelSurcharge + gst;

    // Render Displays
    document.getElementById('display-volumetric-wt').innerText = `${volumetricWeight.toFixed(2)} kg`;
    document.getElementById('display-chargeable-wt').innerText = `${chargeableWeight.toFixed(2)} kg`;
    document.getElementById('display-total-price').innerText = `₹${totalAmount.toLocaleString('en-IN')}`;
    document.getElementById('display-eta-text').innerText = etaText;
    document.getElementById('display-base-rate').innerText = `₹${baseCost}`;
    document.getElementById('display-fuel').innerText = `₹${fuelSurcharge}`;
    document.getElementById('display-gst').innerText = `₹${gst}`;
  }

  function openQuoteModal() {
    const modal = document.getElementById('quote-modal');
    if (!modal) return;

    const origin = document.getElementById('origin-city')?.value || 'Mumbai';
    const dest = document.getElementById('dest-city')?.value || 'Delhi';
    const total = document.getElementById('display-total-price')?.innerText || '₹450';
    const eta = document.getElementById('display-eta-text')?.innerText || '24 Hours';

    document.getElementById('modal-quote-details').innerHTML = `
      <div style="background:#F8FAFC; padding:1.2rem; border-radius:12px; margin:1rem 0;">
        <p><strong>Route:</strong> ${origin} ➔ ${dest}</p>
        <p><strong>Service Tier:</strong> ${selectedTier.toUpperCase()}</p>
        <p><strong>Estimated ETA:</strong> ${eta}</p>
        <p style="font-size:1.4rem; color:var(--accent-orange); font-weight:800; margin-top:0.5rem;">
          Total Payable: ${total}
        </p>
      </div>
    `;

    modal.classList.add('active');
  }

  // Modal Close Handlers
  document.getElementById('close-quote-modal')?.addEventListener('click', () => {
    document.getElementById('quote-modal')?.classList.remove('active');
  });
}
