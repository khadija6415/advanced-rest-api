(function () {
  'use strict';

  var COURSE_BODY =
    '{\n  "title": "React for Beginners",\n  "description": "Learn React from scratch",\n' +
    '  "category": "<categoryId>",\n  "instructor": "Khadija",\n  "price": 49.99,\n' +
    '  "duration": 12,\n  "level": "beginner"\n}';

  var ENDPOINTS = [
    {
      group: 'Auth', method: 'POST', path: '/api/auth/register', access: 'Public',
      desc: 'Create a new account and receive a JWT token. Admin accounts also need the secret adminKey.',
      body: '{\n  "name": "Khadija",\n  "email": "khadija@example.com",\n  "password": "123456"\n}',
      codes: ['201', '400', '403', '409']
    },
    {
      group: 'Auth', method: 'POST', path: '/api/auth/login', access: 'Public',
      desc: 'Login with email and password to receive a JWT token.',
      body: '{\n  "email": "khadija@example.com",\n  "password": "123456"\n}',
      codes: ['200', '400', '401']
    },
    {
      group: 'Auth', method: 'GET', path: '/api/auth/me', access: 'Private',
      desc: 'Get the profile of the currently logged-in user.',
      codes: ['200', '401']
    },
    {
      group: 'Categories', method: 'GET', path: '/api/categories', access: 'Public',
      desc: 'List categories with search, filter and pagination.',
      query: 'search, isActive, page, limit',
      codes: ['200']
    },
    {
      group: 'Categories', method: 'GET', path: '/api/categories/:id', access: 'Public',
      desc: 'Get a single category by its ID.',
      codes: ['200', '404']
    },
    {
      group: 'Categories', method: 'POST', path: '/api/categories', access: 'Private',
      desc: 'Create a new category.',
      body: '{\n  "name": "Web Development",\n  "description": "Frontend, backend and full-stack courses"\n}',
      codes: ['201', '400', '401', '409']
    },
    {
      group: 'Categories', method: 'PUT', path: '/api/categories/:id', access: 'Private',
      desc: 'Update a category. Send only the fields you want to change.',
      body: '{\n  "description": "Updated description"\n}',
      codes: ['200', '400', '401', '404']
    },
    {
      group: 'Categories', method: 'DELETE', path: '/api/categories/:id', access: 'Admin',
      desc: 'Delete a category. Not allowed while courses still use it.',
      codes: ['200', '401', '403', '404', '409']
    },
    {
      group: 'Courses', method: 'GET', path: '/api/courses', access: 'Public',
      desc: 'List courses with search, filters, sorting and pagination. Use sort=-price for descending order.',
      query: 'search, category, level, minPrice, maxPrice, sort, page, limit',
      codes: ['200', '400']
    },
    {
      group: 'Courses', method: 'GET', path: '/api/courses/:id', access: 'Public',
      desc: 'Get a single course with its category details.',
      codes: ['200', '404']
    },
    {
      group: 'Courses', method: 'POST', path: '/api/courses', access: 'Private',
      desc: 'Create a new course inside an existing category.',
      body: COURSE_BODY,
      codes: ['201', '400', '401', '404']
    },
    {
      group: 'Courses', method: 'PUT', path: '/api/courses/:id', access: 'Private',
      desc: 'Update a course. Send only the fields you want to change.',
      body: '{\n  "price": 59.99,\n  "level": "intermediate"\n}',
      codes: ['200', '400', '401', '404']
    },
    {
      group: 'Courses', method: 'DELETE', path: '/api/courses/:id', access: 'Admin',
      desc: 'Delete a course.',
      codes: ['200', '401', '403', '404']
    }
  ];

  var GROUPS = ['All', 'Auth', 'Categories', 'Courses'];
  var listEl = document.getElementById('endpoint-list');
  var filtersEl = document.getElementById('filters');

  function esc(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderEndpoints(group) {
    listEl.innerHTML = '';
    ENDPOINTS.filter(function (e) { return group === 'All' || e.group === group; })
      .forEach(function (e, i) {
        var id = 'ep-' + group + '-' + i;
        var item = document.createElement('article');
        item.className = 'endpoint';

        var html =
          '<button type="button" class="endpoint-head" aria-expanded="false" aria-controls="' + id + '">' +
          '<span class="method m-' + e.method.toLowerCase() + '">' + e.method + '</span>' +
          '<code class="path">' + esc(e.path) + '</code>' +
          '<span class="badge access-' + e.access.toLowerCase() + '">' + e.access + '</span>' +
          '<span class="chev" aria-hidden="true"></span></button>' +
          '<div class="endpoint-body" id="' + id + '" hidden>' +
          '<p>' + esc(e.desc) + '</p>';

        if (e.query) html += '<h4>Query parameters</h4><code>' + esc(e.query) + '</code>';
        if (e.access !== 'Public') html += '<h4>Header</h4><code>Authorization: Bearer &lt;token&gt;</code>';
        if (e.body) {
          html += '<h4>Request body (JSON)</h4><pre><code>' + esc(e.body) + '</code></pre>' +
            '<p><button type="button" class="copy" data-copy="' + esc(e.body) + '">Copy body</button></p>';
        }
        html += '<h4>Status codes</h4><div class="codes">' +
          e.codes.map(function (c) { return '<code>' + c + '</code>'; }).join('') + '</div></div>';

        item.innerHTML = html;
        listEl.appendChild(item);
      });
  }

  function renderFilters() {
    GROUPS.forEach(function (g, i) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.setAttribute('role', 'tab');
      chip.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      chip.textContent = g;
      chip.addEventListener('click', function () {
        filtersEl.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-selected', 'false'); });
        chip.setAttribute('aria-selected', 'true');
        renderEndpoints(g);
      });
      filtersEl.appendChild(chip);
    });
  }

  function copyText(text, button) {
    var original = button.textContent;
    function done(ok) {
      button.textContent = ok ? 'Copied!' : 'Press Ctrl+C';
      setTimeout(function () { button.textContent = original; }, 1500);
    }
    try {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } catch (err) {
      done(false);
    }
  }

  // One click handler for expand/collapse and all copy buttons
  document.addEventListener('click', function (event) {
    var head = event.target.closest('.endpoint-head');
    if (head) {
      var body = document.getElementById(head.getAttribute('aria-controls'));
      var open = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', open ? 'false' : 'true');
      body.hidden = open;
      return;
    }
    var copyBtn = event.target.closest('[data-copy]');
    if (copyBtn) {
      copyText(copyBtn.getAttribute('data-copy'), copyBtn);
      return;
    }
    var baseBtn = event.target.closest('[data-copy-base]');
    if (baseBtn) copyText(location.origin + '/api', baseBtn);
  });

  function checkHealth() {
    var pill = document.getElementById('status');
    var text = document.getElementById('status-text');
    fetch('/api/health')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        pill.classList.add(data && data.success ? 'online' : 'offline');
        text.textContent = data && data.success ? 'API online' : 'API issue';
      })
      .catch(function () {
        pill.classList.add('offline');
        text.textContent = 'API offline';
      });
  }

  document.getElementById('base-url').textContent = location.origin + '/api';
  document.getElementById('stat-endpoints').textContent = ENDPOINTS.length + 1;
  document.getElementById('year').textContent = new Date().getFullYear();

  renderFilters();
  renderEndpoints('All');
  checkHealth();
})();