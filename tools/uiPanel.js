export default {
  generateUIPanel: {
    description: "Generate a low-poly themed UI panel for character stats, styled like Elriel's interface.",
    run: async ({ panelTitle = "Character Core", fields = ["Sanity", "Aura", "Shell"], palette = ["#301b2d", "#b9aac4"] }) => {
      return {
        html: `<div style="width: 300px; background: ${palette[0]}; border: 2px solid ${palette[1]}; padding: 10px; font-family: monospace; color: ${palette[1]};">
  <h2 style="text-align: center; font-size: 18px;">${panelTitle}</h2>
  <hr style="border-color: ${palette[1]}">
  ${fields.map(f => `<div style="margin: 6px 0;">${f}: <span style="float:right;">[ ?? ]</span></div>`).join("")}
</div>`
      }
    }
  }
}
