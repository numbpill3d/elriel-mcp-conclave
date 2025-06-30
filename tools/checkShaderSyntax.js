export default {
  checkShaderSyntax: {
    description: 'Check GLSL snippet for basic syntax structure',
    run: async ({ code }) => {
      const errors = []
      if (!code.includes('void main')) errors.push("Missing 'void main'")
      if (!/gl_FragColor|gl_Position/.test(code)) errors.push('No output variable')
      return { isValid: errors.length === 0, errors }
    }
  }
}
