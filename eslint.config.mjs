// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'app',
    pnpm: true,
    typescript: true,
    ignores: [
      'apps/backend/',
    ],
  },
)
