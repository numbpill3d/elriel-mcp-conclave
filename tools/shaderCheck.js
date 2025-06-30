export default {
  shaderCheck: {
    description: "Check a GLSL shader snippet for syntax structure (basic check only)",
    run: async ({ code }) => {
      const hasMain = code.includes("void main")
      const errors = []
      if (!hasMain) errors.push("Missing 'void main' function")
      if (!code.includes("gl_FragColor") && !code.includes("gl_Position"))
        errors.push("Missing standard output variables")
      return {
        isValid: errors.length === 0,
        errors
      }
    }
  }
}
