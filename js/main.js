document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
      var expanded = menu.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
  }

  /* ---- Accordion dropdowns on touch / mobile (handles nested submenus too) ---- */
  var parents = document.querySelectorAll('.nav-menu li');
  parents.forEach(function (li) {
    var link = li.querySelector(':scope > a');
    var dropdown = li.querySelector(':scope > .dropdown');
    if (!dropdown || !link) return;

    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        var isOpen = li.classList.contains('open');
        var siblingLis = li.parentElement.querySelectorAll(':scope > li');
        siblingLis.forEach(function (sib) {
          if (sib !== li) {
            sib.classList.remove('open');
            sib.querySelectorAll('li.open').forEach(function (nested) { nested.classList.remove('open'); });
          }
        });
        li.classList.toggle('open', !isOpen);
      }
    });
  });

  /* Close mobile menu when a real link (no children) is clicked */
  document.querySelectorAll('.nav-menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth <= 991 && !a.parentElement.querySelector('.dropdown')) {
        menu.classList.remove('open');
      }
    });
  });

  /* Reset menu state on resize back to desktop */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 991) {
      menu && menu.classList.remove('open');
      parents.forEach(function (li) { li.classList.remove('open'); });
    }
  });

  /* ---- WhatsApp enquiry helpers ---- */
  var COLLEGE_WHATSAPP_NUMBER = '917700935913';

  function restrictToDigits(input, maxLen) {
    if (!input) return;
    input.addEventListener('input', function () {
      var digits = input.value.replace(/\D/g, '').slice(0, maxLen);
      if (digits !== input.value) input.value = digits;
    });
  }

  function buildWhatsAppLink(name, email, phone, course) {
    var lines = [
      'Hello JHL Law College, I would like to enquire about admission.',
      'Name: ' + name,
      email ? 'Email: ' + email : null,
      'Phone: ' + phone,
      'Enquiry about: ' + course
    ].filter(Boolean);
    var text = encodeURIComponent(lines.join('\n'));
    return 'https://wa.me/' + COLLEGE_WHATSAPP_NUMBER + '?text=' + text;
  }

  /* ---- Enquiry / Choose Your Course form (redirects to WhatsApp) ---- */
  var enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    var enqPhoneInput = document.getElementById('enqPhone');
    restrictToDigits(enqPhoneInput, 10);

    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('formMsg');
      var name = document.getElementById('enqName').value.trim();
      var email = document.getElementById('enqEmail').value.trim();
      var phone = enqPhoneInput.value.trim();
      var course = document.getElementById('enqCourse').value;

      if (!name) {
        msg.style.color = '#a61d33';
        msg.textContent = 'Please enter your name to continue.';
        return;
      }
      if (!/^[0-9]{10}$/.test(phone)) {
        msg.style.color = '#a61d33';
        msg.textContent = 'Please enter a valid 10-digit phone number.';
        return;
      }
      if (!course) {
        msg.style.color = '#a61d33';
        msg.textContent = 'Please select a course.';
        return;
      }

      msg.style.color = '#1c8a4b';
      msg.textContent = 'Thank you, ' + name + '! Taking you to WhatsApp to send your enquiry\u2026';

      var waLink = buildWhatsAppLink(name, email, phone, course);
      enquiryForm.reset();
      setTimeout(function () {
        window.open(waLink, '_blank', 'noopener');
      }, 600);
    });
  }

  /* ---- Course detail pages: "Enquire Now" form (redirects to WhatsApp) ---- */
  var cpForm = document.querySelector('.cp-form');
  if (cpForm) {
    var cpPhone = cpForm.querySelector('.cp-phone');
    restrictToDigits(cpPhone, 10);
    cpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = cpForm.querySelector('.cp-msg');
      var name = cpForm.querySelector('.cp-name').value.trim();
      var phone = cpPhone.value.trim();
      var course = cpForm.querySelector('.cp-course').value;
      msg.style.color = '#a61d33';
      if (!name) { msg.textContent = 'Please enter your full name.'; return; }
      if (!course) { msg.textContent = 'Please select a course.'; return; }
      if (!/^[0-9]{10}$/.test(phone)) { msg.textContent = 'Please enter a valid 10-digit mobile number.'; return; }
      msg.style.color = '#1c8a4b';
      msg.textContent = 'Thank you, ' + name + '! Taking you to WhatsApp to send your enquiry\u2026';
      var waLink = buildWhatsAppLink(name, '', phone, course);
      setTimeout(function () { window.open(waLink, '_blank', 'noopener'); }, 600);
    });
  }

  /* ---- Site-wide "Choose Your Course" popup ---- */
  (function () {
    var overlay = document.createElement('div');
    overlay.className = 'course-modal-overlay';
    overlay.id = 'courseModalOverlay';
    overlay.innerHTML =
      '<div class="course-modal" role="dialog" aria-modal="true" aria-labelledby="courseModalTitle">' +
        '<button type="button" class="course-modal-close" id="courseModalClose" aria-label="Close">&times;</button>' +
        '<h3 id="courseModalTitle">Choose Your Course</h3>' +
        '<p>Share your details and our admissions team will help you find the right programme for you.</p>' +
        '<form class="enquiry-form" id="courseModalForm">' +
          '<input type="text" id="courseModalName" placeholder="Your name" required>' +
          '<input type="email" id="courseModalEmail" placeholder="Your email" required>' +
          '<input type="tel" id="courseModalPhone" placeholder="Your 10-digit phone number" required maxlength="10" inputmode="numeric" pattern="[0-9]{10}" title="Enter a 10-digit mobile number">' +
          '<select id="courseModalCourse" required>' +
            '<option value="" selected disabled>Course you are interested in</option>' +
            '<option>B.A.LL.B. (5 years Law Course)</option>' +
            '<option>LL.B (3 Years Law Course)</option>' +
            '<option>LL.M</option>' +
            '<option>Post Graduation Diploma Course in Intellectual Property Rights</option>' +
            '<option>Post Graduation Diploma in Cyber Law</option>' +
            '<option>Post Graduation Diploma in Taxation Law</option>' +
          '</select>' +
          '<button type="submit" class="btn btn-maroon btn-block">Submit</button>' +
          '<div class="form-msg" id="courseModalMsg"></div>' +
        '</form>' +
      '</div>';
    document.body.appendChild(overlay);

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'course-modal-trigger';
    trigger.id = 'courseModalTrigger';
    trigger.setAttribute('aria-label', 'Choose your course');
    trigger.innerHTML = '&#127891;';
    document.body.appendChild(trigger);

    function openModal() {
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    trigger.addEventListener('click', openModal);
    document.getElementById('courseModalClose').addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    var modalForm = document.getElementById('courseModalForm');
    var modalPhoneInput = document.getElementById('courseModalPhone');
    restrictToDigits(modalPhoneInput, 10);

    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('courseModalMsg');
      var name = document.getElementById('courseModalName').value.trim();
      var email = document.getElementById('courseModalEmail').value.trim();
      var phone = modalPhoneInput.value.trim();
      var course = document.getElementById('courseModalCourse').value;

      if (!name) {
        msg.style.color = '#a61d33';
        msg.textContent = 'Please enter your name to continue.';
        return;
      }
      if (!/^[0-9]{10}$/.test(phone)) {
        msg.style.color = '#a61d33';
        msg.textContent = 'Please enter a valid 10-digit phone number.';
        return;
      }
      if (!course) {
        msg.style.color = '#a61d33';
        msg.textContent = 'Please select a course.';
        return;
      }

      msg.style.color = '#1c8a4b';
      msg.textContent = 'Thank you, ' + name + '! Taking you to WhatsApp to send your enquiry\u2026';

      var waLink = buildWhatsAppLink(name, email, phone, course);
      modalForm.reset();
      setTimeout(function () {
        window.open(waLink, '_blank', 'noopener');
        closeModal();
      }, 900);
    });

    /* Show automatically once per browser session */
    if (!sessionStorage.getItem('saileeCourseModalShown')) {
      setTimeout(function () {
        var ap = document.getElementById('applyModal');
        if (ap && !ap.hidden) return; /* don't cover the Apply form */
        openModal();
        sessionStorage.setItem('saileeCourseModalShown', '1');
      }, 1400);
    }
  })();

  /* ---- Campus Videos grid (homepage) ----
     The four video cards are plain HTML (poster image + native controls),
     so they always render even before this script runs / on slow
     connections. This just adds one small enhancement: pause any other
     playing reel when a new one starts. */
  var reelsGrid = document.getElementById('reelsGrid');
  if (reelsGrid) {
    var reelVideos = reelsGrid.querySelectorAll('video.reel-video');
    reelVideos.forEach(function (v) {
      v.addEventListener('play', function () {
        reelVideos.forEach(function (other) {
          if (other !== v) other.pause();
        });
      });
    });
  }

  /* ---- Home notices tabs ---- */
  var noticeTabs = document.getElementById('noticeTabs');
  if (noticeTabs) {
    var tabButtons = noticeTabs.querySelectorAll('.notice-tab');
    var panels = document.querySelectorAll('.notice-list');
    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var target = btn.getAttribute('data-tab');
        panels.forEach(function (p) {
          p.style.display = (p.getAttribute('data-panel') === target) ? '' : 'none';
        });
      });
    });
  }

  /* ---- Highlight current nav link ---- */
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu > li > a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here) {
      a.parentElement.classList.add('active');
    }
  });


  /* ---- Recruitment: Apply Now modal ----
     Validates the form, then opens WhatsApp (wa.me) with all details filled in.
     On phones that support file sharing, the CV is passed along too. */
  var apOpen = document.getElementById('applyOpen');
  var apModal = document.getElementById('applyModal');
  if (apOpen && apModal) {
    var WA_NUMBER = '917700935913';                       /* same number as the corner WhatsApp button */
    var MAX = 5 * 1024 * 1024;
    var apForm = document.getElementById('applyForm');
    var apMsg = document.getElementById('applyMsg');
    var apCv = document.getElementById('apCv');
    var apFile = document.getElementById('apFileName');
    var apBtn = document.getElementById('applySubmit');

    function apShow(t, c) { apMsg.textContent = t; apMsg.className = 'apply-msg ' + (c || ''); }
    function apOpenFn() { apModal.hidden = false; document.body.classList.add('modal-open'); setTimeout(function () { document.getElementById('apName').focus(); }, 50); }
    function apCloseFn() { apModal.hidden = true; document.body.classList.remove('modal-open'); }
    apOpen.addEventListener('click', apOpenFn);
    document.getElementById('applyClose').addEventListener('click', apCloseFn);
    apModal.addEventListener('click', function (e) { if (e.target === apModal) apCloseFn(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !apModal.hidden) apCloseFn(); });
    apForm.Phone.addEventListener('input', function () { this.value = this.value.replace(/\D/g, '').slice(0, 10); });
    apCv.addEventListener('change', function () {
      apFile.textContent = apCv.files.length ? apCv.files[0].name : '';
    });

    apForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = apForm.Name.value.trim();
      var email = apForm.email.value.trim();
      var phone = apForm.Phone.value;
      var f = apCv.files[0];
      if (name.length < 2) { apShow('Please enter your full name.', 'err'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { apShow('Please enter a valid email address.', 'err'); return; }
      if (!/^\d{10}$/.test(phone)) { apShow('Please enter a valid 10-digit phone number.', 'err'); return; }
      if (!apForm.Education.value) { apShow('Please select your education.', 'err'); return; }
      if (!apForm['Job Position'].value) { apShow('Please select the job position.', 'err'); return; }
      if (!f) { apShow('Please upload your CV (PDF or Word).', 'err'); return; }
      if (!/\.(pdf|doc|docx)$/i.test(f.name)) { apShow('CV must be a PDF or Word file.', 'err'); return; }
      if (f.size > MAX) { apShow('CV file is too large. Max size is 5 MB.', 'err'); return; }

      var d = { name: name, email: email, phone: phone, education: apForm.Education.value,
                position: apForm['Job Position'].value, file: f.name };

      var text = 'Job Application - JHL Law College\nName: ' + d.name + '\nEmail: ' + d.email +
                 '\nPhone: ' + d.phone + '\nHighest Education: ' + d.education +
                 '\nJob Position: ' + d.position + '\nCV: ' + d.file;

      function openChat() {
        /* same route as the corner WhatsApp button: a wa.me link in a new tab */
        var a = document.createElement('a');
        a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
        a.target = '_blank'; a.rel = 'noopener';
        document.body.appendChild(a); a.click(); a.remove();
        apShow('WhatsApp is opening with your details. WhatsApp cannot attach files from a website, so please tap the paperclip (\uD83D\uDCCE) in the chat, choose "' + d.file + '" and press Send. Your application is not sent until you do.', '');
      }

      /* Phones: the share sheet can pass the CV file itself to WhatsApp */
      if (navigator.canShare && navigator.canShare({ files: [f] })) {
        navigator.share({ files: [f], text: text }).then(function () {
          apShow('Choose WhatsApp, open the JHL Law College chat (+91 77009 35913) and press Send. Your application is not sent until you do.', '');
        }).catch(function (err) {
          if (err && err.name === 'AbortError') { apShow('Sharing was cancelled. Tap the button again to retry.', 'err'); }
          else { openChat(); }
        });
      } else {
        openChat();
      }
    });
  }
});
