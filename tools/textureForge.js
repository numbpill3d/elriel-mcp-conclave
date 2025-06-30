export default {
  generateTexturePrompt: {
    description: "Create a texture concept description Claude can use with a texture AI API",
    run: async ({ concept, style }) => {
      return {
        prompt: `A seamless ${concept} texture in ${style} style, tileable, PBR-friendly`
      }
    }
  }
}
