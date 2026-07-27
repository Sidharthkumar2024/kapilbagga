import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SCROLL PROGRESS BAR & STICKY HEADER
     ========================================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    // Scroll progress bar width
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }

    // Header scrolled class
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     2. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  mobileNavItems.forEach(item => {
    item.addEventListener('click', closeDrawer);
  });

  /* ==========================================================================
     3. ANIMATED COUNTERS VIA INTERSECTION OBSERVER
     ========================================================================== */
  const counterElements = document.querySelectorAll('.counter-num');
  let countersTriggered = false;

  function animateCounters() {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / totalSteps;
        // Ease out quad formula
        const currentVal = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        counter.textContent = currentVal.toLocaleString();

        if (currentStep >= totalSteps) {
          counter.textContent = target.toLocaleString();
          clearInterval(timer);
        }
      }, stepTime);
    });
  }

  const countersSection = document.querySelector('.trust-section');
  if (countersSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersTriggered) {
          countersTriggered = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(countersSection);
  }

  /* ==========================================================================
     4. PATIENT JOURNEY TIMELINE INTERACTION
     ========================================================================== */
  const timelineSteps = document.querySelectorAll('.timeline-step-node');
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineDetailTitle = document.getElementById('timeline-detail-title');
  const timelineDetailDesc = document.getElementById('timeline-detail-desc');

  const stepData = {
    1: {
      title: "Step 1: Book Your Confidential Consultation",
      desc: "Take the first peaceful step by booking an appointment online or via WhatsApp. Our patient relations team confirms your preferred time slot within 15 minutes."
    },
    2: {
      title: "Step 2: 1-on-1 Consultation with Senior Specialist",
      desc: "Meet Dr. Ananya Sharma for a compassionate 45-minute deep-dive into your health history, symptoms, previous attempts, and personal parenthood goals."
    },
    3: {
      title: "Step 3: Advanced Diagnostic Screening & Sonography",
      desc: "Targeted 3D pelvic ultrasound, hormonal assays, and tubal patency evaluation conducted in our soothing, state-of-the-art clinical facility."
    },
    4: {
      title: "Step 4: Tailored Treatment Protocol Design",
      desc: "We design a 100% personalized treatment plan mapped to your exact biology—ranging from PCOS lifestyle regulation to minimal-stimulation ovulation care."
    },
    5: {
      title: "Step 5: Regular Monitoring & 24/7 Dedicated Support",
      desc: "Gentle follicular monitoring, real-time dosage recalibration, and direct access to your dedicated care coordinator throughout your cycle."
    },
    6: {
      title: "Step 6: Celebrating Your Healthy Pregnancy Journey",
      desc: "Confirming your positive pregnancy result and guiding your early prenatal transition until seamless handoff to your obstetrician."
    }
  };

  function updateTimeline(stepNumber) {
    const totalSteps = 6;
    const progressPercentage = ((stepNumber - 1) / (totalSteps - 1)) * 100;
    if (timelineProgress) {
      timelineProgress.style.width = `${progressPercentage}%`;
    }

    timelineSteps.forEach(node => {
      const step = parseInt(node.getAttribute('data-step'), 10);
      if (step <= stepNumber) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    if (stepData[stepNumber]) {
      timelineDetailTitle.textContent = stepData[stepNumber].title;
      timelineDetailDesc.textContent = stepData[stepNumber].desc;
    }
  }

  timelineSteps.forEach(node => {
    node.addEventListener('click', () => {
      const step = parseInt(node.getAttribute('data-step'), 10);
      updateTimeline(step);
    });
  });

  // Auto-advance timeline on scroll
  const timelineSection = document.getElementById('journey');
  if (timelineSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateTimeline(3);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(timelineSection);
  }

  /* ==========================================================================
     5. CONDITIONS WE TREAT - DETAIL MODAL
     ========================================================================== */
  const conditionCards = document.querySelectorAll('.condition-card');
  const conditionModal = document.getElementById('condition-modal');
  const conditionModalBody = document.getElementById('condition-modal-body');
  const closeConditionModalBtn = document.getElementById('close-condition-modal');

  const conditionDetails = {
    pcos: {
      title: "Polycystic Ovary Syndrome (PCOS) Protocol",
      icon: "🌸",
      subtitle: "Comprehensive Endocrine & Metabolic Restorative Care",
      desc: "PCOS affects up to 1 in 5 women. Our evidence-based protocol focuses on reversing insulin resistance, lowering LH/FSH ratios, regulating menstrual timing, and inducing healthy natural ovulation.",
      features: [
        "Metabolic & Insulin Sensitizing Therapies",
        "Targeted Inositol & Anti-Androgen Formulations",
        "Customized Nutrition & Anti-Inflammatory Meal Plan",
        "Ovulation Induction with Low-Dose Letrozole",
        "Follicular Tracking via High-Res 3D Ultrasound"
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
    "hormonal-imbalance": {
      title: "Hormonal Imbalance & Thyroid Wellness",
      icon: "⚖️",
      subtitle: "Balancing Progesterone, Estrogen & Adrenal Health",
      desc: "Hormone fluctuations cause fatigue, mood shifts, and fertility challenges. Our endocrinologists rebalance your hormones safely with bio-identical support.",
      features: [
        "Full Thyroid & Anti-TPO Antibody Panel",
        "Luteal Phase Progesterone Support",
        "Adrenal Cortisol & DHEA Management",
        "Bio-identical Progesterone Supplementation"
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

      if (info) {
        conditionModalBody.innerHTML = `
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">${info.icon}</div>
          <div style="font-size:0.85rem; font-weight:700; color:var(--rose-600); text-transform:uppercase; margin-bottom:0.25rem;">Specialized Care</div>
          <h3 style="font-family:var(--font-serif); font-size:1.8rem; color:var(--emerald-950); margin-bottom:0.5rem;">${info.title}</h3>
          <p style="font-weight:600; color:var(--emerald-800); margin-bottom:1rem;">${info.subtitle}</p>
          <p style="font-size:0.95rem; color:var(--charcoal-600); line-height:1.6; margin-bottom:1.5rem;">${info.desc}</p>
          
          <h4 style="font-weight:700; font-size:1rem; color:var(--emerald-950); margin-bottom:0.75rem;">Key Treatment Elements:</h4>
          <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; margin-bottom:2rem;">
            ${info.features.map(f => `
              <li style="display:flex; align-items:center; gap:0.6rem; font-size:0.9rem; color:var(--charcoal-800);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald-800)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
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

        // Bind the inner booking button inside modal
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
      conditionModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (conditionModal) {
    conditionModal.addEventListener('click', (e) => {
      if (e.target === conditionModal) {
        conditionModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==========================================================================
     6. FERTILITY HEALTH ASSESSMENT QUIZ
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
    if (currentQuizStep >= quizQuestions.length) {
      renderQuizResults();
      return;
    }

    const q = quizQuestions[currentQuizStep];
    quizQuestionText.textContent = q.question;

    const progress = ((currentQuizStep + 1) / quizQuestions.length) * 100;
    if (quizProgressFill) quizProgressFill.style.width = `${progress}%`;

    quizOptionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
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
  }

  function renderQuizResults() {
    const selectedGoal = userQuizAnswers[0]?.key || "fertility-evaluation";
    quizCard.innerHTML = `
      <div style="text-align:center; padding:1rem;">
        <div style="width:70px; height:70px; border-radius:50%; background:var(--emerald-100); color:var(--emerald-800); display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <div style="font-size:0.85rem; font-weight:700; color:var(--gold-600); text-transform:uppercase; margin-bottom:0.5rem;">Assessment Complete</div>
        <h3 style="font-family:var(--font-serif); font-size:1.8rem; color:var(--emerald-950); margin-bottom:0.75rem;">
          Recommended Care: Personalized Fertility & Hormonal Consultation
        </h3>
        <p style="font-size:1rem; color:var(--charcoal-600); max-width:600px; margin:0 auto 1.75rem; line-height:1.6;">
          Based on your answers, our Senior Fertility Specialist Dr. Ananya Sharma recommends a 1-on-1 assessment. You are eligible for a <strong>Priority Consultation Slot</strong> with our medical director.
        </p>

        <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-lg" id="quiz-claim-booking-btn">
            <span>Book Priority Slot Now</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <a href="https://wa.me/919876543210?text=Hi%20ArohanCare%2C%20I%20just%20completed%20the%20fertility%20quiz." target="_blank" class="btn btn-whatsapp btn-lg">
            <span>WhatsApp Results</span>
          </a>
        </div>
      </div>
    `;

    const quizBookingBtn = document.getElementById('quiz-claim-booking-btn');
    if (quizBookingBtn) {
      quizBookingBtn.addEventListener('click', () => {
        openBookingModalWithCondition(selectedGoal);
      });
    }
  }

  renderQuizStep();

  /* ==========================================================================
     7. TESTIMONIALS CAROUSEL SLIDER
     ========================================================================== */
  const testimonials = [
    {
      name: "Priyanka & Rahul M.",
      meta: "Bengaluru • PCOS & Fertility Treatment",
      quote: "After 4 years of struggling with severe PCOS and irregular cycles, we met Dr. Ananya at ArohanCare. Her calm reassurance, precise diagnostic clarity, and personalized care brought us our healthy baby boy in 2025.",
      initials: "P & R",
      verified: "Verified ArohanCare Patient • Baby Born Sept 2025"
    },
    {
      name: "Sneha & Vikram S.",
      meta: "Hyderabad • Pregnancy Planning",
      quote: "The warmth and privacy at ArohanCare is unmatched. Every single person on the care team treats you with deep respect. We conceived naturally within 4 months of their tailored hormone regulation plan!",
      initials: "S & V",
      verified: "Verified ArohanCare Patient • Expecting Twins 2026"
    },
    {
      name: "Aniti & Dev K.",
      meta: "Chennai • Irregular Period & Ovulation Care",
      quote: "We were overwhelmed by generic advice from other clinics. Dr. Ananya listened to us for an hour during our first visit and mapped out a simple, stress-free protocol that worked wonders.",
      initials: "A & D",
      verified: "Verified ArohanCare Patient • Baby Girl Born 2025"
    }
  ];

  let currentTestimonialIndex = 0;
  const testimonialCard = document.getElementById('testimonial-card');
  const prevTestimonialBtn = document.getElementById('prev-testimonial-btn');
  const nextTestimonialBtn = document.getElementById('next-testimonial-btn');
  const carouselDots = document.querySelectorAll('.carousel-dot');

  function renderTestimonial(index) {
    const item = testimonials[index];
    if (!item || !testimonialCard) return;

    testimonialCard.innerHTML = `
      <div style="text-align:center;">
        <div style="width:130px; height:130px; border-radius:50%; background:var(--rose-200); margin:0 auto 1rem; display:flex; align-items:center; justify-content:center; font-family:var(--font-serif); font-size:2.5rem; color:var(--emerald-950); font-weight:700; border:4px solid var(--pure-white); box-shadow:var(--shadow-md);">
          ${item.initials}
        </div>
        <div class="testimonial-author-name">${item.name}</div>
        <div class="testimonial-author-meta">${item.meta}</div>
      </div>

      <div>
        <div class="testimonial-stars">★★★★★</div>
        <blockquote class="testimonial-quote">"${item.quote}"</blockquote>
        <div style="font-size:0.85rem; color:var(--emerald-800); font-weight:600; display:flex; align-items:center; gap:0.4rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          <span>${item.verified}</span>
        </div>
      </div>
    `;

    carouselDots.forEach((dot, dIdx) => {
      if (dIdx === index) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  if (prevTestimonialBtn) {
    prevTestimonialBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonial(currentTestimonialIndex);
    });
  }

  if (nextTestimonialBtn) {
    nextTestimonialBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
      renderTestimonial(currentTestimonialIndex);
    });
  }

  carouselDots.forEach(dot => {
    dot.addEventListener('click', () => {
      currentTestimonialIndex = parseInt(dot.getAttribute('data-index'), 10);
      renderTestimonial(currentTestimonialIndex);
    });
  });

  // Auto slide every 6 seconds
  setInterval(() => {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    renderTestimonial(currentTestimonialIndex);
  }, 6000);

  /* ==========================================================================
     8. FAQ ACCORDION TOGGLE
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => otherItem.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     9. BOOKING MODAL & FORM VALIDATION + CONFETTI
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
    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (conditionKey) {
      const select = document.getElementById('patient-condition');
      if (select) select.value = conditionKey;
    }
  }

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openBookingModalWithCondition();
    });
  });

  if (closeBookingModalBtn) {
    closeBookingModalBtn.addEventListener('click', () => {
      bookingModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patient-name').value;
      const phone = document.getElementById('patient-phone').value;

      document.getElementById('success-patient-name').textContent = name;
      document.getElementById('success-patient-phone').textContent = phone;

      bookingFormContainer.style.display = 'none';
      bookingSuccessContainer.style.display = 'block';

      // Fire confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F4C3A', '#E8A598', '#D4AF37', '#2E7D32']
      });
    });
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      bookingModal.classList.remove('open');
      document.body.style.overflow = '';

      // Reset form
      setTimeout(() => {
        appointmentForm.reset();
        bookingFormContainer.style.display = 'block';
        bookingSuccessContainer.style.display = 'none';
      }, 400);
    });
  }

  /* ==========================================================================
     10. EXIT INTENT POPUP
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
     11. BUTTON RIPPLE EFFECT
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
