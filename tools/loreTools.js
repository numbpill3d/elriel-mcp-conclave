import fs from 'fs'

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

export default {
  loadLoreContext: {
    description: "Load merged lore context including zone, sigil, and NPC data.",
    run: async () => {
      return {
        zones: readJSON('./lore/zones.json'),
        npcs: readJSON('./lore/npc_personas.json'),
        sigils: readJSON('./lore/sigil_glossary.json')
      }
    }
  },

  getZoneInfo: {
    description: "Get lore for a specific zone.",
    run: async ({ zone }) => {
      const data = readJSON('./lore/zones.json')
      return data[zone] || { error: "Zone not found." }
    }
  },

  addZoneLore: {
    description: "Add or update a zone's lore.",
    run: async ({ zone, data }) => {
      const file = './lore/zones.json'
      const zones = readJSON(file)
      zones[zone] = { ...(zones[zone] || {}), ...data }
      writeJSON(file, zones)
      return { success: true, zone, updated: zones[zone] }
    }
  },

  getNPCPersona: {
    description: "Get lore data for an NPC.",
    run: async ({ name }) => {
      const data = readJSON('./lore/npc_personas.json')
      return data[name] || { error: "NPC not found." }
    }
  },

  addNPCPersona: {
    description: "Add or update an NPC's persona.",
    run: async ({ name, data }) => {
      const file = './lore/npc_personas.json'
      const npcs = readJSON(file)
      npcs[name] = { ...(npcs[name] || {}), ...data }
      writeJSON(file, npcs)
      return { success: true, name, updated: npcs[name] }
    }
  },

  getSigilMeaning: {
    description: "Return interpretation of a sigil.",
    run: async ({ symbol }) => {
      const data = readJSON('./lore/sigil_glossary.json')
      return data[symbol] || { error: "Sigil not found." }
    }
  },

  addSigilDefinition: {
    description: "Add or update a sigil meaning.",
    run: async ({ symbol, meaning }) => {
      const file = './lore/sigil_glossary.json'
      const sigils = readJSON(file)
      sigils[symbol] = meaning
      writeJSON(file, sigils)
      return { success: true, symbol, meaning }
    }
  }
}
