// Mobile menu
var toggle = document.querySelector('.nav-toggle');
var menu = document.getElementById('menu');
if (toggle && menu) {
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// Rotating role line (stays still if the visitor prefers reduced motion)
var role = document.getElementById('role');
var roles = ['email designer', 'email marketing specialist', 'newsletter strategist'];
if (role && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  var i = 0;
  setInterval(function () {
    role.classList.add('fade');
    setTimeout(function () {
      i = (i + 1) % roles.length;
      role.textContent = roles[i];
      role.classList.remove('fade');
    }, 250);
  }, 2800);
}

// "Does your brand need my service?" self check
var tracks = [
  { items: [
      "I get plenty of visitors, but few of them buy",
      "I pay for ads or posts, but have no follow up after the first visit",
      "Shoppers add to cart and disappear, and I do nothing about it",
      "I don’t have time to set up or learn an email platform",
      "I don’t have the budget for a full email setup" ],
    msg: "Traffic is expensive to earn, and email is how you keep the visitors you’ve already paid for. I can set up your platform, sign up form, welcome flow and abandoned cart emails, and we can start with the essentials." },
  { items: [
      "My flows were built a few years ago and haven’t been updated since",
      "My emails get opened, but few people click or buy",
      "My emails look dated, or don’t match my website",
      "I’m paying more than I’d like for email, and I’m not sure it’s worth it",
      "I run my own emails, but I don’t have enough time" ],
    msg: "You already have a base to build on. I can review your flows, refresh the design and copy, and take the day to day work off your plate." }
];
var checkList = document.getElementById('check-list');
var checkMsg = document.getElementById('check-msg');
var checkBtn = document.getElementById('check-btn');
var tabButtons = document.querySelectorAll('.tabs button');
var current = 0;

function updateResult() {
  var ticked = checkList.querySelectorAll('input:checked').length;
  checkMsg.textContent = ticked ? tracks[current].msg : 'Not sure yet? Tick anything that sounds like your brand.';
  checkBtn.hidden = !ticked;
}
function renderTrack(n) {
  current = n;
  checkList.innerHTML = '';
  tracks[n].items.forEach(function (text) {
    var li = document.createElement('li');
    var label = document.createElement('label');
    var box = document.createElement('input');
    var span = document.createElement('span');
    box.type = 'checkbox';
    span.textContent = text;
    box.addEventListener('change', updateResult);
    label.appendChild(box);
    label.appendChild(span);
    li.appendChild(label);
    checkList.appendChild(li);
  });
  tabButtons.forEach(function (b, i) { b.setAttribute('aria-selected', i === n); });
  updateResult();
}
if (checkList) {
  tabButtons.forEach(function (b, i) {
    b.addEventListener('click', function () { renderTrack(i); });
  });
  renderTrack(0);
}
