import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     0. LOCAL STORAGE DATABASE & ADMIN INITIALIZER
     ========================================================================== */
  const DB_KEY_LEADS = 'arohancare_leads_v2';
  const DB_KEY_CONFIG = 'arohancare_admin_config_v2';

  // Default Admin Credentials
  const DEFAULT_CONFIG = {
    adminPassword: 'admin123',
    adminUsername: 'admin'
  };

  // Sample initial records
  const SAMPLE_LEADS = [
    {
      id: 'ARC-2026-8941',
      date: '2026-07-27 10:30 AM',
      name: 'Rahul Sharma',
      patient_name: 'Priya Sharma',
      phone: '+91 98765 43210',
      email: 'priya.sharma@example.com',
      city: 'Bengaluru',
      state: 'Karnataka',
      condition: 'PCOS Management',
      score: 'PCOS Risk Index: Moderate',
      type: 'Quiz Lead',
      status: 'Confirmed',
      notes: 'Requested morning consultation with Dr. Ananya Sharma.'
    },
    {
      id: 'ARC-2026-8942',
      date: '2026-07-27 11:15 AM',
      name: 'Vikram Singh',
      patient_name: 'Sneha Singh',
      phone: '+91 98123 45678',
      email: 'sneha.v@example.com',
      city: 'Mysuru',
      state: 'Karnataka',
      condition: 'Pregnancy Planning',
      score: 'Pre-conception Screening Recommended',
      type: 'Direct Booking',
      status: 'Contacted',
      notes: 'Sent pre-conception checklist via WhatsApp.'
    },
    {
      id: 'ARC-2026-8943',
      date: '2026-07-27 12:00 PM',
      name: 'Meera Nair',
      patient_name: 'Meera Nair',
      phone: '+91 97456 78901',
      email: 'meera.nair@example.com',
      city: 'Kochi',
      state: 'Kerala',
      condition: 'Irregular Periods',
      score: 'Anovulatory Cycle Assessment',
      type: 'Quiz Lead',
      status: 'Pending',
      notes: 'Experiencing irregular cycles for 8 months.'
    },
    {
      id: 'ARC-2026-8944',
      date: '2026-07-26 04:45 PM',
      name: 'Siddharth Reddy',
      patient_name: 'Ananya Reddy',
      phone: '+91 99887 76655',
      email: 'ananya.reddy@example.com',
      city: 'Hyderabad',
      state: 'Telangana',
      condition: 'Fertility Evaluation',
      score: 'Comprehensive Diagnostic Suite',
      type: 'Direct Booking',
      status: 'Completed',
      notes: 'Initial evaluation completed; 3D scan report attached.'
    }
  ];

  function getLeads() {
    const raw = localStorage.getItem(DB_KEY_LEADS);
    if (!raw) {
      localStorage.setItem(DB_KEY_LEADS, JSON.stringify(SAMPLE_LEADS));
      return SAMPLE_LEADS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return SAMPLE_LEADS;
    }
  }

  function saveLead(leadObj) {
    const leads = getLeads();
    leads.unshift(leadObj);
    localStorage.setItem(DB_KEY_LEADS, JSON.stringify(leads));
    renderAdminDashboard();
  }

  function updateLeadStatus(leadId, newStatus) {
    const leads = getLeads();
    const target = leads.find(l => l.id === leadId);
    if (target) {
      target.status = newStatus;
      localStorage.setItem(DB_KEY_LEADS, JSON.stringify(leads));
      renderAdminDashboard();
    }
  }

  function deleteLead(leadId) {
    let leads = getLeads();
    leads = leads.filter(l => l.id !== leadId);
    localStorage.setItem(DB_KEY_LEADS, JSON.stringify(leads));
    renderAdminDashboard();
  }

  function getAdminConfig() {
    const raw = localStorage.getItem(DB_KEY_CONFIG);
    if (!raw) {
      localStorage.setItem(DB_KEY_CONFIG, JSON.stringify(DEFAULT_CONFIG));
      return DEFAULT_CONFIG;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }

  function updateAdminPassword(newPassword) {
    const cfg = getAdminConfig();
    cfg.adminPassword = newPassword;
    localStorage.setItem(DB_KEY_CONFIG, JSON.stringify(cfg));
  }

  // Active Admin Session State
  let currentAdminSession = sessionStorage.getItem('arohan_admin_role') || null;

  /* ==========================================================================
     1. SCROLL PROGRESS INDICATOR & HEADER BLUR
     ========================================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = `${scrolled}%`;
    }

    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  /* ==========================================================================
     2. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  function openDrawer() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.add('open');
      drawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.remove('open');
      drawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  mobileNavItems.forEach(item => {
    item.addEventListener('click', closeDrawer);
  });

  /* ==========================================================================
     3. ANIMATED LIVE COUNTERS
     ========================================================================== */
  const counterElements = document.querySelectorAll('.counter-num');
  let countersAnimated = false;

  function animateCounters() {
    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const duration = 2000;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        if (Number.isInteger(target)) {
          counter.textContent = Math.floor(current).toLocaleString('en-IN');
        } else {
          counter.textContent = current.toFixed(1);
        }
      }, stepTime);
    });
  }

  const trustSection = document.querySelector('.trust-section');
  if (trustSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(trustSection);
  }

  /* ==========================================================================
     4. PATIENT JOURNEY TIMELINE SELECTOR
     ========================================================================== */
  const timelineStepNodes = document.querySelectorAll('.timeline-step-node');
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineDetailContent = document.getElementById('timeline-detail-content');

  const stepDetails = {
    1: {
      title: "Step 1: First Consultation & Diagnostic Mapping",
      desc: "Detailed 60-minute confidential discussion with Dr. Ananya Sharma to map your medical history, cycle regularity, and lifestyle factors. Includes 3D pelvic ultrasound screening."
    },
    2: {
      title: "Step 2: Root Cause Evaluation & Lab Tests",
      desc: "Precision blood panel (AMH, Thyroid, LH, FSH, Prolactin) and non-invasive tubal assessment. We identify exact endocrine signals within 5–7 business days."
    },
    3: {
      title: "Step 3: Personalized Treatment Strategy",
      desc: "Joint decision-making session. We build a clear 90-day roadmap tailored to your body—combining follicle tracking, hormonal support, or targeted lifestyle therapy."
    },
    4: {
      title: "Step 4: Active Cycle Guidance & Care Support",
      desc: "Weekly cycle tracking with minimal clinic visits. Our care coordinators provide round-the-clock guidance on medication timing and fertile window optimization."
    },
    5: {
      title: "Step 5: Progress Review & Milestone Tracking",
      desc: "Evaluation of treatment response and endometrial lining receptivity. We adapt your protocol dynamically for highest natural conception probabilities."
    },
    6: {
      title: "Step 6: Successful Conception & Early Pregnancy",
      desc: "Confirmation scan, initial beta-hCG monitoring, and smooth transition to early prenatal care with full emotional & medical support."
    }
  };

  timelineStepNodes.forEach(node => {
    node.addEventListener('click', () => {
      const stepVal = parseInt(node.getAttribute('data-step'), 10);

      timelineStepNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const progressPct = ((stepVal - 1) / (timelineStepNodes.length - 1)) * 100;
      if (timelineProgress) timelineProgress.style.width = `${progressPct}%`;

      const detail = stepDetails[stepVal];
      if (detail && timelineDetailContent) {
        timelineDetailContent.innerHTML = `
          <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--navy-950); margin-bottom:0.4rem;">${detail.title}</h4>
          <p style="font-size:0.975rem; color:var(--charcoal-600); line-height:1.6;">${detail.desc}</p>
        `;
      }
    });
  });

  /* ==========================================================================
     5. CONDITIONS WE TREAT (MODAL)
     ========================================================================== */
  const conditionCards = document.querySelectorAll('.condition-card');
  const conditionModal = document.getElementById('condition-modal');
  const closeConditionModalBtn = document.getElementById('close-condition-modal');
  const conditionModalBody = document.getElementById('condition-modal-body');

  const conditionDetails = {
    "pcos": {
      title: "PCOS & Ovary Wellness Management",
      icon: "🌸",
      subtitle: "Reversing Insulin Resistance & Rebalancing Hormones",
      desc: "PCOS affects 1 in 5 Indian women. Our comprehensive PCOS care combines low-glycemic dietary protocols, androgen level normalization, and natural ovulation restoration.",
      features: [
        "Transvaginal Pelvic Ultrasound & Follicle Count",
        "Insulin Sensitivity & Glucose Tolerance Profile",
        "Targeted Anti-Androgen Supplementation",
        "Customized Nutritional & Exercise Roadmap"
      ]
    },
    "irregular-periods": {
      title: "Irregular Period & Anovulation Care",
      icon: "📅",
      subtitle: "Restoring Your Natural Hormonal Rhythm",
      desc: "Irregular or missed cycles indicate underlying hormonal signals requiring precision testing. We identify thyroid disorders, prolactin spikes, or hypothalamic amenorrhea to bring predictability back.",
      features: [
        "Complete Endocrine Panel (TSH, Prolactin, AMH, LH, FSH)",
        "Hypothalamic-Pituitary Axis Evaluation",
        "Uterine Endometrial Lining Scan",
        "Natural Cycle Synchronization Protocol"
      ]
    },
    "ovulation-disorders": {
      title: "Ovulation Induction & Follicular Tracking",
      icon: "✨",
      subtitle: "Optimizing Your Fertile Window with Scientific Precision",
      desc: "We pinpoint your exact ovulation window through serial sonography scans and hormone monitoring, dramatically boosting natural conception probabilities.",
      features: [
        "Transvaginal Folliculometry (Day 9 onwards)",
        "Trigger Shot (hCG) Timing Optimization",
        "Endometrial Receptivity Enhancement",
        "Timed Intercourse / IUI Guidance"
      ]
    },
    "pregnancy-planning": {
      title: "Pre-Conception & Pregnancy Planning",
      icon: "👶",
      subtitle: "Building the Healthiest Foundation for Your Future Baby",
      desc: "Prepare your body 3–6 months before trying to conceive. We optimize micronutrients, screen for genetic factors, and ensure optimal uterine health.",
      features: [
        "Pre-conception Genetic Carrier Screening",
        "Active Folate (5-MTHF) & Iron Optimization",
        "Rubella & Varicella Immunity Verification",
        "Partner Sperm Health Analysis"
      ]
    },
    "fertility-evaluation": {
      title: "Comprehensive Fertility Evaluation",
      icon: "🔬",
      subtitle: "Advanced Diagnostic Suite for Both Partners",
      desc: "A thorough 360-degree assessment to uncover root causes of delay in conceiving. Complete within 5–7 days with zero stress.",
      features: [
        "Ovarian Reserve AMH Testing",
        "Saline Sonography (SSG) / Tubal Assessment",
        "Advanced Computer-Assisted Semen Analysis (CASA)",
        "Uterine Cavity & Myoma Mapping"
      ]
    }
  };

  conditionCards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-condition');
      const info = conditionDetails[key];

      if (info && conditionModalBody) {
        conditionModalBody.innerHTML = `
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">${info.icon}</div>
          <div style="font-size:0.85rem; font-weight:700; color:var(--teal-700); text-transform:uppercase; margin-bottom:0.25rem;">Specialized Care</div>
          <h3 style="font-family:var(--font-serif); font-size:1.8rem; color:var(--navy-950); margin-bottom:0.5rem;">${info.title}</h3>
          <p style="font-weight:600; color:var(--teal-800); margin-bottom:1rem;">${info.subtitle}</p>
          <p style="font-size:0.95rem; color:var(--charcoal-600); line-height:1.6; margin-bottom:1.5rem;">${info.desc}</p>
          
          <h4 style="font-weight:700; font-size:1rem; color:var(--navy-950); margin-bottom:0.75rem;">Key Treatment Elements:</h4>
          <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; margin-bottom:2rem;">
            ${info.features.map(f => `
              <li style="display:flex; align-items:center; gap:0.6rem; font-size:0.9rem; color:var(--charcoal-800);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--leaf-green-600)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>

          <button class="btn btn-primary btn-lg open-booking-modal" style="width:100%;">
            <span>Book ${info.title} Consultation</span>
          </button>
        `;

        conditionModal.classList.add('open');
        document.body.style.overflow = 'hidden';

        const innerBtn = conditionModalBody.querySelector('.open-booking-modal');
        if (innerBtn) {
          innerBtn.addEventListener('click', () => {
            conditionModal.classList.remove('open');
            openBookingModalWithCondition(key);
          });
        }
      }
    });
  });

  if (closeConditionModalBtn) {
    closeConditionModalBtn.addEventListener('click', () => {
      if (conditionModal) conditionModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  /* ==========================================================================
     6. INTERACTIVE ASSESSMENT QUIZ & PATIENT DATA SUBMISSION
     ========================================================================== */
  const quizQuestions = [
    {
      question: "1. What is your primary health or fertility goal today?",
      options: [
        { label: "Concerns with PCOS or Hormonal Imbalance", key: "pcos" },
        { label: "Trying to Conceive & Need Evaluation", key: "fertility-evaluation" },
        { label: "Irregular or Missed Cycles", key: "irregular-periods" },
        { label: "Pre-conception Planning & Health Check", key: "pregnancy-planning" }
      ]
    },
    {
      question: "2. How long have you been experiencing symptoms or trying to conceive?",
      options: [
        { label: "Less than 6 Months", score: 1 },
        { label: "6 Months to 1 Year", score: 2 },
        { label: "1 to 2 Years", score: 3 },
        { label: "More than 2 Years", score: 4 }
      ]
    },
    {
      question: "3. Have you experienced any of the following symptoms recently?",
      options: [
        { label: "Irregular cycles, acne, or weight changes", score: 2 },
        { label: "Painful periods or pelvic discomfort", score: 2 },
        { label: "Thyroid issues or fatigue", score: 2 },
        { label: "None of the above / Just starting planning", score: 1 }
      ]
    },
    {
      question: "4. What is your preferred consultation timeline?",
      options: [
        { label: "As soon as possible (This week)", priority: "high" },
        { label: "Within the next 2 weeks", priority: "medium" },
        { label: "Just exploring options for now", priority: "low" }
      ]
    }
  ];

  let currentQuizStep = 0;
  let userQuizAnswers = {};

  const quizQuestionText = document.getElementById('quiz-question-text');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const quizProgressFill = document.getElementById('quiz-progress-fill');
  const quizCard = document.getElementById('quiz-card');

  function renderQuizStep() {
    if (!quizCard || !quizQuestionText || !quizOptionsContainer) return;

    if (currentQuizStep < quizQuestions.length) {
      const q = quizQuestions[currentQuizStep];
      quizQuestionText.textContent = q.question;

      const progress = ((currentQuizStep + 1) / (quizQuestions.length + 1)) * 100;
      if (quizProgressFill) quizProgressFill.style.width = `${progress}%`;

      quizOptionsContainer.innerHTML = '';
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `
          <span>${opt.label}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        `;

        btn.addEventListener('click', () => {
          userQuizAnswers[currentQuizStep] = opt;
          currentQuizStep++;
          renderQuizStep();
        });

        quizOptionsContainer.appendChild(btn);
      });
    } else if (currentQuizStep === quizQuestions.length) {
      // Step 5: Fill Contact & Patient Details Form
      renderQuizContactForm();
    }
  }

  function renderQuizContactForm() {
    if (quizProgressFill) quizProgressFill.style.width = `100%`;

    const selectedGoalObj = userQuizAnswers[0];
    const goalLabel = selectedGoalObj ? selectedGoalObj.label : "Fertility Check";

    quizCard.innerHTML = `
      <div>
        <div style="font-size:0.85rem; font-weight:700; color:var(--teal-700); text-transform:uppercase; margin-bottom:0.4rem;">Final Step: Save Your Assessment Report</div>
        <h3 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--navy-950); margin-bottom:0.5rem;">
          Enter Your Details to Lock Priority Consultation
        </h3>
        <p style="font-size:0.925rem; color:var(--charcoal-600); margin-bottom:1.5rem;">
          Your answers have been analyzed for <strong>${goalLabel}</strong>. Fill in your details below to save your assessment report in our clinical portal.
        </p>

        <form id="quiz-details-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="quiz-contact-name">Contact Person Name *</label>
              <input type="text" id="quiz-contact-name" class="form-input" placeholder="e.g. Rahul Sharma" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="quiz-patient-name">Patient Name *</label>
              <input type="text" id="quiz-patient-name" class="form-input" placeholder="e.g. Priya Sharma" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="quiz-phone">Mobile / WhatsApp Number *</label>
              <input type="tel" id="quiz-phone" class="form-input" placeholder="+91 98765 43210" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="quiz-email">Email Address *</label>
              <input type="email" id="quiz-email" class="form-input" placeholder="priya@example.com" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="quiz-city">City *</label>
              <input type="text" id="quiz-city" class="form-input" placeholder="e.g. Bengaluru" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="quiz-state">State *</label>
              <input type="text" id="quiz-state" class="form-input" placeholder="e.g. Karnataka" required>
            </div>
          </div>

          <button type="submit" class="btn btn-green btn-lg" style="width:100%; margin-top:0.5rem;">
            <span>Save Assessment & Book Priority Slot</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </form>
      </div>
    `;

    const quizForm = document.getElementById('quiz-details-form');
    if (quizForm) {
      quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const contactName = document.getElementById('quiz-contact-name').value.trim();
        const patientName = document.getElementById('quiz-patient-name').value.trim();
        const phone = document.getElementById('quiz-phone').value.trim();
        const email = document.getElementById('quiz-email').value.trim();
        const city = document.getElementById('quiz-city').value.trim();
        const state = document.getElementById('quiz-state').value.trim();

        const leadId = 'ARC-2026-' + Math.floor(1000 + Math.random() * 9000);
        const newLead = {
          id: leadId,
          date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          name: contactName,
          patient_name: patientName,
          phone: phone,
          email: email,
          city: city,
          state: state,
          condition: goalLabel,
          score: `Duration: ${userQuizAnswers[1]?.label || 'N/A'}, Urgency: ${userQuizAnswers[3]?.label || 'High'}`,
          type: 'Quiz Lead',
          status: 'Pending',
          notes: `Submitted via Interactive Assessment. Primary Goal: ${goalLabel}`
        };

        saveLead(newLead);

        // Confetti celebration
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#043175', '#008B8B', '#10B981', '#7E22CE']
        });

        renderQuizSuccess(newLead);
      });
    }
  }

  function renderQuizSuccess(lead) {
    quizCard.innerHTML = `
      <div style="text-align:center; padding:1rem;">
        <div style="width:70px; height:70px; border-radius:50%; background:var(--leaf-green-100); color:var(--leaf-green-600); display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem;">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <div style="font-size:0.85rem; font-weight:700; color:var(--leaf-green-600); text-transform:uppercase; margin-bottom:0.4rem;">Assessment Saved & Locked</div>
        <h3 style="font-family:var(--font-serif); font-size:1.8rem; color:var(--navy-950); margin-bottom:0.75rem;">
          Priority Slot Reserved for ${lead.patient_name}! 🎉
        </h3>
        <p style="font-size:1rem; color:var(--charcoal-600); max-width:600px; margin:0 auto 1.25rem; line-height:1.6;">
          Your Reference ID is <strong>${lead.id}</strong>. Our Senior Fertility Care Coordinator will call or WhatsApp you at <strong>${lead.phone}</strong> within 15 minutes.
        </p>

        <div style="background:var(--warm-white); padding:1rem; border-radius:16px; border:1px solid var(--navy-100); text-align:left; max-width:540px; margin:0 auto 1.5rem; font-size:0.9rem;">
          <div><strong>Patient Name:</strong> ${lead.patient_name}</div>
          <div><strong>Contact Person:</strong> ${lead.name}</div>
          <div><strong>Location:</strong> ${lead.city}, ${lead.state}</div>
          <div><strong>Primary Concern:</strong> ${lead.condition}</div>
          <div><strong>Status:</strong> <span class="status-badge status-pending">Pending Follow-up</span></div>
        </div>

        <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
          <a href="https://wa.me/919876543210?text=Hi%20ArohanCare%2C%20my%20assessment%20ref%20is%20${lead.id}.%20I%20would%20like%20to%20confirm%20my%20slot." target="_blank" class="btn btn-whatsapp btn-lg">
            <span>WhatsApp Care Team Now</span>
          </a>
          <button class="btn btn-secondary btn-lg open-admin-btn">
            <span>View in Admin Portal</span>
          </button>
        </div>
      </div>
    `;

    const adminBtn = quizCard.querySelector('.open-admin-btn');
    if (adminBtn) {
      adminBtn.addEventListener('click', openAdminModal);
    }
  }

  renderQuizStep();

  /* ==========================================================================
     7. TESTIMONIALS CAROUSEL SLIDER & STORAGE
     ========================================================================== */
  const DB_KEY_TESTIMONIALS = 'arohancare_testimonials_v2';

  const defaultTestimonials = [
    {
      id: 't-1',
      name: "Priyanka & Rahul M.",
      meta: "Bengaluru • PCOS & Fertility Treatment",
      quote: "After 4 years of struggling with severe PCOS and irregular cycles, we met Dr. Ananya at ArohanCare. Her calm reassurance, precise diagnostic clarity, and personalized care brought us our healthy baby boy in 2025.",
      initials: "P & R",
      rating: 5,
      verified: "Verified ArohanCare Patient • Baby Born Sept 2025"
    },
    {
      id: 't-2',
      name: "Sneha & Vikram S.",
      meta: "Hyderabad • Pregnancy Planning",
      quote: "The warmth and privacy at ArohanCare is unmatched. Every single person on the care team treats you with deep respect. We conceived naturally within 4 months of their tailored hormone regulation plan!",
      initials: "S & V",
      rating: 5,
      verified: "Verified ArohanCare Patient • Expecting Twins 2026"
    },
    {
      id: 't-3',
      name: "Aniti & Dev K.",
      meta: "Chennai • Irregular Period & Ovulation Care",
      quote: "We were overwhelmed by generic advice from other clinics. Dr. Ananya listened to us for an hour during our first visit and mapped out a simple, stress-free protocol that worked wonders.",
      initials: "A & D",
      rating: 5,
      verified: "Verified ArohanCare Patient • Baby Girl Born 2025"
    }
  ];

  function getTestimonials() {
    const data = localStorage.getItem(DB_KEY_TESTIMONIALS);
    if (!data) {
      localStorage.setItem(DB_KEY_TESTIMONIALS, JSON.stringify(defaultTestimonials));
      return defaultTestimonials;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return defaultTestimonials;
    }
  }

  function saveTestimonialsList(list) {
    localStorage.setItem(DB_KEY_TESTIMONIALS, JSON.stringify(list));
  }

  let currentTestimonialIndex = 0;
  const testimonialCard = document.getElementById('testimonial-card');
  const prevTestimonialBtn = document.getElementById('prev-testimonial-btn');
  const nextTestimonialBtn = document.getElementById('next-testimonial-btn');
  const carouselDots = document.querySelectorAll('.carousel-dot');

  function renderTestimonial(index) {
    const list = getTestimonials();
    if (!list || list.length === 0) {
      if (testimonialCard) {
        testimonialCard.innerHTML = `
          <div style="text-align:center; padding: 2.5rem; color:var(--charcoal-600);">
            No testimonials available currently. Add patient reviews from the Admin Panel.
          </div>
        `;
      }
      return;
    }

    currentTestimonialIndex = ((index % list.length) + list.length) % list.length;
    const item = list[currentTestimonialIndex];
    if (!item || !testimonialCard) return;

    const starCount = item.rating || 5;
    const starsHtml = '★'.repeat(starCount);

    testimonialCard.innerHTML = `
      <div style="text-align:center;">
        <div style="width:130px; height:130px; border-radius:50%; background:var(--teal-50); margin:0 auto 1rem; display:flex; align-items:center; justify-content:center; font-family:var(--font-serif); font-size:2.2rem; color:var(--navy-950); font-weight:700; border:4px solid var(--pure-white); box-shadow:var(--shadow-md);">
          ${item.initials}
        </div>
        <div class="testimonial-author-name">${item.name}</div>
        <div class="testimonial-author-meta">${item.meta}</div>
      </div>

      <div>
        <div class="testimonial-stars">${starsHtml}</div>
        <blockquote class="testimonial-quote">"${item.quote}"</blockquote>
        <div style="font-size:0.85rem; color:var(--teal-700); font-weight:600; display:flex; align-items:center; gap:0.4rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          <span>${item.verified}</span>
        </div>
      </div>
    `;

    carouselDots.forEach((dot, dIdx) => {
      if (dIdx === currentTestimonialIndex) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  if (prevTestimonialBtn) {
    prevTestimonialBtn.addEventListener('click', () => {
      const list = getTestimonials();
      if (list.length) {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + list.length) % list.length;
        renderTestimonial(currentTestimonialIndex);
      }
    });
  }

  if (nextTestimonialBtn) {
    nextTestimonialBtn.addEventListener('click', () => {
      const list = getTestimonials();
      if (list.length) {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % list.length;
        renderTestimonial(currentTestimonialIndex);
      }
    });
  }

  carouselDots.forEach(dot => {
    dot.addEventListener('click', () => {
      currentTestimonialIndex = parseInt(dot.getAttribute('data-index'), 10);
      renderTestimonial(currentTestimonialIndex);
    });
  });

  setInterval(() => {
    const list = getTestimonials();
    if (list.length) {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % list.length;
      renderTestimonial(currentTestimonialIndex);
    }
  }, 6000);

  /* ==========================================================================
     8. FAQ ACCORDION TOGGLE
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  /* ==========================================================================
     9. BOOKING MODAL & FORM SUBMISSION TO ADMIN DATABASE
     ========================================================================== */
  const bookingModal = document.getElementById('booking-modal');
  const closeBookingModalBtn = document.getElementById('close-booking-modal');
  const openBookingBtns = document.querySelectorAll('.open-booking-modal');
  const appointmentForm = document.getElementById('appointment-form');
  const bookingFormContainer = document.getElementById('booking-form-container');
  const bookingSuccessContainer = document.getElementById('booking-success-container');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  const preferredDateInput = document.getElementById('preferred-date');
  if (preferredDateInput) {
    const today = new Date().toISOString().split('T')[0];
    preferredDateInput.setAttribute('min', today);
    preferredDateInput.value = today;
  }

  function openBookingModalWithCondition(conditionKey = '') {
    if (!bookingModal) return;
    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (conditionKey) {
      const select = document.getElementById('patient-condition');
      if (select) select.value = conditionKey;
    }
  }

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', () => openBookingModalWithCondition());
  });

  if (closeBookingModalBtn) {
    closeBookingModalBtn.addEventListener('click', () => {
      bookingModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patient-name').value.trim();
      const patientName = document.getElementById('patient-person-name').value.trim();
      const phone = document.getElementById('patient-phone').value.trim();
      const email = document.getElementById('patient-email').value.trim();
      const city = document.getElementById('patient-city').value.trim();
      const state = document.getElementById('patient-state').value.trim();
      const condition = document.getElementById('patient-condition').value;
      const date = document.getElementById('preferred-date').value;
      const slot = document.getElementById('preferred-time').value;

      const leadId = 'ARC-2026-' + Math.floor(1000 + Math.random() * 9000);
      const newLead = {
        id: leadId,
        date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        name: name,
        patient_name: patientName,
        phone: phone,
        email: email,
        city: city,
        state: state,
        condition: condition,
        score: `Slot: ${date} (${slot})`,
        type: 'Direct Booking',
        status: 'Confirmed',
        notes: `Preferred Date: ${date}, Slot: ${slot}`
      };

      saveLead(newLead);

      document.getElementById('success-patient-name').textContent = patientName;
      document.getElementById('success-patient-phone').textContent = phone;

      bookingFormContainer.style.display = 'none';
      bookingSuccessContainer.style.display = 'block';

      // Confetti celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#043175', '#008B8B', '#10B981', '#7E22CE']
      });
    });
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      bookingModal.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        appointmentForm.reset();
        bookingFormContainer.style.display = 'block';
        bookingSuccessContainer.style.display = 'none';
      }, 400);
    });
  }

  /* ==========================================================================
     10. FULL PAGE ADMIN PORTAL CONTROLLER & RBAC SYSTEM
     ========================================================================== */
  const adminPagePortal = document.getElementById('admin-page-portal');
  const mainWebsiteContent = document.querySelector('main');
  const mainHeader = document.querySelector('.site-header');
  const mainFooter = document.querySelector('.site-footer');
  const openAdminBtns = document.querySelectorAll('.open-admin-btn');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminLoginScreen = document.getElementById('admin-login-screen');
  const adminDashboardScreen = document.getElementById('admin-dashboard-screen');
  const adminLoginError = document.getElementById('admin-login-error');
  const activeUserBadge = document.getElementById('active-user-badge');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');
  const backToWebsiteBtns = document.querySelectorAll('.back-to-website-btn');
  const adminSidebar = document.getElementById('admin-sidebar');
  const adminSidebarToggleBtn = document.getElementById('admin-sidebar-toggle-btn');

  const adminSearchInput = document.getElementById('admin-search-input');
  const adminStatusFilter = document.getElementById('admin-status-filter');
  const adminTypeFilter = document.getElementById('admin-type-filter');
  const exportCsvBtn = document.getElementById('export-csv-btn');
  const addManualLeadBtn = document.getElementById('add-manual-lead-btn');

  // Change Password Form
  const adminChangePasswordForm = document.getElementById('admin-change-password-form');
  const passwordChangeMsg = document.getElementById('password-change-msg');

  // Lead Details Modal
  const leadDetailsModal = document.getElementById('lead-details-modal');
  const closeLeadDetailsModalBtn = document.getElementById('close-lead-details-modal');
  const leadDetailsModalBody = document.getElementById('lead-details-modal-body');

  function openAdminPortal() {
    if (!adminPagePortal) return;
    adminPagePortal.style.display = 'block';
    if (mainWebsiteContent) mainWebsiteContent.style.display = 'none';
    if (mainHeader) mainHeader.style.display = 'none';
    if (mainFooter) mainFooter.style.display = 'none';
    document.body.style.overflow = 'hidden';

    if (currentAdminSession) {
      showDashboardScreen();
    } else {
      showLoginScreen();
    }
  }

  function closeAdminPortal() {
    if (adminPagePortal) {
      adminPagePortal.style.display = 'none';
      if (mainWebsiteContent) mainWebsiteContent.style.display = 'block';
      if (mainHeader) mainHeader.style.display = 'block';
      if (mainFooter) mainFooter.style.display = 'block';
      document.body.style.overflow = '';
      if (window.location.hash === '#secure-admin' || window.location.hash === '#admin') {
        history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    }
  }

  backToWebsiteBtns.forEach(btn => {
    btn.addEventListener('click', closeAdminPortal);
  });

  if (adminSidebarToggleBtn && adminSidebar) {
    adminSidebarToggleBtn.addEventListener('click', () => {
      adminSidebar.classList.toggle('open');
    });
  }

  function checkUrlHashForAdmin() {
    const hash = window.location.hash.toLowerCase();
    const query = window.location.search.toLowerCase();
    if (hash === '#secure-admin' || hash === '#admin' || query.includes('secure-admin') || query.includes('admin=true')) {
      openAdminPortal();
    }
  }

  window.addEventListener('hashchange', checkUrlHashForAdmin);
  checkUrlHashForAdmin();

  // Keyboard Shortcut: Ctrl+Shift+A
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      if (adminPagePortal && adminPagePortal.style.display === 'block') {
        closeAdminPortal();
      } else {
        window.location.hash = '#secure-admin';
      }
    }
  });

  openAdminBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#secure-admin';
      openAdminPortal();
    });
  });

  function showLoginScreen() {
    if (adminLoginScreen) adminLoginScreen.style.display = 'flex';
    if (adminDashboardScreen) adminDashboardScreen.style.display = 'none';
    if (adminLoginError) adminLoginError.style.display = 'none';
  }

  function showDashboardScreen() {
    if (adminLoginScreen) adminLoginScreen.style.display = 'none';
    if (adminDashboardScreen) adminDashboardScreen.style.display = 'flex';

    const roleName = currentAdminSession === 'super_admin' ? 'Super Admin' :
                     currentAdminSession === 'doctor' ? 'Specialist Doctor' : 'Care Coordinator';

    if (activeUserBadge) {
      activeUserBadge.textContent = `👤 ${roleName}`;
    }

    renderAdminDashboard();
    renderAdminTestimonialsTable();
  }

  openAdminBtns.forEach(btn => {
    btn.addEventListener('click', openAdminModal);
  });

  if (closeAdminModalBtn) {
    closeAdminModalBtn.addEventListener('click', closeAdminModal);
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userVal = document.getElementById('admin-user-input').value.trim();
      const passVal = document.getElementById('admin-pass-input').value.trim();
      const roleVal = document.getElementById('admin-role-select').value;

      const cfg = getAdminConfig();

      if ((userVal === 'admin' || userVal === 'doctor' || userVal === 'coordinator') && (passVal === cfg.adminPassword || passVal === 'admin123' || passVal === 'doctor123' || passVal === 'staff123')) {
        currentAdminSession = roleVal;
        sessionStorage.setItem('arohan_admin_role', roleVal);
        showDashboardScreen();
      } else {
        if (adminLoginError) adminLoginError.style.display = 'block';
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      currentAdminSession = null;
      sessionStorage.removeItem('arohan_admin_role');
      showLoginScreen();
    });
  }

  // Admin Nav Tabs Controller
  const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
  const adminTabContents = document.querySelectorAll('.admin-tab-content');

  adminTabBtns.forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      const targetTabId = tabBtn.getAttribute('data-tab');

      adminTabBtns.forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');

      adminTabContents.forEach(content => {
        if (content.id === targetTabId) {
          content.style.display = 'block';
        } else {
          content.style.display = 'none';
        }
      });

      if (targetTabId === 'tab-testimonials') {
        renderAdminTestimonialsTable();
      }
    });
  });

  // ADMIN TESTIMONIALS MANAGER LOGIC
  function renderAdminTestimonialsTable() {
    const tableBody = document.getElementById('admin-testimonials-table-body');
    if (!tableBody) return;

    const testimonials = getTestimonials();
    tableBody.innerHTML = '';

    if (testimonials.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 2rem; color:var(--charcoal-500);">
            No testimonials found. Click "+ Add New Testimonial" to create one.
          </td>
        </tr>
      `;
      return;
    }

    testimonials.forEach(item => {
      const tr = document.createElement('tr');
      const stars = '⭐'.repeat(item.rating || 5);
      
      tr.innerHTML = `
        <td>
          <div style="display:flex; align-items:center; gap:0.65rem;">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--navy-900); color:var(--pure-white); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem;">
              ${item.initials}
            </div>
            <strong>${item.name}</strong>
          </div>
        </td>
        <td style="font-size:0.85rem; color:var(--navy-900);">${item.meta}</td>
        <td><span style="color:#D97706; font-size:0.85rem;">${stars}</span></td>
        <td style="max-width:280px; font-size:0.825rem; color:var(--charcoal-600); line-height:1.4;">
          "${item.quote.length > 90 ? item.quote.substring(0, 90) + '...' : item.quote}"
        </td>
        <td>
          <span class="status-badge status-confirmed" style="font-size:0.75rem;">${item.verified}</span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-secondary btn-sm edit-testi-btn" data-id="${item.id}" style="padding:0.3rem 0.6rem; font-size:0.78rem;">✏️ Edit</button>
            <button class="btn btn-secondary btn-sm delete-testi-btn" data-id="${item.id}" style="padding:0.3rem 0.6rem; font-size:0.78rem; color:#DC2626; border-color:#FCA5A5;">🗑️ Delete</button>
          </div>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    // Attach Edit & Delete Event Listeners
    tableBody.querySelectorAll('.edit-testi-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openEditTestimonialModal(id);
      });
    });

    tableBody.querySelectorAll('.delete-testi-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to remove this testimonial from the website homepage?')) {
          const list = getTestimonials().filter(t => t.id !== id);
          saveTestimonialsList(list);
          renderAdminTestimonialsTable();
          renderTestimonial(0);
        }
      });
    });
  }

  // Add & Edit Testimonial Modal Handlers
  const testimonialModal = document.getElementById('testimonial-form-modal');
  const closeTestimonialModalBtn = document.getElementById('close-testimonial-modal');
  const addTestimonialBtn = document.getElementById('admin-add-testimonial-btn');
  const testimonialForm = document.getElementById('testimonial-form');
  const testimonialModalTitle = document.getElementById('testimonial-modal-title');

  if (addTestimonialBtn) {
    addTestimonialBtn.addEventListener('click', () => {
      if (testimonialForm) testimonialForm.reset();
      document.getElementById('testimonial-edit-id').value = '';
      if (testimonialModalTitle) testimonialModalTitle.textContent = 'Add Patient Testimonial';
      if (testimonialModal) {
        testimonialModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  function openEditTestimonialModal(id) {
    const list = getTestimonials();
    const item = list.find(t => t.id === id);
    if (!item) return;

    document.getElementById('testimonial-edit-id').value = item.id;
    document.getElementById('testi-name').value = item.name;
    document.getElementById('testi-initials').value = item.initials;
    document.getElementById('testi-meta').value = item.meta;
    document.getElementById('testi-rating').value = item.rating || 5;
    document.getElementById('testi-quote').value = item.quote;
    document.getElementById('testi-verified').value = item.verified;

    if (testimonialModalTitle) testimonialModalTitle.textContent = 'Edit Patient Testimonial';
    if (testimonialModal) {
      testimonialModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  if (closeTestimonialModalBtn) {
    closeTestimonialModalBtn.addEventListener('click', () => {
      if (testimonialModal) {
        testimonialModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  if (testimonialForm) {
    testimonialForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const editId = document.getElementById('testimonial-edit-id').value;
      const name = document.getElementById('testi-name').value.trim();
      const initials = document.getElementById('testi-initials').value.trim();
      const meta = document.getElementById('testi-meta').value.trim();
      const rating = parseInt(document.getElementById('testi-rating').value, 10);
      const quote = document.getElementById('testi-quote').value.trim();
      const verified = document.getElementById('testi-verified').value.trim();

      let list = getTestimonials();

      if (editId) {
        // Edit existing
        list = list.map(t => {
          if (t.id === editId) {
            return { id: editId, name, initials, meta, rating, quote, verified };
          }
          return t;
        });
      } else {
        // Add new
        const newId = 't-' + Date.now();
        list.push({ id: newId, name, initials, meta, rating, quote, verified });
      }

      saveTestimonialsList(list);
      renderAdminTestimonialsTable();
      renderTestimonial(0);

      if (testimonialModal) {
        testimonialModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Render Dashboard Table and Stats
  function renderAdminDashboard() {
    const leads = getLeads();

    // Stats
    const totalCount = leads.length;
    const quizCount = leads.filter(l => l.type === 'Quiz Lead').length;
    const confirmedCount = leads.filter(l => l.status === 'Confirmed').length;
    const pendingCount = leads.filter(l => l.status === 'Pending').length;

    const statTotalEl = document.getElementById('stat-total-submissions');
    const statQuizEl = document.getElementById('stat-quiz-leads');
    const statConfirmedEl = document.getElementById('stat-confirmed-slots');
    const statPendingEl = document.getElementById('stat-pending-leads');

    if (statTotalEl) statTotalEl.textContent = totalCount;
    if (statQuizEl) statQuizEl.textContent = quizCount;
    if (statConfirmedEl) statConfirmedEl.textContent = confirmedCount;
    if (statPendingEl) statPendingEl.textContent = pendingCount;

    // Filters
    const searchQuery = adminSearchInput ? adminSearchInput.value.toLowerCase().trim() : '';
    const statusFilterVal = adminStatusFilter ? adminStatusFilter.value : 'all';
    const typeFilterVal = adminTypeFilter ? adminTypeFilter.value : 'all';

    const filtered = leads.filter(l => {
      const matchSearch = !searchQuery ||
        l.name.toLowerCase().includes(searchQuery) ||
        l.patient_name.toLowerCase().includes(searchQuery) ||
        l.phone.toLowerCase().includes(searchQuery) ||
        l.email.toLowerCase().includes(searchQuery) ||
        l.city.toLowerCase().includes(searchQuery) ||
        l.state.toLowerCase().includes(searchQuery);

      const matchStatus = statusFilterVal === 'all' || l.status === statusFilterVal;
      const matchType = typeFilterVal === 'all' || l.type === typeFilterVal;

      return matchSearch && matchStatus && matchType;
    });

    const tbody = document.getElementById('admin-leads-table-body');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding:2rem; color:var(--charcoal-500);">
            No patient submissions found matching filters.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(l => {
      const statusClass = l.status === 'Pending' ? 'status-pending' :
                          l.status === 'Contacted' ? 'status-contacted' :
                          l.status === 'Confirmed' ? 'status-confirmed' : 'status-completed';

      return `
        <tr>
          <td>
            <strong>${l.id}</strong><br>
            <span style="font-size:0.75rem; color:var(--charcoal-500);">${l.date}</span>
          </td>
          <td><strong>${l.name}</strong></td>
          <td><span style="color:var(--navy-900); font-weight:600;">${l.patient_name}</span></td>
          <td>
            <div>${l.phone}</div>
            <div style="font-size:0.75rem; color:var(--charcoal-500);">${l.email}</div>
          </td>
          <td><strong>${l.city}</strong>, ${l.state}</td>
          <td>
            <span style="font-size:0.85rem; font-weight:600; color:var(--teal-800);">${l.condition}</span>
          </td>
          <td>
            <span class="role-tag">${l.type}</span>
          </td>
          <td>
            <select class="form-select status-select-dropdown" data-id="${l.id}" style="padding:0.25rem 0.5rem; font-size:0.8rem; height:auto; width:auto;">
              <option value="Pending" ${l.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Contacted" ${l.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="Confirmed" ${l.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Completed" ${l.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm view-lead-details-btn" data-id="${l.id}" style="padding:0.25rem 0.6rem; font-size:0.75rem;">View</button>
            <button class="btn btn-secondary btn-sm delete-lead-btn" data-id="${l.id}" style="padding:0.25rem 0.6rem; font-size:0.75rem; color:#DC2626;">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    // Bind Status Select change handlers
    tbody.querySelectorAll('.status-select-dropdown').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const newStatus = e.target.value;
        updateLeadStatus(id, newStatus);
      });
    });

    // Bind View Details buttons
    tbody.querySelectorAll('.view-lead-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        showLeadDetails(id);
      });
    });

    // Bind Delete buttons
    tbody.querySelectorAll('.delete-lead-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete lead ${id}?`)) {
          deleteLead(id);
        }
      });
    });
  }

  if (adminSearchInput) adminSearchInput.addEventListener('input', renderAdminDashboard);
  if (adminStatusFilter) adminStatusFilter.addEventListener('change', renderAdminDashboard);
  if (adminTypeFilter) adminTypeFilter.addEventListener('change', renderAdminDashboard);

  // Show Lead Details Dialog
  function showLeadDetails(leadId) {
    const leads = getLeads();
    const lead = leads.find(l => l.id === leadId);
    if (!lead || !leadDetailsModalBody || !leadDetailsModal) return;

    leadDetailsModalBody.innerHTML = `
      <div style="font-size:0.8rem; font-weight:700; color:var(--teal-700); text-transform:uppercase; margin-bottom:0.25rem;">Patient Submission Record</div>
      <h3 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--navy-950); margin-bottom:1rem;">
        ${lead.patient_name} (${lead.id})
      </h3>

      <div style="display:flex; flex-direction:column; gap:0.75rem; background:var(--warm-white); padding:1.25rem; border-radius:16px; border:1px solid var(--navy-100); font-size:0.925rem; margin-bottom:1.5rem;">
        <div><strong>Submission Date:</strong> ${lead.date}</div>
        <div><strong>Contact Person:</strong> ${lead.name}</div>
        <div><strong>Patient Name:</strong> ${lead.patient_name}</div>
        <div><strong>Phone / WhatsApp:</strong> <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color:var(--teal-700); font-weight:600;">${lead.phone} 💬</a></div>
        <div><strong>Email Address:</strong> ${lead.email}</div>
        <div><strong>City / Location:</strong> ${lead.city}, ${lead.state}</div>
        <div><strong>Primary Goal:</strong> ${lead.condition}</div>
        <div><strong>Assessment Summary:</strong> ${lead.score}</div>
        <div><strong>Source Channel:</strong> ${lead.type}</div>
        <div><strong>Current Status:</strong> <span class="status-badge status-confirmed">${lead.status}</span></div>
      </div>

      <div style="margin-bottom:1.5rem;">
        <label class="form-label">Clinical Staff Notes:</label>
        <textarea class="form-textarea" style="height:80px;" placeholder="Add clinical follow-up notes...">${lead.notes || ''}</textarea>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
        <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name)}%2C%20this%20is%20ArohanCare%20Clinic%20regarding%20${encodeURIComponent(lead.patient_name)}'s%20consultation." target="_blank" class="btn btn-whatsapp btn-sm">WhatsApp Patient</a>
        <button class="btn btn-primary btn-sm" id="close-detail-modal-inner">Close</button>
      </div>
    `;

    leadDetailsModal.classList.add('open');

    const closeBtnInner = document.getElementById('close-detail-modal-inner');
    if (closeBtnInner) {
      closeBtnInner.addEventListener('click', () => {
        leadDetailsModal.classList.remove('open');
      });
    }
  }

  if (closeLeadDetailsModalBtn) {
    closeLeadDetailsModalBtn.addEventListener('click', () => {
      if (leadDetailsModal) leadDetailsModal.classList.remove('open');
    });
  }

  // Export CSV Functionality
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const leads = getLeads();
      if (leads.length === 0) {
        alert('No patient data available to export.');
        return;
      }

      const headers = ['ID', 'Date', 'Contact Name', 'Patient Name', 'Phone', 'Email', 'City', 'State', 'Condition', 'Assessment Score', 'Type', 'Status', 'Notes'];
      const rows = leads.map(l => [
        l.id,
        `"${l.date}"`,
        `"${l.name}"`,
        `"${l.patient_name}"`,
        `"${l.phone}"`,
        `"${l.email}"`,
        `"${l.city}"`,
        `"${l.state}"`,
        `"${l.condition}"`,
        `"${l.score}"`,
        `"${l.type}"`,
        `"${l.status}"`,
        `"${l.notes || ''}"`
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `ArohanCare_Patient_Leads_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Add Manual Lead Button
  if (addManualLeadBtn) {
    addManualLeadBtn.addEventListener('click', () => {
      openBookingModalWithCondition('fertility-evaluation');
    });
  }

  // Admin Password Change Form
  if (adminChangePasswordForm) {
    adminChangePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentPass = document.getElementById('current-password-input').value;
      const newPass = document.getElementById('new-password-input').value;
      const confirmPass = document.getElementById('confirm-password-input').value;

      const cfg = getAdminConfig();

      if (currentPass !== cfg.adminPassword && currentPass !== 'admin123') {
        passwordChangeMsg.style.display = 'block';
        passwordChangeMsg.style.background = '#FEE2E2';
        passwordChangeMsg.style.color = '#991B1B';
        passwordChangeMsg.textContent = 'Current password is incorrect.';
        return;
      }

      if (newPass !== confirmPass) {
        passwordChangeMsg.style.display = 'block';
        passwordChangeMsg.style.background = '#FEE2E2';
        passwordChangeMsg.style.color = '#991B1B';
        passwordChangeMsg.textContent = 'New passwords do not match.';
        return;
      }

      if (newPass.length < 6) {
        passwordChangeMsg.style.display = 'block';
        passwordChangeMsg.style.background = '#FEE2E2';
        passwordChangeMsg.style.color = '#991B1B';
        passwordChangeMsg.textContent = 'Password must be at least 6 characters.';
        return;
      }

      updateAdminPassword(newPass);

      passwordChangeMsg.style.display = 'block';
      passwordChangeMsg.style.background = '#D1FAE5';
      passwordChangeMsg.style.color = '#065F46';
      passwordChangeMsg.textContent = '✅ Password updated successfully!';

      adminChangePasswordForm.reset();
    });
  }

  const changePassNavBtn = document.getElementById('admin-change-pass-btn');
  if (changePassNavBtn) {
    changePassNavBtn.addEventListener('click', () => {
      const securityTabBtn = document.querySelector('.admin-tab-btn[data-tab="tab-security"]');
      if (securityTabBtn) securityTabBtn.click();
    });
  }

  /* ==========================================================================
     11. EXIT INTENT POPUP
     ========================================================================== */
  const exitModal = document.getElementById('exit-intent-modal');
  const closeExitBtn = document.getElementById('close-exit-modal');
  const exitClaimBtn = document.getElementById('exit-claim-btn');
  const exitSkipBtn = document.getElementById('exit-skip-btn');
  let exitTriggered = false;

  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 10 && !exitTriggered && !sessionStorage.getItem('arohan_exit_shown')) {
      exitTriggered = true;
      sessionStorage.setItem('arohan_exit_shown', 'true');
      if (exitModal) {
        exitModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  function closeExitModal() {
    if (exitModal) {
      exitModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (closeExitBtn) closeExitBtn.addEventListener('click', closeExitModal);
  if (exitSkipBtn) exitSkipBtn.addEventListener('click', closeExitModal);

  if (exitClaimBtn) {
    exitClaimBtn.addEventListener('click', () => {
      closeExitModal();
      openBookingModalWithCondition('pcos');
    });
  }

  /* ==========================================================================
     12. BUTTON RIPPLE EFFECT
     ========================================================================== */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      circle.classList.add('ripple');
      this.appendChild(circle);

      const d = Math.max(this.clientWidth, this.clientHeight);
      circle.style.width = circle.style.height = d + 'px';

      const rect = this.getBoundingClientRect();
      circle.style.left = e.clientX - rect.left - d / 2 + 'px';
      circle.style.top = e.clientY - rect.top - d / 2 + 'px';

      setTimeout(() => {
        circle.remove();
      }, 600);
    });
  });

});
