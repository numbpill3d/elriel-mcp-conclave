export default {
  getAssetLinks: {
    description: "Return curated external links for 3D assets from free repositories.",
    run: async ({ type = "model" }) => {
      const base = {
        model: [
          { name: "Poly Haven Models", url: "https://polyhaven.com/models" },
          { name: "Kenney Assets", url: "https://kenney.nl/assets" },
          { name: "Quaternius Free Models", url: "https://quaternius.com/" },
          { name: "Sketchfab CC Models", url: "https://sketchfab.com/search?features=downloadable&license=cc0" }
        ],
        texture: [
          { name: "Poly Haven Textures", url: "https://polyhaven.com/textures" },
          { name: "ambientCG", url: "https://ambientcg.com/" }
        ],
        hdri: [
          { name: "Poly Haven HDRIs", url: "https://polyhaven.com/hdris" },
          { name: "HDRI Haven", url: "https://hdrihaven.com/" }
        ]
      }
      return base[type] || { error: "Invalid type" }
    }
  }
}
