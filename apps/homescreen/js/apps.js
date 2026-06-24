/* global MozActivity */
'use strict';

(function(exports) {
  
  // =========================================================================
  // 1. INTEGRATED B2G VIRTUAL OPERATING SYSTEM LIFESTYLE ENGINE
  // =========================================================================
  const B2G_Core = {
    runningApps: {}, 
    activeApp: null, 

    // Launches websites securely inside an isolated iframe grid system
    launch: function(appId, appUrl, appName) {
      const desktop = document.getElementById('desktop-container');
      if (!desktop) return;

      // If the app is already open, simply slide it into focus
      if (this.runningApps[appId]) {
        this.switchTab(appId);
        return;
      }

      // Generate a responsive HTML5 application window frame
      const frameWindow = document.createElement('iframe');
      frameWindow.src = appUrl;
      frameWindow.id = `iframe-proc-${appId}`;
      frameWindow.className = 'app-frame-window gui-hidden';
      frameWindow.style.width = '100%';
      frameWindow.style.height = '100%';
      frameWindow.style.border = 'none';
      frameWindow.style.background = '#ffffff';

      desktop.appendChild(frameWindow);

      this.runningApps[appId] = {
        name: appName,
        element: frameWindow
      };

      this.createTaskbarTab(appId, appName);
      this.switchTab(appId);
    },

    // Handles multi-tasking switching focus layers
    switchTab: function(appId) {
      Object.keys(this.runningApps).forEach(id => {
        const app = this.runningApps[id];
        const tab = document.getElementById(`tab-link-${id}`);
        
        if (id === appId) {
          app.element.classList.remove('gui-hidden');
          if (tab) tab.style.background = '#0078d4'; // Highlight active taskbar tab
          this.activeApp = appId;
        } else {
          app.element.classList.add('gui-hidden');
          if (tab) tab.style.background = 'rgba(255,255,255,0.05)';
        }
      });
      
      const launcher = document.getElementById('launcher-menu');
      if (launcher) launcher.classList.add('gui-hidden');
    },

    // Closes out apps and completely clears memory to help old PCs run fast
    kill: function(appId) {
      if (this.runningApps[appId]) {
        this.runningApps[appId].element.remove();
        const tab = document.getElementById(`tab-link-${appId}`);
        if (tab) tab.remove();

        delete this.runningApps[appId];

        if (this.activeApp === appId) {
          const remaining = Object.keys(this.runningApps);
          if (remaining.length > 0) {
            this.switchTab(remaining[remaining.length - 1]);
          } else {
            this.activeApp = null;
          }
        }
      }
    },

    // Appends tabs to the running panel tray area
    createTaskbarTab: function(appId, appName) {
      const tabsContainer = document.getElementById('taskbar-running-tabs');
      if (!tabsContainer) return;

      const tabButton = document.createElement('div');
      tabButton.id = `tab-link-${appId}`;
      tabButton.style.padding = '4px 12px';
      tabButton.style.background = 'rgba(255,255,255,0.05)';
      tabButton.style.borderRadius = '6px';
      tabButton.style.fontSize = '12px';
      tabButton.style.cursor = 'pointer';
      tabButton.style.display = 'flex';
      tabButton.style.alignItems = 'center';
      tabButton.style.gap = '8px';
      tabButton.style.border = '1px solid rgba(255,255,255,0.1)';

      tabButton.addEventListener('click', () => this.switchTab(appId));

      const titleSpan = document.createElement('span');
      titleSpan.innerText = appName;

      const closeSpan = document.createElement('span');
      closeSpan.innerHTML = '&times;';
      closeSpan.style.color = '#ef4444';
      closeSpan.style.fontWeight = 'bold';
      closeSpan.style.fontSize = '14px';
      closeSpan.style.marginLeft = '4px';
      closeSpan.addEventListener('click', (e) => {
        e.stopPropagation(); 
        this.kill(appId);
      });

      tabButton.appendChild(titleSpan);
      tabButton.appendChild(closeSpan);
      tabsContainer.appendChild(tabButton);
    }
  };

  window.B2G_Core = B2G_Core;

  // =========================================================================
  // 2. INTEGRATED LOCATION MODULE AND SYSTEM CLOCK SYNC
  // =========================================================================
  function initializeStatusTray() {
    const locationWidget = document.getElementById('tray-location');
    const timeWidget = document.getElementById('tray-time');

    // Live clock interval loop
    if (timeWidget) {
      const syncTime = () => {
        const now = new Date();
        timeWidget.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };
      syncTime();
      setInterval(syncTime, 1000);
    }

    // High-performance Network Geo-IP Location fetch
    if (locationWidget) {
      fetch('http://ip-api.com')
        .then(res => res.json())
        .then(payload => {
          if (payload.status === 'success') {
            locationWidget.innerText = `📍 ${payload.city}, ${payload.country}`;
          } else {
            locationWidget.innerText = `📍 Việt Nam`;
          }
        })
        .catch(() => {
          locationWidget.innerText = `📍 Online`;
        });
    }
  }

  // =========================================================================
  // 3. MOCK RUNTIME ENGINES FOR COMPATIBILITY BYPASS
  // =========================================================================
  if (!window.Settings) {
    window.Settings = function() { this.small = false; this.scrollSnapping = true; };
    window.Settings.prototype.save = function() {};
  }
  if (!window.AppsMetadata) {
    window.AppsMetadata = function() {};
    window.AppsMetadata.prototype.init = function() { return Promise.resolve(); };
    window.AppsMetadata.prototype.getAll = function(callback) {
      const defaultApps = [
        { id: 'google', name: 'Google Search', url: 'https://google.com', icon: '🔍' },
        { id: 'youtube', name: 'YouTube Video', url: 'https://youtube.com', icon: '🎬' },
        { id: 'wikipedia', name: 'Wikipedia', url: 'https://wikipedia.org', icon: '📚' },
        { id: 'maps', name: 'Google Maps', url: 'https://google.com/maps', icon: '🗺️' },
        { id: 'whatsapp', name: 'WhatsApp Web', url: 'https://whatsapp.com', icon: '💬' }
      ];
      defaultApps.forEach(app => callback(app));
      return Promise.resolve();
    };
  }
  if (!window.PinnedPlaces) {
    window.PinnedPlaces = function() {};
    window.PinnedPlaces.prototype.init = function() { return Promise.resolve(); };
  }
  if (!customElements.get('gaia-container')) {
    customElements.define('gaia-container', class extends HTMLElement {
      freeze() {} thaw() {} removeChild(el, cb) { el.remove(); if (cb) cb(); }
    });
  }

  // =========================================================================
  // 4. GAIA MAIN INTERFACE GRID GENERATOR
  // =========================================================================
  function Apps() {
    this.icons = document.getElementById('apps');
    this.settings = new Settings();
  }

  Apps.prototype = {
    init: function() {
      if (this.icons.classList) {
        this.icons.classList.remove('loading');
      }
      this.startupMetadata = [];
      this.metadata = new AppsMetadata();

      this.metadata.init().then(() => {
        return this.metadata.getAll(result => {
          this.startupMetadata.push(result);
          this.addAppIcon(result);
        });
      }).then(() => {
        initializeStatusTray(); // Runs system tray routines immediately after apps render
        console.log("[Monolithic OS Shell] All components unified and fully running.");
      });
    },

    addAppIcon: function(appData) {
      if (!this.icons) return;

      const iconContainer = document.createElement('div');
      iconContainer.className = 'icon-container app-icon-card';
      iconContainer.setAttribute('data-app-id', appData.id);
      iconContainer.style.cursor = 'pointer';

      const iconVisual = document.createElement('div');
      iconVisual.className = 'app-icon icon';
      iconVisual.innerText = appData.icon || '📱';
      iconVisual.style.fontSize = '32px';
      iconVisual.style.textAlign = 'center';

      const iconLabel = document.createElement('span');
      iconLabel.className = 'label';
      iconLabel.innerText = appData.name;

      // Click hook connects natively to internal virtual OS iframe loop
      iconContainer.addEventListener('click', () => {
        if (window.B2G_Core) {
          window.B2G_Core.launch(appData.id, appData.url, appData.name);
        }
      });

      iconContainer.appendChild(iconVisual);
      iconContainer.appendChild(iconLabel);
      this.icons.appendChild(iconContainer);
    }
  };

  // Instantiates everything upon DOM readiness
  document.addEventListener('DOMContentLoaded', () => {
    const appsSystem = new Apps();
    appsSystem.init();
    
    // Global handle to manage launcher overlay popup panel
    window.toggleLauncher = function() {
      const drawer = document.getElementById('launcher-menu');
      if (drawer) drawer.classList.toggle('gui-hidden');
    };

    // Quit emergency exit system loop hotkey: Shift + Escape
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && event.shiftKey) {
            if (typeof nw !== 'undefined') nw.App.quit();
        }
    });
  });

  exports.Apps = Apps;

})(window);
