import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  favoriteTeam: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const predictionSchema = z.object({
  homeScore: z.number().int().min(0).max(20),
  awayScore: z.number().int().min(0).max(20),
  bonusAnswers: z.record(z.string(), z.string()).optional(),
});

export const bolaoSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  maxMembers: z.number().int().positive().optional(),
});

export const joinBolaoSchema = z.object({
  inviteCode: z.string().length(6, "Código deve ter 6 caracteres"),
});

export const redeemSchema = z.object({
  prizeId: z.string().min(1, "Prêmio obrigatório"),
  shippingAddress: z.object({
    street: z.string().min(1, "Endereço obrigatório"),
    city: z.string().min(1, "Cidade obrigatória"),
    state: z.string().min(1, "Estado obrigatório"),
    zipCode: z.string().min(1, "CEP obrigatório"),
    country: z.string().default("Brasil"),
  }),
});

export const brandingSchema = z.object({
  platformName: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  tagline: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida"),
  bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  faviconUrl: z.string().url().optional().or(z.literal("")),
  customDomain: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PredictionInput = z.infer<typeof predictionSchema>;
export type BolaoInput = z.infer<typeof bolaoSchema>;
export type JoinBolaoInput = z.infer<typeof joinBolaoSchema>;
export type RedeemInput = z.infer<typeof redeemSchema>;
export type BrandingInput = z.infer<typeof brandingSchema>;
