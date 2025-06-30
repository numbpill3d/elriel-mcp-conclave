import fs from 'fs'

export default {
  recommendAssetsByStyle: {
    description: "Analyzes the style guide and returns suggested model/texture/HDRI resources that match the aesthetic.",
    run: async () => {
      const style = JSON.parse(fs.readFileSync('./public/docs/styleguide.json', 'utf-8'))
      const matches = []

      if (style.biomes.includes("ashlands")) {
        matches.push({ name: "Lava Rock Texture", source: "ambientCG", url: "https://ambientcg.com/view?id=Rock043" })
        matches.push({ name: "Volcanic Desert HDRI", source: "PolyHaven", url: "https://polyhaven.com/hdris?c=desert" })
      }

      if (style.vibe.includes("chitinous") || style.keywords.includes("insectoid")) {
        matches.push({ name: "Bug Model Pack", source: "Quaternius", url: "https://quaternius.com/packs.html" })
        matches.push({ name: "Insect Texture Sheet", source: "Textures.com", url: "https://www.textures.com/browse/insects/102665" })
      }

      if (style.vibe.includes("glow") || style.vfx.includes("aura")) {
        matches.push({ name: "Glowing Mushroom Models", source: "Kenney", url: "https://kenney.nl/assets/glowing-mushrooms" })
        matches.push({ name: "ShaderToy Glow FX", source: "ShaderToy", url: "https://www.shadertoy.com/" })
      }

      return matches
    }
  }
}
