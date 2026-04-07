const injectedTabs = new Set();

// ── Storage helpers ────────────────────────────────────────────────────────
const WHITELIST_KEY = "myuiWhitelist";

function getOrigin(url) {
  try { return new URL(url).origin; } catch (_) { return null; }
}

async function getWhitelist() {
  return new Promise((resolve) => {
    chrome.storage.local.get(WHITELIST_KEY, (result) => {
      resolve(Array.isArray(result[WHITELIST_KEY]) ? result[WHITELIST_KEY] : []);
    });
  });
}

async function addOriginToWhitelist(origin) {
  const list = await getWhitelist();
  if (!list.includes(origin)) {
    list.push(origin);
    await new Promise((resolve) =>
      chrome.storage.local.set({ [WHITELIST_KEY]: list }, resolve)
    );
  }
}

// ── Toolbar click ──────────────────────────────────────────────────────────
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url) return;
  const tabId = tab.id;
  const origin = getOrigin(tab.url);
  if (!origin || origin === "null") return;

  const whitelist = await getWhitelist();

  if (!whitelist.includes(origin)) {
    // Not whitelisted — show inline prompt via activeTab grant.
    // A second toolbar click while the prompt is visible dismisses it.
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: (originArg) => {
          const existing = document.getElementById("myui-whitelist-prompt");
          if (existing) { existing.remove(); return; }

          const el = document.createElement("div");
          el.id = "myui-whitelist-prompt";
          el.style.cssText = [
            "all:initial", "position:fixed", "top:16px", "right:16px",
            "z-index:2147483647", "background:#1e1e2e", "color:#e0e0f0",
            "border:1px solid rgba(109,140,255,0.45)", "border-radius:10px",
            "padding:14px 16px",
            "font:13px/1.4 system-ui,-apple-system,sans-serif",
            "box-shadow:0 4px 24px rgba(0,0,0,0.45)",
            "display:flex", "flex-direction:column", "gap:10px", "max-width:320px"
          ].join(";");

          const safeOrigin = originArg
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          el.innerHTML = `
            <div style="all:initial;display:block;font:700 13px/1.4 system-ui,sans-serif;color:#e0e0f0">Enable MYUI on this site?</div>
            <div style="all:initial;display:block;font:11px/1.5 system-ui,sans-serif;color:rgba(224,224,240,0.6);word-break:break-all">${safeOrigin}</div>
            <div style="all:initial;display:flex;gap:8px">
              <button id="myui-wl-yes" style="all:initial;display:inline-block;padding:5px 14px;border-radius:6px;background:rgba(109,140,255,0.85);color:#fff;font:700 12px system-ui,sans-serif;cursor:pointer;border:none">Add site</button>
              <button id="myui-wl-no"  style="all:initial;display:inline-block;padding:5px 14px;border-radius:6px;background:rgba(255,255,255,0.08);color:rgba(224,224,240,0.75);font:12px system-ui,sans-serif;cursor:pointer;border:1px solid rgba(255,255,255,0.15)">Cancel</button>
            </div>`;

          document.documentElement.appendChild(el);
          document.getElementById("myui-wl-no")
            .addEventListener("click", () => el.remove());
          document.getElementById("myui-wl-yes")
            .addEventListener("click", () => {
              el.remove();
              chrome.runtime.sendMessage({ type: "myui:addToWhitelist", origin: originArg });
            });
        },
        args: [origin]
      });
    } catch (_) {
      // Restricted page (chrome://, PDF viewer, etc.) — silently ignore
    }
    return;
  }

  // Whitelisted — inject scripts if not yet injected for this page load, then toggle
  try {
    if (!injectedTabs.has(tabId)) {
      await chrome.scripting.executeScript({
        target: { tabId }, world: "MAIN", files: ["terms_data.js"]
      });
      await chrome.scripting.executeScript({
        target: { tabId }, world: "MAIN", files: ["defs_data.js"]
      });
      await chrome.scripting.executeScript({
        target: { tabId }, world: "MAIN", files: ["persist.js"]
      });
      await chrome.scripting.executeScript({
        target: { tabId }, world: "MAIN", files: ["render.js"]
      });
      await chrome.scripting.executeScript({
        target: { tabId },
        world: "MAIN",
        func: (assetBaseUrl) => {
          globalThis.__MYUI_ASSET_BASE__ = assetBaseUrl;
        },
        args: [chrome.runtime.getURL("")]
      });
      await chrome.scripting.executeScript({
        target: { tabId }, world: "MAIN", files: ["content.js"]
      });
      injectedTabs.add(tabId);
    }
    await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: () => window.dispatchEvent(new CustomEvent("myui:toggle"))
    });
  } catch (_) {
    // Restricted page — silently ignore
  }
});

// ── Message handler ────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "myui:addToWhitelist" && msg.origin) {
    const tabId = sender.tab?.id;
    addOriginToWhitelist(msg.origin).then(() => {
      if (!tabId) { sendResponse({ ok: true }); return; }
      // Confirm success to the user; they must click the toolbar button to activate
      chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const n = document.createElement("div");
          n.style.cssText = [
            "all:initial", "position:fixed", "top:16px", "right:16px",
            "z-index:2147483647", "background:#0d2214", "color:#6ee79d",
            "border:1px solid rgba(110,231,157,0.30)", "border-radius:10px",
            "padding:11px 16px",
            "font:12px/1.4 system-ui,-apple-system,sans-serif",
            "box-shadow:0 4px 16px rgba(0,0,0,0.35)"
          ].join(";");
          n.textContent = "Site added. Click the toolbar button to activate MYUI.";
          document.documentElement.appendChild(n);
          setTimeout(() => n.remove(), 3500);
        }
      }).catch(() => {});
      sendResponse({ ok: true });
    });
    return true; // keep message channel open for async response
  }
});

// ── Tab lifecycle ──────────────────────────────────────────────────────────
// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});

// Clean up when tab navigates to a new page — extension must be
// re-activated on the new page
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    injectedTabs.delete(tabId);
  }
});
