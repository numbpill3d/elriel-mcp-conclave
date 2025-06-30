export default {
  generateSkyboxPrompt: {
    description: "Create a 6-panel skybox concept for Claude to render or request via AI image tools",
    run: async ({ theme, mood }) => {
      return {
        faces: {
          front: `${theme} horizon, ${mood} tone`,
          back: `${theme} dusk glow`,
          left: `${theme} detail streaks`,
          right: `${theme} wind trails`,
          top: `${theme} sky stars`,
          bottom: `${theme} haze or floor`
        },
        suggestion: "Use a text-to-image tool to render 1024x1024 panels from each face prompt."
      }
    }
  }
}
