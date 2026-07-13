/* MrHostly site interactions: mobile nav, hero chat demo, signup form */

(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- hero chat demo ---------- */
  var chat = document.getElementById("chat-demo");
  var script = [
    { who: "guest", text: "Hi! We just landed — what's the wifi password? 🙈" },
    { who: "host",  text: "Welcome! The network is CasaZonzeel_Guest and the password is sunny-terrace-22. It's also on the fridge magnet.", meta: "MrHostly · replied in 4 seconds" },
    { who: "guest", text: "Perfect, thanks! And can we check out at 12 instead of 11 tomorrow?" },
    { who: "host",  text: "Late checkout until 12:00 is fine tomorrow — the next guests arrive in the evening. Enjoy your stay!", meta: "MrHostly · checked the calendar first" }
  ];

  function renderMessage(item) {
    var div = document.createElement("div");
    div.className = "msg " + (item.who === "guest" ? "msg-guest" : "msg-host");
    div.textContent = item.text;
    if (item.meta) {
      var meta = document.createElement("span");
      meta.className = "msg-meta";
      meta.textContent = item.meta;
      div.appendChild(meta);
    }
    return div;
  }

  function playChat() {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      script.forEach(function (item) { chat.appendChild(renderMessage(item)); });
      return;
    }
    var i = 0;
    function next() {
      if (i >= script.length) return;
      var item = script[i];
      var delay = 900;
      if (item.who === "host") {
        var typing = document.createElement("div");
        typing.className = "msg msg-typing";
        typing.textContent = "• • •";
        chat.appendChild(typing);
        setTimeout(function () {
          typing.remove();
          chat.appendChild(renderMessage(item));
          i++;
          setTimeout(next, delay);
        }, 800);
      } else {
        chat.appendChild(renderMessage(item));
        i++;
        setTimeout(next, delay);
      }
    }
    next();
  }

  if (chat) {
    if ("IntersectionObserver" in window) {
      var started = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !started) {
            started = true;
            playChat();
            io.disconnect();
          }
        });
      }, { threshold: 0.3 });
      io.observe(chat);
    } else {
      playChat();
    }
  }

  /* ---------- signup form (demo) ---------- */
  var form = document.getElementById("signup-form");
  var note = document.getElementById("signup-note");
  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.email.value.trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!valid) {
        note.textContent = "Please enter a valid email address.";
        form.email.focus();
        return;
      }
      form.hidden = true;
      note.textContent = "Thanks! We'll be in touch at " + email + " — keep an eye on your inbox. ✨";
    });
  }
})();
