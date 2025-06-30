export default {
  listFreeAssets: {
    description: "Returns curated URLs to free 3D models, textures, HDRIs, and scenes. Use when generating Three.js content, scenes, or UIs. Includes PolyHaven, Sketchfab, Quaternius, ambientCG, Kenney, and more.",
    run: async ({ type = "model" }) => {
      const resources = {
        model: [
          { name: "Poly Haven Models", url: "https://polyhaven.com/models" },
          { name: "Kenney Assets", url: "https://kenney.nl/assets" },
          { name: "Quaternius Free Models", url: "https://quaternius.com" },
          { name: "Sketchfab CC Models", url: "https://sketchfab.com/search?features=downloadable&license=cc0" },
          { name: "CGTrader Free", url: "https://www.cgtrader.com/free-3d-models" },
          { name: "Clara.io Free Models", url: "https://clara.io/library" },
          { name: "TurboSquid Free Models", url: "https://www.turbosquid.com/Search/3D-Models/free" },
          { name: "SketchUp Texture Club", url: "https://www.sketchuptextureclub.com/3d-models" },
          { name: "3DAssets.one Aggregator", url: "https://3dassets.one/" }
        ],
        texture: [
          { name: "Poly Haven Textures", url: "https://polyhaven.com/textures" },
          { name: "ambientCG (formerly CC0Textures)", url: "https://ambientcg.com" },
          { name: "Textures.com", url: "https://www.textures.com/" },
          { name: "TextureCan", url: "https://www.texturecan.com/" },
          { name: "ShareTextures", url: "https://www.sharetextures.com/" },
          { name: "3DJungle Free PBR", url: "https://3djungle.net/textures/free-pbr/" }
        ],
        hdri: [
          { name: "Poly Haven HDRIs", url: "https://polyhaven.com/hdris" },
          { name: "HDRI Haven (archived)", url: "https://hdrihaven.com/hdris/" },
          { name: "HDRI Skies", url: "https://hdri-skies.com/" },
          { name: "CGSkies", url: "https://www.cgskies.com/" }
        ],
        character: [
          { name: "Quaternius Free Rigs", url: "https://quaternius.com" },
          { name: "Mixamo Characters", url: "https://www.mixamo.com/#/" },
          { name: "ReadyPlayerMe", url: "https://readyplayer.me/" },
          { name: "Human Generator", url: "https://humans.fasani.dev/" }
        ],
        vehicle: [
          { name: "Free3D Vehicles", url: "https://free3d.com/3d-model/car--vehicle" },
          { name: "CGTrader Vehicles", url: "https://www.cgtrader.com/free-3d-models/car" }
        ],
        environment: [
          { name: "Kenney's Environment Kit", url: "https://kenney.nl/assets/nature-kit" },
          { name: "Quaternius Worlds", url: "https://quaternius.com/packs.html" },
          { name: "Free PBR Environment Maps", url: "https://polyhaven.com/hdris" }
        ],
        sandbox: [
          { name: "Three.js Journey Examples", url: "https://threejs-journey.xyz/" },
          { name: "Three.js Editor", url: "https://threejs.org/editor/" },
          { name: "Remix Sandbox", url: "https://remix.run/" },
          { name: "ShaderToy", url: "https://www.shadertoy.com/" }
        ]
      }

      return resources[type] || resources["model"]
    }
  }
}
