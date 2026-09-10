# Ambiguous Brief Prototyping

Use this flow when the request does not establish a clear visual direction.

1. Extract known facts and ask 3-5 relevant questions from the prompts below, omitting
   questions already answered by the user or project. Summarize assumptions in the brief.
2. Build one temporary HTML prototype at 1920 x 1080 unless a target canvas is known.
   Use the same representative data and business question across 2-3 variants. Provide
   accessible tabs outside the preview canvas; switching updates `?variant=a|b|c` and
   `data-variant` on the screen. Direct links restore the selection; missing or unknown
   variants use `a`. Use the installed component registration path when using dvk elements.
3. Give each variant a different layout archetype (for example map-led, KPI-led or
   topology-led), reading order and density. Use real labels and placeholder values so
   the user can judge hierarchy and fit.
4. Render each variant in a browser and show screenshots plus runnable links. Explain the
   reading order and tradeoff of each outside the screen; recommend one. Wait for the
   user's selection unless autonomous selection was explicitly requested.
5. Record the selected variant, canvas, hierarchy, palette, data assumptions and interaction
   requirements in the project's existing design record (or a concise handoff note).
   Remove prototype-only controls from production, preserve the chosen composition and
   replace placeholder data through the project's existing data layer. Distinguish demo
   data from live data and implement loading, empty, failed and stale states.

## Question prompts

- Audience and decision: "谁会看这块屏？最希望一眼发现什么问题、做什么决定？"
- Metrics and freshness: "哪些数据必须出现？单位、统计周期和更新频率是什么？有接口还是先用演示数据？"
- Installation: "屏幕比例/分辨率和观看距离是多少？只展示还是有人操作？"
- Interaction and states: "需要筛选、地图选区、设备详情或告警联动吗？断线时保留旧数据还是隐藏？"
- Visual and content constraints: "有品牌色或参考图吗？偏克制分析还是指挥监控？哪些内容和效果不要出现？"

Prototype acceptance requires a visible primary visual, readable labels at the target
ratio, no overflow, working tabs/direct links, and a clear difference between variants even
when viewed as grayscale thumbnails. Include real chart shapes or recognizable spatial
outlines so the user can judge composition, rather than only empty boxes. It is a decision artifact,
not a production deliverable; still verify it in the browser before asking the user to
choose.
