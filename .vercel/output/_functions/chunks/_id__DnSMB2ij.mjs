import { c as createComponent } from './astro-component_DJn0TBVV.mjs';
import 'piccolore';
import { k as renderTemplate, h as addAttribute, m as maybeRenderHead, o as renderComponent, p as Fragment } from './entrypoint_Bi04DfOe.mjs';
import { $ as $$Layout } from './Layout_BxoymiiG.mjs';
import 'clsx';
import { T as TVTVHDScraper } from './index_-JAiwH9B.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$VideoPlayer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$VideoPlayer;
  const { hlsUrl, channelName = "Stream", class: className = "" } = Astro2.props;
  const proxiedUrl = hlsUrl ? `/api/hls-proxy?url=${encodeURIComponent(hlsUrl)}` : null;
  const playerId = `player-${Math.random().toString(36).slice(2, 9)}`;
  return renderTemplate(_a || (_a = __template(["", "<div", "> ", ` </div> <script src="/hls.min.js"><\/script> <script>
  document.addEventListener('DOMContentLoaded', function () {
    // Find all player containers
    document.querySelectorAll('[id^="player-"][data-proxied-url]').forEach(function (container) {
      var proxiedUrl = container.getAttribute('data-proxied-url');
      if (!proxiedUrl) return;

      var video = container.querySelector('video');
      if (!video) return;

      var controls = {
        bar: container.querySelector('.controls-bar'),
        playBtn: container.querySelector('.play-btn'),
        playIcon: container.querySelector('.play-btn .play-icon'),
        pauseIcon: container.querySelector('.play-btn .pause-icon'),
        centerPlay: container.querySelector('.center-play'),
        centerPlayBtn: container.querySelector('.play-btn-center'),
        progressBar: container.querySelector('.progress-bar'),
        bufferBar: container.querySelector('.buffer-bar'),
        scrubber: container.querySelector('.scrubber'),
        progressTrack: container.querySelector('.progress-track'),
        currentTime: container.querySelector('.current-time'),
        durationTime: container.querySelector('.duration-time'),
        liveBadge: container.querySelector('.live-badge'),
        muteBtn: container.querySelector('.mute-btn'),
        volumeSlider: container.querySelector('.volume-slider input'),
        volumeIcon: container.querySelector('.volume-icon'),
        volumeHigh: container.querySelector('.volume-high'),
        volumeLow: container.querySelector('.volume-low'),
        volumeOff: container.querySelector('.volume-off'),
        fullscreenBtn: container.querySelector('.fullscreen-btn'),
        fullscreenIcon: container.querySelector('.fullscreen-icon'),
        minimizeIcon: container.querySelector('.minimize-icon'),
        pipBtn: container.querySelector('.pip-btn'),
        loadingSpinner: container.querySelector('.loading-spinner'),
        errorOverlay: container.querySelector('.error-overlay'),
        retryBtn: container.querySelector('.retry-btn'),
      };

      var hls = null;
      var isPlaying = false;
      var controlsTimeout = null;
      var isSeeking = false;

      function formatTime(t) {
        if (isNaN(t) || !isFinite(t)) return '0:00';
        var m = Math.floor(t / 60);
        var s = Math.floor(t % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
      }

      function showControls() {
        controls.bar.classList.remove('opacity-0');
        var chName = container.querySelector('.channel-name');
        if (chName) chName.classList.remove('opacity-0');
        if (!isPlaying) {
          controls.centerPlay.classList.remove('opacity-0');
        }
        clearTimeout(controlsTimeout);
        if (isPlaying) {
          controlsTimeout = setTimeout(function () {
            controls.bar.classList.add('opacity-0');
            controls.centerPlay.classList.add('opacity-0');
            if (chName) chName.classList.add('opacity-0');
          }, 3000);
        }
      }

      function hideControlsNow() {
        controls.bar.classList.add('opacity-0');
        controls.centerPlay.classList.add('opacity-0');
        var chName = container.querySelector('.channel-name');
        if (chName) chName.classList.add('opacity-0');
      }

      function setPlayState(playing) {
        isPlaying = playing;
        controls.playIcon.classList.toggle('hidden', playing);
        controls.pauseIcon.classList.toggle('hidden', !playing);
        controls.centerPlay.classList.toggle('opacity-0', playing);
        showControls();
      }

      function updateProgress() {
        if (video.duration && !isSeeking) {
          var pct = (video.currentTime / video.duration) * 100;
          controls.progressBar.style.width = Math.min(pct, 100) + '%';
          controls.scrubber.style.left = Math.min(pct, 100) + '%';
          controls.currentTime.textContent = formatTime(video.currentTime);
        }
      }

      function updateBuffer() {
        if (video.buffered.length > 0 && video.duration) {
          var end = video.buffered.end(video.buffered.length - 1);
          controls.bufferBar.style.width = (end / video.duration * 100) + '%';
        }
      }

      function updateVolumeUI() {
        var vol = video.volume;
        var muted = video.muted || vol === 0;
        controls.volumeHigh.classList.toggle('hidden', muted || vol < 0.5);
        controls.volumeLow.classList.toggle('hidden', muted || vol >= 0.5 || vol === 0);
        controls.volumeOff.classList.toggle('hidden', !muted && vol > 0);
        if (controls.volumeSlider) {
          controls.volumeSlider.value = muted ? 0 : Math.round(vol * 100);
        }
      }

      // ─── Initialize HLS ───
      function initPlayer(url) {
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: false,
            lowLatencyMode: true,
            liveSyncDurationCount: 1,
            liveMaxLatencyDurationCount: 2,
            backbufferLength: 15,
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            controls.loadingSpinner.classList.add('hidden');
            video.play()['catch'](function () {});
          });
          hls.on(window.Hls.Events.LEVEL_LOADED, function () {
            controls.loadingSpinner.classList.add('hidden');
          });
          hls.on(window.Hls.Events.ERROR, function (_event, data) {
            if (data.fatal) {
              controls.loadingSpinner.classList.add('hidden');
              if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
              } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
              } else {
                controls.errorOverlay.classList.remove('hidden');
              }
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          controls.loadingSpinner.classList.add('hidden');
          video.src = url;
          video.addEventListener('loadedmetadata', function () {
            video.play()['catch'](function () {});
          });
        } else {
          controls.loadingSpinner.classList.add('hidden');
          controls.errorOverlay.querySelector('p').textContent = 'This browser does not support HLS playback.';
          controls.errorOverlay.classList.remove('hidden');
        }
      }

      // ─── Show loading ───
      controls.loadingSpinner.classList.remove('hidden');

      // ─── Play/Pause ───
      function togglePlay() {
        if (video.paused) {
          video.play()['catch'](function () {});
        } else {
          video.pause();
        }
      }

      controls.playBtn.addEventListener('click', togglePlay);
      controls.centerPlayBtn.addEventListener('click', togglePlay);
      video.addEventListener('click', togglePlay);

      video.addEventListener('play', function () { setPlayState(true); });
      video.addEventListener('pause', function () { setPlayState(false); });

      // ─── Progress ───
      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('progress', updateBuffer);
      video.addEventListener('loadedmetadata', function () {
        controls.durationTime.textContent = formatTime(video.duration);
      });

      // ─── Seeking ───
      controls.progressTrack.addEventListener('mousedown', function (e) {
        isSeeking = true;
        seekFromEvent(e);
        document.addEventListener('mousemove', seekFromEvent);
        document.addEventListener('mouseup', function () {
          isSeeking = false;
          document.removeEventListener('mousemove', seekFromEvent);
        }, { once: true });
      });
      controls.progressTrack.addEventListener('touchstart', function (e) {
        isSeeking = true;
        seekFromEvent(e);
      }, { passive: true });

      function seekFromEvent(e) {
        var rect = controls.progressTrack.getBoundingClientRect();
        var x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left;
        var pct = Math.max(0, Math.min(1, x / rect.width));
        controls.progressBar.style.width = (pct * 100) + '%';
        controls.scrubber.style.left = (pct * 100) + '%';
        if (video.duration) {
          video.currentTime = pct * video.duration;
        }
      }

      // ─── Volume ───
      controls.muteBtn.addEventListener('click', function () {
        video.muted = !video.muted;
        updateVolumeUI();
      });
      controls.volumeSlider.addEventListener('input', function () {
        video.volume = this.value / 100;
        video.muted = video.volume === 0;
        updateVolumeUI();
      });
      video.addEventListener('volumechange', updateVolumeUI);

      // ─── Fullscreen ───
      controls.fullscreenBtn.addEventListener('click', function () {
        if (!document.fullscreenElement) {
          container.requestFullscreen()['catch'](function () {});
        } else {
          document.exitFullscreen()['catch'](function () {});
        }
      });
      document.addEventListener('fullscreenchange', function () {
        var isFS = !!document.fullscreenElement;
        controls.fullscreenIcon.classList.toggle('hidden', isFS);
        controls.minimizeIcon.classList.toggle('hidden', !isFS);
      });

      // ─── Picture-in-Picture ───
      if ('pictureInPictureEnabled' in document) {
        controls.pipBtn.classList.remove('hidden');
        controls.pipBtn.addEventListener('click', function () {
          if (document.pictureInPictureElement) {
            document.exitPictureInPicture()['catch'](function () {});
          } else {
            video.requestPictureInPicture()['catch'](function () {});
          }
        });
      }

      // ─── Auto-hide controls ───
      container.addEventListener('mousemove', showControls);
      container.addEventListener('mouseenter', showControls);
      container.addEventListener('mouseleave', function () {
        if (isPlaying) {
          controlsTimeout = setTimeout(hideControlsNow, 1000);
        }
      });
      container.addEventListener('touchstart', function () {
        if (isPlaying) {
          showControls();
        }
      }, { passive: true });

      // ─── Retry ───
      controls.retryBtn.addEventListener('click', function () {
        controls.errorOverlay.classList.add('hidden');
        controls.loadingSpinner.classList.remove('hidden');
        if (hls) {
          hls.destroy();
          hls = null;
        }
        initPlayer(proxiedUrl);
      });

      // ─── Keyboard shortcuts ───
      document.addEventListener('keydown', function (e) {
        if (!container.contains(document.activeElement) && document.activeElement !== video && document.activeElement?.tagName !== 'INPUT') {
          if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePlay(); }
          if (e.key === 'f' || e.key === 'F') { controls.fullscreenBtn.click(); }
          if (e.key === 'm' || e.key === 'M') { controls.muteBtn.click(); }
          if (e.key === 'ArrowLeft') { video.currentTime = Math.max(0, video.currentTime - 10); }
          if (e.key === 'ArrowRight') { video.currentTime = Math.min(video.duration || 0, video.currentTime + 10); }
        }
      });

      // ─── Cleanup ───
      window.addEventListener('beforeunload', function () { if (hls) hls.destroy(); });
      window.addEventListener('pagehide', function () { if (hls) hls.destroy(); });

      // ─── Start ───
      initPlayer(proxiedUrl);
      updateVolumeUI();
    });
  });
<\/script>`])), maybeRenderHead(), addAttribute(`relative bg-black rounded-xl overflow-hidden group ${className}`, "class"), hlsUrl && proxiedUrl ? renderTemplate`<div${addAttribute(playerId, "id")} class="relative w-full aspect-video bg-black overflow-hidden"${addAttribute(proxiedUrl, "data-proxied-url")}${addAttribute(channelName, "data-channel-name")}> <!-- Video element (hidden default controls) --> <video class="w-full h-full object-contain cursor-pointer" playsinline preload="metadata"></video> <!-- Center play button overlay --> <div class="center-play absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-300 opacity-0"> <button class="play-btn-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 hover:scale-105 active:scale-95 transition-all duration-200 pointer-events-auto cursor-pointer shadow-lg"> <svg class="play-icon w-7 h-7 sm:w-8 sm:h-8 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg> </button> </div> <!-- Loading spinner --> <div class="loading-spinner absolute inset-0 flex items-center justify-center z-10 hidden"> <div class="w-10 h-10 border-[3px] border-white/20 border-t-white/80 rounded-full animate-spin"></div> </div> <!-- Error overlay --> <div class="error-overlay absolute inset-0 flex items-center justify-center z-10 bg-black/60 hidden"> <div class="text-center px-6"> <svg class="w-10 h-10 mx-auto mb-3 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg> <p class="text-white/80 text-sm font-medium">Error loading stream</p> <button class="retry-btn mt-3 px-4 py-1.5 text-xs font-medium text-white bg-white/15 hover:bg-white/25 rounded-full transition-colors cursor-pointer">Retry</button> </div> </div> <!-- Controls bar --> <div class="controls-bar absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-3 px-4 transition-opacity duration-300"> <!-- Progress bar --> <div class="progress-track relative w-full mb-3 group/progress cursor-pointer" style="height: 5px;"> <div class="absolute inset-0 rounded-full bg-white/20"></div> <div class="buffer-bar absolute inset-y-0 left-0 rounded-full bg-white/20 transition-all duration-150" style="width: 0%"></div> <div class="progress-bar absolute inset-y-0 left-0 rounded-full bg-link transition-all duration-100" style="width: 0%"></div> <div class="scrubber absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md transition-opacity duration-200 opacity-0 group-hover/progress:opacity-100" style="left: 0%"></div> </div> <!-- Controls row --> <div class="flex items-center gap-2 text-white"> <!-- Play/Pause --> <button class="control-btn play-btn flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors cursor-pointer" aria-label="Play/Pause"> <svg class="play-icon w-4 h-4 ml-0.5 hidden" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg> <svg class="pause-icon w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"></path></svg> </button> <!-- Live badge --> <span class="live-badge flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold font-mono uppercase tracking-wider text-red-400 bg-red-500/10 rounded-full"> <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
Live
</span> <!-- Time --> <span class="time-display text-xs font-mono text-white/60 ml-1"> <span class="current-time">0:00</span> <span class="text-white/30 mx-1">/</span> <span class="duration-time">0:00</span> </span> <!-- Spacer --> <div class="flex-1"></div> <!-- Volume --> <div class="group/vol flex items-center gap-1.5 cursor-pointer"> <button class="control-btn mute-btn flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors cursor-pointer" aria-label="Mute/Unmute"> <svg class="volume-icon w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path class="volume-high" d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path class="volume-low" d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path class="volume-off hidden" d="M23 9l-6 6M17 9l6 6"></path></svg> </button> <div class="volume-slider w-0 group-hover/vol:w-20 overflow-hidden transition-all duration-200"> <input type="range" min="0" max="100" value="100" class="w-full h-1 appearance-none bg-white/20 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md" aria-label="Volume"> </div> </div> <!-- Picture-in-Picture --> <button class="control-btn pip-btn hidden sm:flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors cursor-pointer" aria-label="Picture in Picture"> <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><path d="M12 13h7a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z"></path><path d="M9 10v.01"></path></svg> </button> <!-- Fullscreen --> <button class="control-btn fullscreen-btn flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors cursor-pointer" aria-label="Fullscreen"> <svg class="fullscreen-icon w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg> <svg class="minimize-icon w-4 h-4 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg> </button> </div> </div> <!-- Channel name overlay top-left --> <div class="channel-name absolute top-3 left-3 z-10 transition-opacity duration-300"> <span class="text-xs font-medium text-white/70 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">${channelName}</span> </div> </div>` : renderTemplate`<div class="w-full aspect-video bg-ink flex items-center justify-center"> <div class="text-center px-4"> <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center"> <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round"> <polygon points="5 3 19 12 5 21 5 3"></polygon> </svg> </div> <p class="text-white/60 text-sm">Stream unavailable</p> <p class="text-white/40 text-xs mt-1">No video source available for this channel.</p> </div> </div>`);
}, "/home/dgfrii1800/football/src/components/VideoPlayer.astro", void 0);

const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const scraper = new TVTVHDScraper();
  let channel = null;
  let streamInfo = null;
  try {
    const allChannels = await scraper.getAllChannels();
    channel = allChannels.find((ch) => {
      const streamId = ch.streamUrl?.split("stream=")[1]?.split("&")[0];
      return streamId === id || ch.streamUrl?.includes(id || "");
    });
    if (channel) {
      streamInfo = await scraper.getStreamInfo(channel.streamUrl);
    }
  } catch {
  }
  const hlsUrl = streamInfo?.hlsStreams?.[0] || null;
  const title = channel ? `${channel.name} — Live — Fútbol Libre TV` : "Channel not found — Fútbol Libre TV";
  const description = channel ? `Watch ${channel.name} live. Stream from ${channel.category} in HD quality.` : "The requested channel is not available.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="bg-canvas min-h-[calc(100vh-4rem)]"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"> ${channel ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`  <nav class="flex items-center gap-2 text-sm text-mute mb-6 font-mono"> <a href="/channels" class="text-mute no-underline hover:text-ink transition-colors">Channels</a> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"></path></svg> <a${addAttribute(`/channels/${channel.category.toLowerCase()}`, "href")} class="text-mute no-underline hover:text-ink transition-colors">${channel.category}</a> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"></path></svg> <span class="text-ink">${channel.name}</span> </nav>  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <!-- Main content --> <div class="lg:col-span-2"> ${renderComponent($$result3, "VideoPlayer", $$VideoPlayer, { "hlsUrl": hlsUrl, "channelName": channel.name })} <!-- Channel info --> <div class="mt-6"> <div class="flex items-start justify-between gap-4"> <div> <div class="flex items-center gap-3 mb-2"> <h1 class="text-2xl font-semibold text-ink tracking-[-0.6px]">${channel.name}</h1> ${channel.isActive ? renderTemplate`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-mono font-medium rounded-full"> <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>Live
</span>` : renderTemplate`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gray-50 text-gray-400 text-xs font-mono font-medium rounded-full"> <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span>Inactive
</span>`} </div> <p class="text-sm text-mute font-mono">${channel.category}</p> </div> </div> ${streamInfo && hlsUrl && renderTemplate`<div class="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg"> <div class="flex items-center gap-2 text-sm text-green-800"> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline> </svg> <span class="font-medium">Stream playing directly</span> <span class="text-green-600 text-xs ml-auto">Live playback</span> </div> </div>`} ${streamInfo && renderTemplate`<details class="group mt-6"> <summary class="text-sm font-mono text-mute cursor-pointer hover:text-body transition-colors inline-flex items-center gap-2"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
Stream technical info
</summary> <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"> ${streamInfo.hlsStreams.length > 0 && renderTemplate`<div class="bg-canvas-soft rounded-lg p-4"> <p class="text-xs font-mono text-mute uppercase tracking-wider mb-2">HLS Streams</p> <div class="space-y-1.5"> ${streamInfo.hlsStreams.map((hls, i) => renderTemplate`<div${addAttribute(i, "key")} class="text-xs text-body truncate font-mono">${hls}</div>`)} </div> </div>`} ${streamInfo.iframes.length > 0 && renderTemplate`<div class="bg-canvas-soft rounded-lg p-4"> <p class="text-xs font-mono text-mute uppercase tracking-wider mb-2">Embeds</p> <div class="space-y-1.5"> ${streamInfo.iframes.map((iframe, i) => renderTemplate`<div${addAttribute(i, "key")} class="text-xs text-body truncate"> <span class="font-mono text-mute">#${i + 1}:</span> ${iframe.src} </div>`)} </div> </div>`} </div> </details>`} </div> </div> <!-- Sidebar --> <div class="lg:col-span-1"> <div class="bg-canvas rounded-lg card-hairline p-5"> <h3 class="text-xs font-mono text-mute uppercase tracking-wider mb-4">Info</h3> <div class="space-y-3"> <div class="flex justify-between text-sm"> <span class="text-mute">Channel</span> <span class="font-medium text-ink">${channel.name}</span> </div> <div class="flex justify-between text-sm"> <span class="text-mute">Region</span> <span class="font-medium text-ink">${channel.category}</span> </div> <div class="flex justify-between text-sm"> <span class="text-mute">Status</span> <span${addAttribute(`font-medium ${channel.isActive ? "text-green-600" : "text-mute"}`, "class")}> ${channel.isActive ? "Live" : "Inactive"} </span> </div> <div class="border-t border-hairline my-2"></div> <div class="flex justify-between text-sm"> <span class="text-mute">Quality</span> <span class="font-mono text-xs text-ink">HD</span> </div> <div class="flex justify-between text-sm"> <span class="text-mute">Protocol</span> <span class="font-mono text-xs text-ink">HLS</span> </div> ${hlsUrl && renderTemplate`<div class="flex justify-between text-sm"> <span class="text-mute">Playback</span> <span class="font-mono text-xs text-green-600">Direct</span> </div>`} ${streamInfo && renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` <div class="border-t border-hairline my-2"></div> <div class="flex justify-between text-sm"> <span class="text-mute">HTML</span> <span class="font-mono text-xs text-mute">${(streamInfo.rawHtmlSize / 1024).toFixed(1)} KB</span> </div> <div class="flex justify-between text-sm"> <span class="text-mute">Scripts</span> <span class="font-mono text-xs text-mute">${streamInfo.scripts.length}</span> </div> <div class="flex justify-between text-sm"> <span class="text-mute">Iframes</span> <span class="font-mono text-xs text-mute">${streamInfo.iframes.length}</span> </div> <div class="flex justify-between text-sm"> <span class="text-mute">HLS</span> <span class="font-mono text-xs text-mute">${streamInfo.hlsStreams.length}</span> </div> ` })}`} </div> </div> </div> </div> ` })}` : renderTemplate`<div class="text-center py-20"> <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-canvas-soft-2 flex items-center justify-center"> <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="text-mute"> <circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path> </svg> </div> <h3 class="text-lg font-semibold text-ink mb-2">Channel not found</h3> <p class="text-sm text-mute mb-6">The channel you're looking for is not available or doesn't exist.</p> <a href="/channels" class="inline-flex items-center h-10 px-6 bg-ink text-white text-sm font-medium rounded-pill no-underline hover:bg-ink/90 transition-colors">
Browse Channels
</a> </div>`} </div> </section> ` })}`;
}, "/home/dgfrii1800/football/src/pages/stream/[id].astro", void 0);

const $$file = "/home/dgfrii1800/football/src/pages/stream/[id].astro";
const $$url = "/stream/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
