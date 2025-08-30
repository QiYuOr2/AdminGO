import z from 'zod'

export const PermissionSchema = z.object({
  id: z.number(),
  path: z.string().optional().nullable(),
  code: z.string().optional().nullable(),
})
