# Project Image Slots

Drop project screenshots or photos here. The portfolio will show a photo automatically when the matching filename exists; otherwise it keeps the designed fallback panel.

Expected filenames:

- `zoj-dashboard.jpg`
- `zoj-sandbox.jpg`
- `zoj-monitoring.jpg`
- `zerone-home.jpg`
- `zerone-members.jpg`
- `zerone-events.jpg`
- `sdy-coder-editor.jpg`
- `sdy-coder-runtime.jpg`
- `sdy-coder-settings.jpg`
- `sdy-coder-language.jpg`
- `nmixx-feed.jpg`
- `nmixx-streaming.jpg`
- `nmixx-search.jpg`
- `hepc-venue.jpg`
- `hepc-ops.jpg`
- `hepc-judge.jpg`
- `efoo-list.jpg`
- `efoo-detail.jpg`
- `efoo-review.jpg`
- `homelab-rack.jpg`
- `homelab-network.jpg`
- `homelab-proxmox.jpg`
- `weather-device.jpg`
- `weather-live.jpg`
- `weather-chart.jpg`
- `plant-device.jpg`
- `plant-pump.jpg`
- `plant-monitoring.jpg`
- `chatbot-flow.jpg`
- `chatbot-meal.jpg`
- `chatbot-schedule.jpg`

Service links are controlled in `app/static/app.js` under each project's `links` array:

```js
links: [
  { label: "Service", url: "https://example.com" },
  { label: "GitHub", url: "https://github.com/..." },
]
```
