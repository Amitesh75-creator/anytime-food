(function () {
  var products = [
    { id: 1, name: 'Chicken Curry Paste', img: 'assets/chicken-curry-served.jpg', alt: 'Chicken curry served in a pan', desc: 'Bold Andhra-style chicken curry, deeply spiced with whole spices, fresh coconut and sun-dried red chillies.', price: 199, time: '20 min', shelf: '18 months', steps: ['Heat 2 tbsp oil in a pan on medium flame', 'Add 2 heaped tbsp of paste and saute for 2 minutes until fragrant', 'Add 500g chicken pieces, coat well and cook for 5 minutes', 'Add 1 cup water, cover and simmer on low heat for 15 minutes', 'Garnish with fresh coriander and serve hot with rice or roti'] },
    { id: 2, name: 'Biryani Paste', img: 'assets/chicken-biryani.jpg', alt: 'Bowl of chicken biryani', desc: 'Everything a good dum biryani needs: whole spices, fried onion, ginger-garlic and saffron. Made for chicken, mutton or vegetables.', price: 249, time: '30 min', shelf: '18 months', steps: ['Marinate 500g chicken or mutton with 3 tbsp paste and 1/2 cup yogurt for 30 minutes', 'Cook the marinated meat in a heavy-bottomed pot on medium heat for 10 minutes', 'Layer with 2 cups of parboiled basmati rice', 'Sprinkle fried onions and a pinch of saffron soaked in milk', 'Cover tightly and dum cook on the lowest flame for 20 minutes, then rest for 5'] }
  ];
  var nav = [['home', 'Home'], ['shop', 'Shop'], ['cook', 'How to cook'], ['steps', 'Cooking Instructions'], ['about', 'About'], ['contact', 'Contact']];
  var $ = function (id) { return document.getElementById(id); };
  var page = 'home';
  var cart = [];

  // static lists
  nav.forEach(function (n) {
    $('links').insertAdjacentHTML('beforeend', '<button type="button" class="link" data-go="' + n[0] + '">' + n[1] + '</button>');
    $('sheet').insertAdjacentHTML('beforeend', '<button type="button" data-go="' + n[0] + '">' + n[1] + '</button>');
    $('foot-nav').insertAdjacentHTML('beforeend', '<button type="button" data-go="' + n[0] + '">' + n[1] + '</button>');
  });
  products.forEach(function (p) {
    $('tiles').insertAdjacentHTML('beforeend',
      '<article class="tile"><img src="' + p.img + '" alt="' + p.alt + '"><div class="tile-copy"><span class="tile-tag">' + p.time + '</span><h3 class="gl">' + p.name + '</h3><div class="tile-row"><span class="tile-price">₹' + p.price + '</span><button type="button" class="btn fill" data-add="' + p.id + '">Add to cart</button></div></div></article>');
    $('shop-list').insertAdjacentHTML('beforeend',
      '<article class="prod"><div class="prod-photo"><img src="' + p.img + '" alt="' + p.alt + '"></div><div><span class="eyebrow">Ready to cook</span><h2 class="gl">' + p.name + '</h2><p>' + p.desc + '</p><div class="facts"><span class="fact">' + p.time + '</span><span class="fact">' + p.shelf + ' shelf life</span><span class="fact">No artificial preservatives</span></div><div class="buy"><span class="price">₹' + p.price + '</span><button type="button" class="btn red" data-add="' + p.id + '">Add to cart</button></div></div></article>');
    $('cook-list').insertAdjacentHTML('beforeend',
      '<article class="rec"><div class="video"><span>[VIDEO: how to cook with ' + p.name + ']</span></div><div><span class="eyebrow">' + p.time + '</span><h2 class="gl">' + p.name + '</h2><ol>' +
      p.steps.map(function (s, i) { return '<li><span>' + (i + 1) + '</span>' + s + '</li>'; }).join('') + '</ol></div></article>');
  });

  // pages
  function solidTop() {
    $('top').classList.toggle('solid', window.scrollY > 60 || page !== 'home' || !$('sheet').hidden);
  }
  function show(id, instant) {
    page = id;
    document.querySelectorAll('[data-page]').forEach(function (el) { el.hidden = el.dataset.page !== id; });
    document.querySelectorAll('.link').forEach(function (el) { el.classList.toggle('on', el.dataset.go === id); });
    $('sheet').hidden = true;
    $('burger').textContent = 'Menu';
    setCart(false);
    reelPlay(false);
    reelSeek(0);
    window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' });
    solidTop();
  }
  function fromHash() {
    var id = location.hash.slice(1);
    show(document.querySelector('[data-page="' + id + '"]') ? id : 'home', true);
  }
  window.addEventListener('hashchange', fromHash);
  window.addEventListener('scroll', solidTop, { passive: true });

  // cart
  function setCart(open) {
    $('drawer').hidden = !open;
    $('scrim').hidden = !open;
  }
  function add(id) {
    var hit = cart.find(function (c) { return c.id === id; });
    if (hit) hit.qty++; else cart.push({ id: id, qty: 1 });
    drawCart();
    setCart(true);
  }
  function change(id, delta) {
    cart.forEach(function (c) { if (c.id === id) c.qty += delta; });
    cart = cart.filter(function (c) { return c.qty > 0; });
    drawCart();
  }
  function drawCart() {
    var rows = cart.map(function (c) {
      return { c: c, p: products.find(function (x) { return x.id === c.id; }) };
    });
    var total = rows.reduce(function (n, r) { return n + r.p.price * r.c.qty; }, 0);
    $('cart-count').textContent = cart.reduce(function (n, c) { return n + c.qty; }, 0);
    $('cart-total').textContent = $('co-total').textContent = '₹' + total;
    $('cart-end').hidden = !rows.length;
    $('cart-items').innerHTML = rows.length ? rows.map(function (r) {
      return '<div class="row"><img src="' + r.p.img + '" alt="' + r.p.name + '"><div><div class="row-name">' + r.p.name + '</div><div>₹' + r.p.price + '</div><div class="qty"><button type="button" data-qty="' + r.c.id + ',-1" aria-label="One less">−</button><span>' + r.c.qty + '</span><button type="button" data-qty="' + r.c.id + ',1" aria-label="One more">+</button><button type="button" data-qty="' + r.c.id + ',' + (-r.c.qty) + '" aria-label="Remove ' + r.p.name + '">✕</button></div></div></div>';
    }).join('') : '<div class="empty"><p>Nothing in here yet.</p><button type="button" data-go="shop">Go to the shop</button></div>';
    $('co-items').innerHTML = rows.length ? rows.map(function (r) {
      return '<div class="sum"><span>' + r.p.name + ' × ' + r.c.qty + '</span><span>₹' + r.p.price * r.c.qty + '</span></div>';
    }).join('') : '<p>Your cart is empty.</p>';
  }

  // the step-by-step video
  var scenes = [['Step 1', 'Cook the chicken', 'Chicken'], ['Step 2', 'Add the curry paste', 'Paste'], ['Step 3', 'Add water', 'Water'], ['Step 3', 'Wait a few minutes', 'Wait'], ['Ready', 'Dinner is served', 'Serve']];
  var SCENE = 5, TOTAL = 25, t = 0, tick = null;
  var shots = $('reel').querySelectorAll('img');
  var time = $('reel-time');
  scenes.forEach(function (s, i) {
    time.insertAdjacentHTML('beforebegin', '<button type="button" class="chap" data-scene="' + i + '">' + s[2] + '</button>');
  });
  var chaps = document.querySelectorAll('[data-scene]');
  function reelDraw() {
    var now = Math.min(Math.floor(t / SCENE), scenes.length - 1);
    var secs = Math.floor(t);
    shots.forEach(function (img, i) { img.classList.toggle('on', i === now); });
    chaps.forEach(function (b, i) { b.classList.toggle('on', i === now); });
    $('reel-tag').textContent = scenes[now][0];
    $('reel-title').textContent = scenes[now][1];
    $('reel-fill').style.width = (t / TOTAL * 100) + '%';
    time.textContent = '0:' + (secs < 10 ? '0' : '') + secs + ' / 0:25';
    $('reel-toggle').textContent = tick ? 'Pause' : (t >= TOTAL ? 'Replay' : 'Play');
    $('reel-play').hidden = !!tick;
    $('reel').classList.toggle('paused', !tick);
  }
  function reelSeek(sec) { t = sec; reelDraw(); }
  function reelPlay(on) {
    clearInterval(tick);
    tick = null;
    if (on) {
      if (t >= TOTAL) t = 0;
      tick = setInterval(function () {
        t += 0.1;
        if (t >= TOTAL) { t = TOTAL; reelPlay(false); } else reelDraw();
      }, 100);
    }
    reelDraw();
  }

  // clicks
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.go) {
      setCart(false);
      if (location.hash.slice(1) === b.dataset.go || (b.dataset.go === 'home' && !location.hash)) show(b.dataset.go);
      else location.hash = b.dataset.go;
    } else if (b.dataset.add) add(+b.dataset.add);
    else if (b.dataset.qty) {
      var q = b.dataset.qty.split(',');
      change(+q[0], +q[1]);
    } else if ('cart' in b.dataset) setCart($('drawer').hidden);
    else if (b.dataset.scene) { reelSeek(b.dataset.scene * SCENE); reelPlay(true); }
    else if (b.id === 'scrim') setCart(false);
    else if (b.id === 'reel-toggle' || b.id === 'reel-play') reelPlay(!tick);
    else if (b.id === 'burger') {
      $('sheet').hidden = !$('sheet').hidden;
      b.textContent = $('sheet').hidden ? 'Menu' : 'Close';
      solidTop();
    } else if (b.id === 'c-send') $('c-note').hidden = false;
    else if (b.id === 'co-place') $('co-note').hidden = false;
  });

  // welcome screen
  var splash = $('atf-splash');
  var closed = false;
  function closeSplash() {
    if (closed) return;
    closed = true;
    splash.classList.add('fading');
    setTimeout(function () { splash.remove(); }, 500);
  }
  function pop() {
    try {
      var ac = new (window.AudioContext || window.webkitAudioContext)();
      [[0, 523, 0.18], [0.05, 659, 0.15], [0.1, 784, 0.15], [0.15, 1047, 0.18], [0.22, 1319, 0.14]].forEach(function (n) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.connect(g);
        g.connect(ac.destination);
        o.frequency.value = n[1];
        o.type = 'sine';
        g.gain.setValueAtTime(0, ac.currentTime + n[0]);
        g.gain.linearRampToValueAtTime(n[2], ac.currentTime + n[0] + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + n[0] + 0.28);
        o.start(ac.currentTime + n[0]);
        o.stop(ac.currentTime + n[0] + 0.3);
      });
    } catch (err) {}
  }
  function confetti() {
    var colors = ['#9B2F17', '#7A2211', '#DE9B2C', '#EDB04A', '#26160F', '#C4581F'];
    for (var i = 0; i < 90; i++) {
      var el = document.createElement('div');
      var size = (Math.random() * 8 + 5).toFixed(1) + 'px';
      el.className = 'confetti';
      el.style.cssText = 'left:' + (Math.random() * 100).toFixed(1) + 'vw;width:' + size + ';height:' + size + ';background:' + colors[i % colors.length] + ';border-radius:' + (Math.random() > 0.5 ? '50%' : '2px') + ';animation-duration:' + (Math.random() * 1.8 + 1).toFixed(2) + 's;animation-delay:' + (Math.random() * 0.4).toFixed(2) + 's';
      document.body.appendChild(el);
      setTimeout(el.remove.bind(el), 3200);
    }
  }
  var tapped = false;
  $('splash-tap').addEventListener('click', function () {
    if (tapped) return;
    tapped = true;
    pop();
    confetti();
    setTimeout(closeSplash, 600);
  });
  setTimeout(closeSplash, 8000); // never leave a visitor stuck on the welcome screen

  var canvas = $('splash-canvas');
  var ctx = canvas.getContext('2d');
  var w = canvas.width = canvas.offsetWidth;
  var h = canvas.height = canvas.offsetHeight;
  var dots = [];
  for (var i = 0; i < 55; i++) {
    dots.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + 0.4, dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3, o: Math.random() * 0.35 + 0.1 });
  }
  (function draw() {
    if (!canvas.isConnected) return;
    ctx.clearRect(0, 0, w, h);
    dots.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(155,47,23,' + p.o + ')';
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  })();

  drawCart();
  reelDraw();
  fromHash();
})();
