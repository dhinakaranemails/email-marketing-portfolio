// Email Designs page: category buttons, gallery, and a full screen viewer
// where the designs continue one after another until the last one.
//
// HOW IT FINDS YOUR IMAGES
// Each category looks in its folder for files named brand-type-number
// (for example images/jewellery/auren-newsletter-01.jpg), starting at 01 and
// counting up until a number is missing. So number your files in order, with
// no gaps. The page tries .jpg first, then .jpeg, .png and .webp.
// "max" is just a safety limit on how many designs a category can hold.
var categories = [
  { label: 'Activewear',          folder: 'images/activewear',      brand: 'tidemark', brandLabel: 'Tidemark', type: 'newsletter', typeLabel: 'Newsletter', max: 40 },
  { label: 'Jewellery',           folder: 'images/jewellery',       brand: 'auren',    brandLabel: 'Auren',    type: 'newsletter', typeLabel: 'Newsletter', max: 40 },
  { label: 'Beauty and Skincare', folder: 'images/beauty-skincare', brand: 'dewlight', brandLabel: 'Dewlight', type: 'newsletter', typeLabel: 'Newsletter', max: 40 }
];
var extensions = ['jpg', 'jpeg', 'png', 'webp'];

var filters = document.getElementById('filters');
var gallery = document.getElementById('gallery');
var empty = document.getElementById('empty');
var viewer = document.getElementById('viewer');
var feed = document.getElementById('feed');

var groups = [];      // one container per category, in button order
var done = [];        // true once a category has finished loading
var catButtons = [];
var showAllBtn = null;
var active = -1;      // -1 means every category is showing

function two(n) { return n < 10 ? '0' + n : String(n); }

function updateEmpty() {
  var list = [];
  categories.forEach(function (c, i) { if (active === -1 || active === i) list.push(i); });
  var finished = list.every(function (i) { return done[i]; });
  var count = gallery.querySelectorAll('.group:not([hidden]) .card').length;
  empty.hidden = !(finished && count === 0);
  if (!empty.hidden) {
    // Troubleshooting help: press F12 in the browser and open Console.
    list.forEach(function (i) {
      var c = categories[i];
      console.warn('No images found for "' + c.label + '". Expected a file like ' +
        c.folder + '/' + c.brand + '-' + c.type + '-01.jpg');
    });
  }
}

function selectCategory(i) {
  active = i;
  groups.forEach(function (g, j) { g.hidden = j !== i; });
  catButtons.forEach(function (b, j) { b.setAttribute('aria-pressed', j === i); });
  showAllBtn.hidden = false;
  updateEmpty();
}
function showAll() {
  active = -1;
  groups.forEach(function (g) { g.hidden = false; });
  catButtons.forEach(function (b) { b.setAttribute('aria-pressed', false); });
  showAllBtn.hidden = true;
  updateEmpty();
}

function tryExtension(base, e, ok, fail) {
  if (e >= extensions.length) { fail(); return; }
  var src = base + '.' + extensions[e];
  var probe = new Image();
  probe.onload = function () { ok(src, probe); };
  probe.onerror = function () { tryExtension(base, e + 1, ok, fail); };
  probe.src = src;
}

function addCard(cat, i, n, src, probe) {
  var caption = cat.brandLabel + ' ' + cat.typeLabel.toLowerCase() + ', email ' + n;
  var card = document.createElement('button');
  card.type = 'button';
  card.className = 'card';
  card.dataset.src = src;
  card.dataset.caption = caption;
  card.dataset.w = probe.naturalWidth;
  card.dataset.h = probe.naturalHeight;
  card.setAttribute('aria-label', 'Open ' + caption);

  var frame = document.createElement('span');
  frame.className = 'frame';
  var img = document.createElement('img');
  img.src = src;
  img.alt = caption;
  img.loading = 'lazy';
  img.decoding = 'async';
  frame.appendChild(img);

  var cap = document.createElement('span');
  cap.className = 'cap';
  cap.innerHTML = '<strong></strong><span></span>';
  cap.firstChild.textContent = cat.brandLabel;
  cap.lastChild.textContent = cat.typeLabel + ' ' + n;

  card.appendChild(frame);
  card.appendChild(cap);
  card.addEventListener('click', function () { openViewer(card); });
  groups[i].appendChild(card);
  updateEmpty();
}

function loadCategory(cat, i) {
  var n = 1;
  function finish() { done[i] = true; updateEmpty(); }
  function next() {
    if (n > cat.max) { finish(); return; }
    var base = cat.folder + '/' + cat.brand + '-' + cat.type + '-' + two(n);
    tryExtension(base, 0, function (src, probe) {
      addCard(cat, i, n, src, probe);
      n++;
      next();
    }, finish);
  }
  next();
}

// Full screen viewer: every design that is currently showing, one after another.
function openViewer(clicked) {
  var cards = gallery.querySelectorAll('.group:not([hidden]) .card');
  var target = null;
  feed.innerHTML = '';
  Array.prototype.forEach.call(cards, function (card) {
    var fig = document.createElement('figure');
    fig.className = 'feed-item';
    var cap = document.createElement('figcaption');
    cap.textContent = card.dataset.caption;
    var img = document.createElement('img');
    img.src = card.dataset.src;
    img.alt = card.dataset.caption;
    img.loading = 'lazy';
    img.decoding = 'async';
    if (Number(card.dataset.w) && Number(card.dataset.h)) {
      img.width = Number(card.dataset.w);
      img.height = Number(card.dataset.h);
    }
    fig.appendChild(cap);
    fig.appendChild(img);
    feed.appendChild(fig);
    if (card === clicked) target = fig;
  });
  var end = document.createElement('div');
  end.className = 'feed-end';
  end.innerHTML = '<button type="button" class="btn btn-light">Back to designs</button>';
  end.firstChild.addEventListener('click', function () { viewer.close(); });
  feed.appendChild(end);

  document.body.classList.add('viewer-open');
  viewer.showModal();
  viewer.scrollTop = 0;
  if (target) target.scrollIntoView({ block: 'start' });
}

if (filters && gallery) {
  categories.forEach(function (cat, i) {
    var group = document.createElement('div');
    group.className = 'group';
    gallery.appendChild(group);
    groups.push(group);
    done.push(false);

    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = cat.label;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { selectCategory(i); });
    filters.appendChild(b);
    catButtons.push(b);
  });
  showAllBtn = document.createElement('button');
  showAllBtn.type = 'button';
  showAllBtn.className = 'show-all';
  showAllBtn.textContent = 'Show all';
  showAllBtn.hidden = true;
  showAllBtn.addEventListener('click', showAll);
  filters.appendChild(showAllBtn);

  categories.forEach(loadCategory);

  document.getElementById('viewer-close').addEventListener('click', function () { viewer.close(); });
  viewer.addEventListener('close', function () {
    document.body.classList.remove('viewer-open');
    feed.innerHTML = '';
  });
}
