/* Fulminous AI section — behaviour.
   ------------------------------------------------------------------
   The author's script, unchanged apart from its wrapper. It shipped as an
   IIFE that auto-ran on DOMContentLoaded and hung itself off window; in a
   React app that fires before this section is in the DOM, so the auto-init
   and the window global are gone and FulminousAiSection calls initFulminousAI
   from an effect instead.

   Left as .js on purpose: tsconfig has allowJs, and keeping it out of the
   .tsx means the author's code stays byte-for-byte what was handed over
   rather than being retyped. */
const global = typeof window !== "undefined" ? window : undefined;

/* ==========================================================================
   Fulminous AI — section behaviour
   No dependencies. Works at every breakpoint; the layout is CSS-only.
   Usage:  FulminousAI.init(document.querySelector('.fai'));
   ========================================================================== */



  /* ------------------------------------------------------------------------
     CONTENT — the only thing you normally need to edit.
     Six items per lens. Six is not arbitrary: the orbit has six positions,
     so adding a seventh needs a layout decision, not a squeeze.
     ---------------------------------------------------------------------- */

  var DATA = {
    capabilities: {
      core: 'CAPABILITIES',
      title: 'Six AI service lines',
      blurb: 'The AI work clients buy from us — from a first readiness assessment through to agents running in production.',
      foot: 'Every line delivered by the same senior team, under one contract.',
      items: [
        { node: 'AI Agents', title: 'AI Agent Development',
          detail: 'We scope one workflow, wire the agent into the systems that already own that data, and put an approval gate wherever a mistake would cost you.',
          get: 'A running agent, its prompts, and an audit trail behind every action' },
        { node: 'Generative AI', title: 'Generative AI Development',
          detail: 'Retrieval over your own documents and records, so answers cite your material rather than the open internet.',
          get: 'A copilot grounded in your content, with sources on every answer' },
        { node: 'Chatbots', title: 'Chatbots & Assistants',
          detail: 'One assistant deployed to the channels your customers already use, handing off to a human the moment it is out of its depth.',
          get: 'Multi-channel assistant with escalation rules and full transcripts' },
        { node: 'AI Apps', title: 'AI-Powered App Development',
          detail: 'Intelligence designed in from the first wireframe — search, suggestions and automation as product features, not a bolted-on panel.',
          get: 'A web or mobile product with AI in its core flows' },
        { node: 'ML & Data', title: 'AI & ML Engineering',
          detail: 'Models trained on your own history, deployed behind an API you own, and monitored so you hear about accuracy drift from us first.',
          get: 'Trained model, serving endpoint and drift monitoring' },
        { node: 'AI Consulting', title: 'AI Consulting & Readiness',
          detail: 'A short engagement that maps your workflows, scores them on effort against payback, and tells you honestly which ones AI should not touch.',
          get: 'A ranked roadmap with costs, risks and a first build to start on' }
      ]
    },
    process: {
      core: 'PROCESS',
      title: 'AI inside Discuss. Design. Develop.',
      blurb: 'The homepage promise, made concrete. AI compresses the slow parts; our engineers still own every decision that ships.',
      foot: 'Human review stays mandatory at every gate that reaches your branch.',
      items: [
        { node: 'Discovery', title: 'Discuss',
          detail: 'Your existing documents, tickets and call notes are read and turned into user stories, so discovery is a review rather than a month of workshops.',
          get: 'A scoped backlog with estimates you can challenge' },
        { node: 'Prototyping', title: 'Design',
          detail: 'Three clickable directions, built fast enough that you react to real screens instead of approving a wireframe you cannot picture.',
          get: 'A clickable prototype in your brand' },
        { node: 'Code review', title: 'Develop',
          detail: 'AI writes the boilerplate and the first pass; a senior engineer reviews every commit before it reaches your branch. No exceptions.',
          get: 'A reviewed, tested build with readable commit history' },
        { node: 'Test generation', title: 'Test',
          detail: 'Test suites generated alongside the code and extended as the product grows, so coverage does not quietly decay after launch.',
          get: 'An automated test suite running in your CI' },
        { node: 'Documentation', title: 'Document',
          detail: 'Technical documentation written from the codebase itself and refreshed with it, so the handover pack is not out of date on day one.',
          get: 'Living technical docs and a handover pack' },
        { node: 'Monitoring', title: 'Run',
          detail: 'After go-live, agents watch your logs, triage inbound support and assemble the reporting your team used to put together by hand.',
          get: 'Monitoring, triage and reporting agents that you own' }
      ]
    },
    platform: {
      core: 'PLATFORM',
      title: 'Model-agnostic, grounded in your systems',
      blurb: 'Fulminous AI connects to the tools you already run — and nothing leaves your control.',
      foot: 'Code, prompts and agents are handed over at the end. No lock-in.',
      items: [
        { node: 'Your systems', title: 'Your data, your infra',
          detail: 'Deployed into your cloud account or ours, with the choice written down and the data boundaries drawn before any code ships.',
          get: 'A documented deployment and data-flow diagram' },
        { node: 'Any model', title: 'Model-agnostic',
          detail: 'The integration layer is ours; the model is a setting. When a better or cheaper one appears you switch the model, not the product.',
          get: 'Swappable model configuration' },
        { node: 'Grounded', title: 'Grounded answers',
          detail: 'Every answer is retrieved from your own content and carries its sources, so your team can check the work instead of trusting it.',
          get: 'A retrieval layer with source citations' },
        { node: 'Guardrails', title: 'Guardrails by default',
          detail: 'Scoped permissions per user, redaction on sensitive fields and an audit trail on every call — configured at the start, not after an incident.',
          get: 'Permission model, redaction rules and audit log' },
        { node: 'Human review', title: 'Human in the loop',
          detail: 'Approval gates sit wherever the stakes justify one, and the agent waits. You decide where that line is drawn, not us.',
          get: 'Approval gates on the actions you choose' },
        { node: 'You own it', title: 'You own the output',
          detail: 'Code, prompts, evaluations and agent definitions are handed over at the end of the engagement. Nothing is held back as leverage.',
          get: 'Full handover — code, prompts, evals and agents' }
      ]
    },
    industries: {
      core: 'INDUSTRIES',
      title: 'AI use cases across 8 industries',
      blurb: 'Not theory — the places our clients have already put AI to work.',
      foot: 'Also serving Media & Entertainment and Food & Restaurant.',
      items: [
        { node: 'Healthcare', title: 'Healthcare',
          detail: 'Intake forms completed from a conversation, and clinical notes summarised for the next clinician — with PHI fields flagged and encrypted before anything ships.',
          get: 'Intake flow and note summarisation, compliance-reviewed' },
        { node: 'Finance', title: 'Banking & Finance',
          detail: 'Document-heavy onboarding read and checked automatically, and unusual patterns surfaced to your analysts rather than acted on without them.',
          get: 'Document onboarding and a fraud-signal review queue' },
        { node: 'Real Estate', title: 'Real Estate',
          detail: 'Listing copy drafted from property data, and inbound enquiries qualified and routed before an agent spends an hour on them.',
          get: 'Listing generation and a lead-qualification agent' },
        { node: 'Retail', title: 'E-commerce & Retail',
          detail: 'Search that understands what a shopper meant, sizing guidance drawn from returns history, and demand forecasts your buyers can argue with.',
          get: 'Semantic search, sizing help and demand forecasts' },
        { node: 'Education', title: 'Education & e-Learning',
          detail: 'Learning paths that adapt to what a student actually got wrong, and assessment marked automatically with the reasoning shown.',
          get: 'Adaptive learning paths and auto-marked assessment' },
        { node: 'Travel', title: 'Travel & Hospitality',
          detail: 'Itineraries assembled from live availability, and guest messages answered in their own language around the clock.',
          get: 'An itinerary agent and multilingual guest support' }
      ]
    }
  };

  var ORDER = ['capabilities', 'process', 'platform', 'industries'];

  /* Unit-circle fractions for the six orbit positions, starting at 12 o'clock
     and stepping 60 degrees clockwise. CSS multiplies these by --fai-r. */
  var FX = [0, 0.866, 0.866, 0, -0.866, -0.866];
  var FY = [-1, -0.5, 0.5, 1, 0.5, -0.5];

  function pad(i) { return '0' + (i + 1); }

  /* Re-triggers a CSS animation on an element that was not re-created. */
  function restart(el) {
    if (!el) { return; }
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  }

  function el(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (attrs) { Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); }); }
    return n;
  }

  function init(root) {
    if (!root || root.dataset.faiReady === '1') { return; }
    root.dataset.faiReady = '1';

    var refs = {
      tabs:     Array.prototype.slice.call(root.querySelectorAll('.fai__tab')),
      spokes:   Array.prototype.slice.call(root.querySelectorAll('.fai__spoke')),
      nodes:    root.querySelector('.fai__nodes'),
      coreLens: root.querySelector('.fai__corelens'),
      cardHead: root.querySelector('.fai__cardhead'),
      title:    root.querySelector('.fai__h3'),
      blurb:    root.querySelector('.fai__blurb'),
      rows:     root.querySelector('.fai__rows'),
      detail:   root.querySelector('.fai__detail'),
      note:     root.querySelector('.fai__note p')
    };

    var state = { lens: ORDER[0], sel: 0 };

    /* ---- orbit nodes (rebuilt on lens change so the reveal replays) ---- */
    function renderNodes() {
      var data = DATA[state.lens];
      refs.nodes.textContent = '';

      data.items.forEach(function (item, i) {
        /* The diagram mirrors the row list below it. It stays operable by
           mouse and touch but is hidden from assistive tech and taken out of
           the tab order, so keyboard and screen-reader users get one clean
           set of controls (the rows) instead of two identical ones. */
        var btn = el('button', 'fai__node', {
          type: 'button',
          tabindex: '-1',
          'aria-hidden': 'true',
          'data-index': String(i)
        });
        btn.style.setProperty('--fai-fx', FX[i]);
        btn.style.setProperty('--fai-fy', FY[i]);
        btn.style.setProperty('--fai-i', i);

        var num = el('span', 'fai__num');
        num.textContent = pad(i);
        var label = el('span', 'fai__nodelabel');
        label.textContent = item.node;

        btn.appendChild(num);
        btn.appendChild(label);
        refs.nodes.appendChild(btn);
      });
    }

    /* ---- row list (the accessible control set) ---- */
    function renderRows() {
      var data = DATA[state.lens];
      refs.rows.textContent = '';

      data.items.forEach(function (item, i) {
        var li = el('li');
        var btn = el('button', 'fai__row', {
          type: 'button',
          'aria-pressed': 'false',
          'data-index': String(i)
        });
        btn.style.setProperty('--fai-i', i);

        var num = el('span', 'fai__num');
        num.textContent = pad(i);
        var label = el('span', 'fai__rowlabel');
        label.textContent = item.title;

        btn.appendChild(num);
        btn.appendChild(label);
        li.appendChild(btn);
        refs.rows.appendChild(li);
      });
    }

    /* ---- detail strip ---- */
    function renderDetail() {
      var item = DATA[state.lens].items[state.sel];
      refs.detail.textContent = '';

      var inner = el('div', 'fai__detailinner');

      var head = el('div', 'fai__detailhead');
      var num = el('span', 'fai__detailnum');
      num.textContent = pad(state.sel);
      var h4 = el('h4', 'fai__h4');
      h4.textContent = item.title;
      head.appendChild(num);
      head.appendChild(h4);

      var body = el('p', 'fai__detailbody');
      body.textContent = item.detail;

      var get = el('div', 'fai__get');
      var gl = el('span', 'fai__getlabel');
      gl.textContent = 'YOU GET';
      var gv = el('span', 'fai__getvalue');
      gv.textContent = item.get;
      get.appendChild(gl);
      get.appendChild(gv);

      inner.appendChild(head);
      inner.appendChild(body);
      inner.appendChild(get);
      refs.detail.appendChild(inner);
    }

    /* ---- selection: node, row, spoke and detail move together ---- */
    function paintSelection() {
      Array.prototype.forEach.call(refs.nodes.children, function (n, i) {
        n.classList.toggle('is-on', i === state.sel);
      });
      Array.prototype.forEach.call(refs.rows.children, function (li, i) {
        var b = li.firstChild;
        b.classList.toggle('is-on', i === state.sel);
        b.setAttribute('aria-pressed', i === state.sel ? 'true' : 'false');
      });
      refs.spokes.forEach(function (s, i) {
        s.classList.toggle('is-on', i === state.sel);
      });
    }

    function select(i) {
      if (i === state.sel) { return; }
      state.sel = i;
      renderDetail();
      paintSelection();
    }

    function setLens(lens) {
      if (!DATA[lens]) { return; }
      state.lens = lens;
      state.sel = 0;

      var data = DATA[lens];
      refs.tabs.forEach(function (t) {
        t.setAttribute('aria-selected', t.dataset.lens === lens ? 'true' : 'false');
        t.setAttribute('tabindex', t.dataset.lens === lens ? '0' : '-1');
      });

      refs.coreLens.textContent = data.core;
      refs.title.textContent = data.title;
      refs.blurb.textContent = data.blurb;
      refs.note.textContent = data.foot;

      renderNodes();
      renderRows();
      renderDetail();
      paintSelection();

      restart(refs.cardHead);
      refs.spokes.forEach(restart);
    }

    /* ---- events (delegated, so re-rendered children need no rebinding) --- */
    refs.nodes.addEventListener('click', function (e) {
      var b = e.target.closest('.fai__node');
      if (b) { select(Number(b.dataset.index)); }
    });

    refs.rows.addEventListener('click', function (e) {
      var b = e.target.closest('.fai__row');
      if (b) { select(Number(b.dataset.index)); }
    });

    refs.tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { setLens(tab.dataset.lens); });
    });

    /* roving tabindex + arrow keys on the lens switcher */
    root.querySelector('.fai__tabs').addEventListener('keydown', function (e) {
      var i = refs.tabs.indexOf(document.activeElement);
      if (i < 0) { return; }
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { next = (i + 1) % refs.tabs.length; }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { next = (i - 1 + refs.tabs.length) % refs.tabs.length; }
      if (e.key === 'Home') { next = 0; }
      if (e.key === 'End')  { next = refs.tabs.length - 1; }
      if (next === null) { return; }
      e.preventDefault();
      refs.tabs[next].focus();
      setLens(refs.tabs[next].dataset.lens);
    });

    /* ---- play the reveal once, when the section comes into view ---- */
    if ('IntersectionObserver' in global) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            root.classList.add('is-revealed');
            io.disconnect();
          }
        });
      }, { threshold: 0.15 });
      io.observe(root);
    } else {
      root.classList.add('is-revealed');
    }

    setLens(ORDER[0]);
  }

export function initFulminousAI(root) {
  if (root) init(root);
}
