// ===== Hero Slider =====
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      clearInterval(slideInterval);
      goToSlide(parseInt(this.dataset.slide));
      startSlider();
    });
  });

  startSlider();
})();

// ===== Service Carousel =====
(function() {
  const cards = document.getElementById('serviceCards');
  const prevBtn = document.getElementById('prevService');
  const nextBtn = document.getElementById('nextService');
  let currentIndex = 0;
  const totalCards = cards.children.length;

  function updateCarousel() {
    cards.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
  }

  prevBtn.addEventListener('click', function() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCarousel();
  });

  nextBtn.addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCarousel();
  });
})();

// ===== Service Tabs =====
(function() {
  const tabs = document.querySelectorAll('.service-tab');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
    });
  });
})();

// ===== 动态加载婚礼案例 =====
(function() {
  var allCases = [];
  var currentFilter = '全部';

  // 先尝试从JSON文件加载（在线时），失败则使用嵌入数据（离线时）
  fetch('data/cases.json')
    .then(function(res) { if (!res.ok) throw new Error('fetch failed'); return res.json(); })
    .then(function(data) {
      allCases = data.cases || [];
      renderFilterButtons();
      renderCases();
    })
    .catch(function(err) {
      console.log('使用嵌入数据加载案例');
      allCases = (window.SITE_DATA && window.SITE_DATA.cases) || [];
      renderFilterButtons();
      renderCases();
    });

  // 生成分类筛选按钮
  function renderFilterButtons() {
    var categories = ['全部'];
    allCases.forEach(function(c) {
      if (categories.indexOf(c.category) === -1) {
        categories.push(c.category);
      }
    });

    var filterContainer = document.getElementById('caseFilter');
    filterContainer.innerHTML = '';

    categories.forEach(function(cat) {
      var btn = document.createElement('button');
      btn.className = 'case-filter-btn' + (cat === currentFilter ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', function() {
        currentFilter = cat;
        document.querySelectorAll('.case-filter-btn').forEach(function(b) {
          b.classList.remove('active');
        });
        this.classList.add('active');
        renderCases();
      });
      filterContainer.appendChild(btn);
    });
  }

  // 渲染案例卡片
  function renderCases() {
    var grid = document.getElementById('casesGrid');
    var filtered = currentFilter === '全部'
      ? allCases
      : allCases.filter(function(c) { return c.category === currentFilter; });

    if (filtered.length === 0) {
      grid.innerHTML =
        '<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:#999;">' +
        '<p style="font-size:16px;margin-bottom:8px;">该分类暂无案例</p>' +
        '<p style="font-size:13px;">请将案例图片放入 images/cases/' + currentFilter + '/ 文件夹，并在 data/cases.json 中添加记录</p>' +
        '</div>';
      return;
    }

    grid.innerHTML = '';
    filtered.forEach(function(item) {
      var card = document.createElement('div');
      card.className = 'case-card';

      // 图片区域
      var imgDiv = document.createElement('div');
      imgDiv.style.cssText = 'width:100%;height:100%;background:#F5EDE6;background-size:cover;background-position:center;';
      imgDiv.style.backgroundImage = "url('" + item.image + "')";

      // 图片加载失败时的占位
      var img = new Image();
      img.src = item.image;
      img.onerror = function() {
        imgDiv.style.background = 'linear-gradient(180deg, #F5EDE6, #E0D0C0)';
        imgDiv.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#B89B82;font-size:14px;">暂无图片<br><span style="font-size:11px;color:#ccc;">' + item.image + '</span></div>';
      };

      // 悬浮信息层
      var overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = '<h4>' + item.title + '</h4><p>' + item.category + ' · ' + item.location + ' · ' + item.price + '</p>';

      card.appendChild(imgDiv);
      card.appendChild(overlay);
      grid.appendChild(card);
    });
  }
})();

// ===== 动态加载婚宴酒店 =====
function renderHotels(hotels) {
  var grid = document.getElementById('hotelsGrid');
  if (hotels.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:#999;"><p>暂无婚宴酒店数据</p></div>';
    return;
  }
  grid.innerHTML = '';
  hotels.forEach(function(hotel) {
    var card = document.createElement('div');
    card.className = 'hotel-card';
    var imgDiv = document.createElement('div');
    imgDiv.className = 'hotel-img';
    imgDiv.style.backgroundSize = 'cover';
    imgDiv.style.backgroundPosition = 'center';
    if (hotel.image) {
      imgDiv.style.backgroundImage = "url('" + hotel.image + "')";
      var img = new Image();
      img.src = hotel.image;
      img.onerror = function() {
        imgDiv.style.background = 'linear-gradient(135deg, #E8D8C8, #D4C0AB)';
        imgDiv.textContent = '🏨';
        imgDiv.style.display = 'flex';
        imgDiv.style.alignItems = 'center';
        imgDiv.style.justifyContent = 'center';
        imgDiv.style.fontSize = '48px';
        imgDiv.style.color = '#9B7C63';
      };
    } else {
      imgDiv.style.background = 'linear-gradient(135deg, #E8D8C8, #D4C0AB)';
      imgDiv.textContent = '🏨';
      imgDiv.style.display = 'flex';
      imgDiv.style.alignItems = 'center';
      imgDiv.style.justifyContent = 'center';
      imgDiv.style.fontSize = '48px';
      imgDiv.style.color = '#9B7C63';
    }
    var infoDiv = document.createElement('div');
    infoDiv.className = 'hotel-info';
    infoDiv.innerHTML = '<h4>' + hotel.city + '·' + hotel.name + '</h4><div class="location">📍 ' + hotel.address + '</div><div class="price">¥' + hotel.price + ' <span>起/桌</span></div>';
    card.appendChild(imgDiv);
    card.appendChild(infoDiv);
    grid.appendChild(card);
  });
}
(function() {
  fetch('data/hotels.json')
    .then(function(res) { if (!res.ok) throw new Error('fetch failed'); return res.json(); })
    .then(function(data) {
      renderHotels(data.hotels || []);
    })
    .catch(function(err) {
      console.log('使用嵌入数据加载酒店');
      var hotels = (window.SITE_DATA && window.SITE_DATA.hotels) || [];
      renderHotels(hotels);
    });
})();

// ===== Scroll Animations =====
(function() {
  var fadeElements = document.querySelectorAll('.fade-in');

  function checkFade() {
    fadeElements.forEach(function(el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkFade);
  checkFade();
})();

// ===== Counter Animation =====
(function() {
  var counters = document.querySelectorAll('.stat-item .number');
  var started = false;

  function animateCounters() {
    counters.forEach(function(counter) {
      var target = parseInt(counter.dataset.target);
      var duration = 2000;
      var step = target / (duration / 16);
      var current = 0;

      function update() {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toLocaleString();
          if (target === 60000) counter.textContent = '60,000+';
          if (target === 60) counter.textContent = '60+';
          if (target === 99) counter.textContent = '99.87';
          if (target === 10) counter.textContent = '10';
        }
      }
      update();
    });
  }

  function checkCounters() {
    if (started) return;
    var statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    var rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      started = true;
      animateCounters();
    }
  }

  window.addEventListener('scroll', checkCounters);
  checkCounters();
})();

// ===== Navbar Scroll Effect =====
(function() {
  var nav = document.getElementById('mainNav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
    } else {
      nav.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
    }
  });
})();

// ===== Smooth Scroll for Nav Links =====
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navHeight = document.getElementById('mainNav').offsetHeight;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();

// ===== Active Nav Link on Scroll =====
(function() {
  var sections = ['cases', 'team', 'hotels', 'about'];
  var navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    var scrollPos = window.scrollY + 150;
    var currentSection = '';

    sections.forEach(function(id) {
      var section = document.getElementById(id);
      if (section && section.offsetTop <= scrollPos) {
        currentSection = id;
      }
    });

    navLinks.forEach(function(link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href === '#' + currentSection) {
        link.classList.add('active');
      } else if (!currentSection && href === '#') {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
})();
