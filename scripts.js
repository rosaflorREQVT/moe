// Tab switching without page reload
(function(){
  const tabBtns = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  function setActive(tab, options = {}){
    const { updateHash = true } = options;

    tabBtns.forEach(b=>b.classList.toggle('active', b===tab));
    const target = tab.dataset.tab;
    contents.forEach(c=>c.classList.toggle('active', c.dataset.content===target));
    try{localStorage.setItem('heta-active-tab', target)}catch(e){}
    // update hash for deep-linking only after a real user tab switch
    if (updateHash) {
      history.replaceState(null,'', '#'+target);
    }
    if(target === 'tip' && typeof openTippingModal === 'function') {
      openTippingModal();
    }
    const container = document.querySelector('.main-container');
    if (container) {
      container.dataset.activeTab = target;
    }
  }

  tabBtns.forEach(btn=>{
    btn.addEventListener('click', ()=> setActive(btn, { updateHash: true }));
  });

  // Restore last tab or from hash
  const fromHash = location.hash.replace('#','');
  const saved = localStorage.getItem('heta-active-tab');
  const initial = Array.from(tabBtns).find(b => b.dataset.tab===fromHash) || Array.from(tabBtns).find(b => b.dataset.tab===saved) || document.querySelector('.tab-btn');
  if(initial) setActive(initial, { updateHash: false });
})();

(function(){
  document.querySelectorAll('*').forEach((el) => {
    el.style.cursor = 'url("assets/cursor.gif"), auto';
  });

  const audio = document.getElementById('playlist-audio');
  if (!audio) return;

  const playlistList = document.querySelector('.playlist-list');

  function setPlaylistMessage(message) {
    if (!playlistList) return;

    playlistList.innerHTML = '';
    const item = document.createElement('li');
    item.className = 'playlist-empty';
    item.textContent = message;
    playlistList.appendChild(item);
  }

  function bindTrack(trackBtn) {
    trackBtn.addEventListener('click', () => {
      const nextSrc = trackBtn.dataset.src;
      if (!nextSrc) return;

      audio.src = nextSrc;
      audio.load();
      audio.play();
      audio.dataset.activeSrc = nextSrc;

      Array.from(playlistList.querySelectorAll('.playlist-track')).forEach((btn) => {
        btn.classList.toggle('active', btn === trackBtn);
      });
    });
  }

  function renderTrackList(tracks) {
    if (!playlistList) return;

    playlistList.innerHTML = '';

    if (!tracks.length) {
      setPlaylistMessage('No tracks available yet. Run generate_playlist.py after adding or removing songs in music/playlist.');
      return;
    }

    tracks.forEach((track) => {
      const listItem = document.createElement('li');
      const trackBtn = document.createElement('button');
      const icon = document.createElement('img');
      const label = document.createElement('span');

      trackBtn.type = 'button';
      trackBtn.className = 'playlist-track';
      trackBtn.dataset.src = track.src;

      icon.src = 'assets/playlist.gif';
      icon.alt = 'Playlist icon';
      icon.className = 'playlist-track-icon';

      label.textContent = track.label;
      label.className = 'playlist-track-label';

      trackBtn.appendChild(icon);
      trackBtn.appendChild(label);

      if (audio.dataset.activeSrc === track.src) {
        trackBtn.classList.add('active');
      }

      bindTrack(trackBtn);
      listItem.appendChild(trackBtn);
      playlistList.appendChild(listItem);
    });
  }

  async function loadPlaylistFile() {
    try {
      const response = await fetch('music/playlist/playlist.json', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`Unable to load playlist file (${response.status})`);
      }

      const tracks = await response.json();

      if (!Array.isArray(tracks)) {
        throw new Error('The playlist file is invalid.');
      }

      renderTrackList(tracks);
    } catch (error) {
      console.warn('Failed to load playlist file:', error);
      setPlaylistMessage('Playlist file not found yet. Run generate_playlist.py to build it from music/playlist.');
    }
  }

  renderTrackList([]);
  loadPlaylistFile();
  setInterval(loadPlaylistFile, 15000);
})();

// Prevent image downloads / saves from the page
(function(){
  function protectImage(img){
    if (!img || img.dataset.protected === 'true') return;
    img.dataset.protected = 'true';
    img.draggable = false;
    img.addEventListener('contextmenu', (e) => e.preventDefault());
    img.addEventListener('dragstart', (e) => e.preventDefault());
  }

  document.querySelectorAll('img').forEach(protectImage);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'IMG') protectImage(node);
        node.querySelectorAll?.('img').forEach(protectImage);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('contextmenu', (e) => {
    if (e.target && e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target && e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
})();

// Reference image modal + upload handling
(function(){
  const thumbs = document.querySelectorAll('.ref-thumb');
  if(thumbs.length === 0) return;

  // create modal element
  const modal = document.createElement('div');
  modal.className = 'ref-modal';
  const img = document.createElement('img');
  modal.appendChild(img);
  document.body.appendChild(modal);

  function openModal(src){
    img.src = src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
  }

  // click thumbnail to open
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', ()=>{
      if(thumb.src) openModal(thumb.src);
    });
  });

  // close when clicking outside img
  modal.addEventListener('click', (e)=>{
    if(e.target === modal) closeModal();
  });

  // close on Esc
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
})();

// Load stamps from the hardcoded list below.
// This is now the only stamp source used by the page.
// The stamps are loaded from the remote folder URL below.
(function(){
  const grid = document.getElementById('stamps-grid');
  if (!grid) return;

  const stampsBasePath = 'https://file.garden/aZscxMPZ-RVjxmp5/stamps/';

  const stamps = [
    "stamp0.png", "stamp1.png", "stamp2.png", "stamp3.png", "stamp4.png",
    "stamp5.png", "stamp6.jpg", "stamp7.gif", "stamp8.png", "stamp9.png",
    "stamp10.png", "stamp11.png", "stamp12.png", "stamp13.jpg", "stamp14.gif",
    "stamp15.png", "stamp16.png", "stamp17.png", "stamp18.jpg", "stamp19.gif",
    "stamp20.gif", "stamp21.png", "stamp22.png", "stamp23.png", "stamp24.png"
  ];

  function isAbsoluteOrExternalPath(value) {
    return /^(?:https?:|data:|\/\/|\/)/i.test(value);
  }

  function resolveSrc(value) {
    if (!value) return '';
    return isAbsoluteOrExternalPath(value) ? value : stampsBasePath + value;
  }

  function createStampElement(entry) {
    let src = '';
    let alt = 'stamp';
    let title = '';
    let href = '';

    if (typeof entry === 'string') {
      src = resolveSrc(entry);
      alt = entry;
    } else if (entry && typeof entry === 'object') {
      src = resolveSrc(entry.src || entry.image || entry.url || entry.link);
      alt = entry.alt || entry.title || entry.src || entry.image || 'stamp';
      title = entry.title || '';
      href = entry.href || entry.link || '';
    }

    if (!src) return null;

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    if (title) img.title = title;

    if (href) {
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.target = '_blank';
      anchor.rel = 'noopener';
      anchor.appendChild(img);
      return anchor;
    }

    return img;
  }

  function displayStamps(stampsList) {
    grid.innerHTML = '';
    if (!Array.isArray(stampsList)) stampsList = [];

    stampsList.forEach(entry => {
      const element = createStampElement(entry);
      if (element) grid.appendChild(element);
    });
  }

  displayStamps(stamps);
})();

// Tipping modal functions
let _tipPopupOpened = false;

function openTippingModal() {
  const modal = document.getElementById('tipping-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  _tipPopupOpened = true;
}

function closeTippingModal() {
  const modal = document.getElementById('tipping-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
  if (_tipPopupOpened) {
    _tipPopupOpened = false;
    const nextTab = document.querySelector('.tab-btn[data-tab="stamps"]');
    if (nextTab) nextTab.click();
  }
}

function showHeartPopup(clientX, clientY) {
  const heart = document.createElement('img');
  heart.src = 'assets/heart.gif';
  heart.alt = 'Cute heart';
  heart.className = 'heart-popup';
  heart.style.left = `${clientX}px`;
  heart.style.top = `${clientY}px`;
  document.body.appendChild(heart);

  heart.addEventListener('animationend', () => {
    heart.remove();
  }, { once: true });
}

// Close tipping modal on overlay click or ESC
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('tipping-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeTippingModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeTippingModal();
    });
  }


  document.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top - 12;
      showHeartPopup(x, y);
    });
  });
});
