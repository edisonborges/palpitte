import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL ?? "postgresql://palpitte:palpitte123@localhost:5432/palpitte";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes
  await prisma.prizeRedemption.deleteMany();
  await prisma.bolaoMember.deleteMany();
  await prisma.bolao.deleteMany();
  await prisma.prediction.deleteMany();
  await prisma.bonusQuestion.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.prize.deleteMany();
  await prisma.resellerSubscription.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 12);
  const resellerHash = await bcrypt.hash("Test123!", 12);

  // Usuário principal de teste (Carlos Silva)
  const userTest = await prisma.user.create({
    data: {
      email: "teste@teste.com",
      name: "Carlos Silva",
      passwordHash,
      role: "USER",
      status: "ACTIVE",
      totalPoints: 1840,
      weeklyPoints: 320,
      monthlyPoints: 820,
      globalRank: 14,
      favoriteTeam: "Flamengo",
      lastLoginAt: new Date(),
    },
  });

  // Revendedor teste
  const resellerTest = await prisma.user.create({
    data: {
      email: "reseller@test.com",
      name: "Rafael Silva",
      passwordHash: resellerHash,
      role: "RESELLER",
      status: "ACTIVE",
      totalPoints: 0,
      weeklyPoints: 0,
      monthlyPoints: 0,
    },
  });

  // Tenant (white label)
  const tenant = await prisma.tenant.create({
    data: {
      slug: "bolaofc",
      platformName: "BolãoFC",
      tagline: "O melhor bolão do futebol brasileiro",
      primaryColor: "#FF6B00",
      secondaryColor: "#FFCA28",
      bgColor: "#0B1120",
      customDomain: "bolaofc.com.br",
      subdomain: "bolaofc",
      plan: "PRO",
      planStatus: "ACTIVE",
      planExpiresAt: new Date("2026-12-31"),
      maxUsers: 10000,
      ownerId: resellerTest.id,
    },
  });

  await prisma.resellerSubscription.create({
    data: {
      tenantId: tenant.id,
      plan: "PRO",
      priceMonthly: 697,
      billingCycle: "MONTHLY",
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Ranking users (top 10)
  const rankingUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: "ricardo.menezes@email.com",
        name: "Ricardo Menezes",
        passwordHash: resellerHash,
        role: "USER",
        status: "ACTIVE",
        totalPoints: 3245,
        weeklyPoints: 245,
        monthlyPoints: 1100,
        globalRank: 1,
        favoriteTeam: "Flamengo",
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "amanda.costa@email.com",
        name: "Amanda Costa",
        passwordHash: resellerHash,
        role: "USER",
        status: "ACTIVE",
        totalPoints: 3120,
        weeklyPoints: 230,
        monthlyPoints: 980,
        globalRank: 2,
        favoriteTeam: "Palmeiras",
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "bruna.oliveira@email.com",
        name: "Bruna Oliveira",
        passwordHash: resellerHash,
        role: "USER",
        status: "ACTIVE",
        totalPoints: 2980,
        weeklyPoints: 222,
        monthlyPoints: 890,
        globalRank: 3,
        favoriteTeam: "Corinthians",
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "joao.ferreira@email.com",
        name: "João Ferreira",
        passwordHash: resellerHash,
        role: "USER",
        status: "ACTIVE",
        totalPoints: 2750,
        weeklyPoints: 198,
        monthlyPoints: 820,
        globalRank: 4,
        favoriteTeam: "Santos",
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "patricia.lima@email.com",
        name: "Patrícia Lima",
        passwordHash: resellerHash,
        role: "USER",
        status: "ACTIVE",
        totalPoints: 2580,
        weeklyPoints: 185,
        monthlyPoints: 760,
        globalRank: 5,
        favoriteTeam: "Grêmio",
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "marcos.souza@email.com",
        name: "Marcos Souza",
        passwordHash: resellerHash,
        role: "USER",
        status: "ACTIVE",
        totalPoints: 2410,
        weeklyPoints: 172,
        monthlyPoints: 710,
        globalRank: 6,
        favoriteTeam: "Atlético Mineiro",
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "fernanda.alves@email.com",
        name: "Fernanda Alves",
        passwordHash: resellerHash,
        role: "USER",
        status: "ACTIVE",
        totalPoints: 2290,
        weeklyPoints: 160,
        monthlyPoints: 680,
        globalRank: 7,
        favoriteTeam: "Fluminense",
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "gabriel.rocha@email.com",
        name: "Gabriel Rocha",
        passwordHash: resellerHash,
        role: "USER",
        status: "ACTIVE",
        totalPoints: 2150,
        weeklyPoints: 148,
        monthlyPoints: 640,
        globalRank: 8,
        favoriteTeam: "São Paulo",
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "camila.nunes@email.com",
        name: "Camila Nunes",
        passwordHash: resellerHash,
        role: "USER",
        status: "ACTIVE",
        totalPoints: 2020,
        weeklyPoints: 135,
        monthlyPoints: 600,
        globalRank: 9,
        favoriteTeam: "Vasco",
        lastLoginAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "lucas.martins@email.com",
        name: "Lucas Martins",
        passwordHash: resellerHash,
        role: "USER",
        status: "ACTIVE",
        totalPoints: 1950,
        weeklyPoints: 128,
        monthlyPoints: 580,
        globalRank: 10,
        favoriteTeam: "Internacional",
        lastLoginAt: new Date(),
      },
    }),
  ]);

  // ─── Competições ────────────────────────────────────────────────────────────
  const brasileirao = await prisma.competition.create({
    data: {
      name: "Brasileirão Série A",
      slug: "brasileirao-serie-a",
      country: "Brasil",
      season: "2025",
      isActive: true,
    },
  });

  const champions = await prisma.competition.create({
    data: {
      name: "Champions League",
      slug: "champions-league",
      country: "Europa",
      season: "2024/25",
      isActive: true,
    },
  });

  const premierLeague = await prisma.competition.create({
    data: {
      name: "Premier League",
      slug: "premier-league",
      country: "Inglaterra",
      season: "2024/25",
      isActive: true,
    },
  });

  const serieA = await prisma.competition.create({
    data: {
      name: "Serie A",
      slug: "serie-a",
      country: "Itália",
      season: "2024/25",
      isActive: true,
    },
  });

  const libertadores = await prisma.competition.create({
    data: {
      name: "Copa Libertadores",
      slug: "libertadores",
      country: "América do Sul",
      season: "2025",
      isActive: true,
    },
  });

  // ─── Times brasileiros ───────────────────────────────────────────────────────
  const flamengo = await prisma.team.create({
    data: {
      name: "Flamengo",
      shortName: "FLA",
      country: "Brasil",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/120px-Flamengo_braz_logo.svg.png",
      competitionId: brasileirao.id,
    },
  });
  const corinthians = await prisma.team.create({
    data: {
      name: "Corinthians",
      shortName: "COR",
      country: "Brasil",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Sport_Club_Corinthians_Paulista_crest.png/120px-Sport_Club_Corinthians_Paulista_crest.png",
      competitionId: brasileirao.id,
    },
  });
  const palmeiras = await prisma.team.create({
    data: {
      name: "Palmeiras",
      shortName: "PAL",
      country: "Brasil",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/120px-Palmeiras_logo.svg.png",
      competitionId: brasileirao.id,
    },
  });
  const gremio = await prisma.team.create({
    data: {
      name: "Grêmio",
      shortName: "GRE",
      country: "Brasil",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Gremio_foot-ball_porto_alegrense_logo.svg/120px-Gremio_foot-ball_porto_alegrense_logo.svg.png",
      competitionId: brasileirao.id,
    },
  });
  const santos = await prisma.team.create({
    data: {
      name: "Santos",
      shortName: "SAN",
      country: "Brasil",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Santos_FC_Logo.png/120px-Santos_FC_Logo.png",
      competitionId: brasileirao.id,
    },
  });
  const atletico = await prisma.team.create({
    data: {
      name: "Atlético Mineiro",
      shortName: "ATM",
      country: "Brasil",
      competitionId: brasileirao.id,
    },
  });

  // ─── Times europeus ──────────────────────────────────────────────────────────
  const manCity = await prisma.team.create({
    data: {
      name: "Manchester City",
      shortName: "MCI",
      country: "Inglaterra",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/120px-Manchester_City_FC_badge.svg.png",
      competitionId: champions.id,
    },
  });
  const realMadrid = await prisma.team.create({
    data: {
      name: "Real Madrid",
      shortName: "RMA",
      country: "Espanha",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/120px-Real_Madrid_CF.svg.png",
      competitionId: champions.id,
    },
  });
  const liverpool = await prisma.team.create({
    data: {
      name: "Liverpool",
      shortName: "LIV",
      country: "Inglaterra",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/120px-Liverpool_FC.svg.png",
      competitionId: premierLeague.id,
    },
  });
  const arsenal = await prisma.team.create({
    data: {
      name: "Arsenal",
      shortName: "ARS",
      country: "Inglaterra",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/120px-Arsenal_FC.svg.png",
      competitionId: premierLeague.id,
    },
  });
  const acMilan = await prisma.team.create({
    data: {
      name: "AC Milan",
      shortName: "MIL",
      country: "Itália",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/120px-Logo_of_AC_Milan.svg.png",
      competitionId: serieA.id,
    },
  });
  const inter = await prisma.team.create({
    data: {
      name: "Inter de Milão",
      shortName: "INT",
      country: "Itália",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/120px-FC_Internazionale_Milano_2021.svg.png",
      competitionId: serieA.id,
    },
  });
  const barcelona = await prisma.team.create({
    data: {
      name: "Barcelona",
      shortName: "BAR",
      country: "Espanha",
      competitionId: champions.id,
    },
  });
  const psg = await prisma.team.create({
    data: {
      name: "PSG",
      shortName: "PSG",
      country: "França",
      competitionId: champions.id,
    },
  });

  // ─── Datas relativas ao dia de hoje ─────────────────────────────────────────
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // Horários de hoje (compatíveis com os screenshots)
  const todayAt16 = new Date(today); todayAt16.setHours(16, 0, 0, 0);
  const todayAt20 = new Date(today); todayAt20.setHours(20, 0, 0, 0);
  const todayAt22 = new Date(today); todayAt22.setHours(22, 0, 0, 0);

  const tomorrowAt15 = new Date(today); tomorrowAt15.setDate(today.getDate() + 1); tomorrowAt15.setHours(15, 30, 0, 0);
  const tomorrowAt18 = new Date(today); tomorrowAt18.setDate(today.getDate() + 1); tomorrowAt18.setHours(18, 0, 0, 0);
  const tomorrowAt21 = new Date(today); tomorrowAt21.setDate(today.getDate() + 1); tomorrowAt21.setHours(21, 0, 0, 0);

  const in2DaysAt20 = new Date(today); in2DaysAt20.setDate(today.getDate() + 2); in2DaysAt20.setHours(20, 0, 0, 0);
  const in3DaysAt19 = new Date(today); in3DaysAt19.setDate(today.getDate() + 3); in3DaysAt19.setHours(19, 0, 0, 0);

  // ─── Partida encerrada (PAL x GRE, 2x0) ─────────────────────────────────────
  const matchPalGre = await prisma.match.create({
    data: {
      homeTeamId: palmeiras.id,
      awayTeamId: gremio.id,
      competitionId: brasileirao.id,
      scheduledAt: new Date(today.getTime() - 3 * 60 * 60 * 1000),
      closedAt: new Date(today.getTime() - 3.5 * 60 * 60 * 1000),
      status: "FINISHED",
      homeScore: 2,
      awayScore: 0,
      venue: "Arena Allianz Parque",
    },
  });

  // ─── Partidas de hoje (SCHEDULED) ────────────────────────────────────────────
  const matchMciRma = await prisma.match.create({
    data: {
      homeTeamId: manCity.id,
      awayTeamId: realMadrid.id,
      competitionId: champions.id,
      scheduledAt: todayAt16,
      closedAt: new Date(todayAt16.getTime() - 30 * 60 * 1000),
      status: "SCHEDULED",
      venue: "Etihad Stadium",
      pointsMultiplier: 1.5,
    },
  });

  const matchFlaCorinthians = await prisma.match.create({
    data: {
      homeTeamId: flamengo.id,
      awayTeamId: corinthians.id,
      competitionId: brasileirao.id,
      scheduledAt: todayAt20,
      closedAt: new Date(todayAt20.getTime() - 30 * 60 * 1000),
      status: "SCHEDULED",
      venue: "Estádio Maracanã",
    },
  });

  await prisma.bonusQuestion.createMany({
    data: [
      {
        matchId: matchFlaCorinthians.id,
        question: "Quem marca o primeiro gol?",
        options: JSON.stringify(["Gabigol", "Yuri Alberto", "Ninguém"]),
        pointsReward: 10,
      },
      {
        matchId: matchFlaCorinthians.id,
        question: "Resultado do 1º Tempo?",
        options: JSON.stringify(["Flamengo vence", "Empate", "Corinthians vence"]),
        pointsReward: 10,
      },
      {
        matchId: matchFlaCorinthians.id,
        question: "Mais de 2.5 cartões?",
        options: JSON.stringify(["Sim", "Não"]),
        pointsReward: 10,
      },
    ],
  });

  // ─── Partidas de amanhã ──────────────────────────────────────────────────────
  const matchRmaFla = await prisma.match.create({
    data: {
      homeTeamId: realMadrid.id,
      awayTeamId: flamengo.id,
      competitionId: libertadores.id,
      scheduledAt: tomorrowAt15,
      closedAt: new Date(tomorrowAt15.getTime() - 30 * 60 * 1000),
      status: "SCHEDULED",
      venue: "Estádio Santiago Bernabéu",
      pointsMultiplier: 2.0,
    },
  });

  const matchLivArs = await prisma.match.create({
    data: {
      homeTeamId: liverpool.id,
      awayTeamId: arsenal.id,
      competitionId: premierLeague.id,
      scheduledAt: tomorrowAt18,
      closedAt: new Date(tomorrowAt18.getTime() - 30 * 60 * 1000),
      status: "SCHEDULED",
      venue: "Anfield",
    },
  });

  await prisma.bonusQuestion.createMany({
    data: [
      {
        matchId: matchLivArs.id,
        question: "Quem vence o duelo?",
        options: JSON.stringify(["Liverpool", "Empate", "Arsenal"]),
        pointsReward: 10,
      },
      {
        matchId: matchLivArs.id,
        question: "Mais de 3 gols?",
        options: JSON.stringify(["Sim", "Não"]),
        pointsReward: 10,
      },
    ],
  });

  const matchMilInt = await prisma.match.create({
    data: {
      homeTeamId: acMilan.id,
      awayTeamId: inter.id,
      competitionId: serieA.id,
      scheduledAt: tomorrowAt21,
      closedAt: new Date(tomorrowAt21.getTime() - 30 * 60 * 1000),
      status: "SCHEDULED",
      venue: "San Siro",
    },
  });

  await prisma.bonusQuestion.createMany({
    data: [
      {
        matchId: matchMilInt.id,
        question: "Resultado do Derby?",
        options: JSON.stringify(["Milan", "Empate", "Inter"]),
        pointsReward: 10,
      },
      {
        matchId: matchMilInt.id,
        question: "Menos de 2 gols?",
        options: JSON.stringify(["Sim", "Não"]),
        pointsReward: 10,
      },
    ],
  });

  const matchFlaPal = await prisma.match.create({
    data: {
      homeTeamId: flamengo.id,
      awayTeamId: palmeiras.id,
      competitionId: brasileirao.id,
      scheduledAt: in2DaysAt20,
      closedAt: new Date(in2DaysAt20.getTime() - 30 * 60 * 1000),
      status: "SCHEDULED",
      venue: "Estádio Maracanã",
    },
  });

  const matchBarPsg = await prisma.match.create({
    data: {
      homeTeamId: barcelona.id,
      awayTeamId: psg.id,
      competitionId: champions.id,
      scheduledAt: in3DaysAt19,
      closedAt: new Date(in3DaysAt19.getTime() - 30 * 60 * 1000),
      status: "SCHEDULED",
      venue: "Estádio Olímpico de Montjuïc",
      pointsMultiplier: 1.5,
    },
  });

  // ─── Partidas encerradas adicionais ──────────────────────────────────────────
  const finishedMatch1 = await prisma.match.create({
    data: {
      homeTeamId: manCity.id,
      awayTeamId: barcelona.id,
      competitionId: champions.id,
      scheduledAt: new Date(today.getTime() - 24 * 60 * 60 * 1000),
      closedAt: new Date(today.getTime() - 24.5 * 60 * 60 * 1000),
      status: "FINISHED",
      homeScore: 3,
      awayScore: 1,
      venue: "Etihad Stadium",
      pointsMultiplier: 1.5,
    },
  });

  const finishedMatch2 = await prisma.match.create({
    data: {
      homeTeamId: flamengo.id,
      awayTeamId: santos.id,
      competitionId: brasileirao.id,
      scheduledAt: new Date(today.getTime() - 48 * 60 * 60 * 1000),
      closedAt: new Date(today.getTime() - 48.5 * 60 * 60 * 1000),
      status: "FINISHED",
      homeScore: 2,
      awayScore: 0,
      venue: "Estádio Maracanã",
    },
  });

  // ─── Palpites do usuário principal (histórico) ───────────────────────────────
  await prisma.prediction.create({
    data: {
      userId: userTest.id,
      matchId: matchPalGre.id,
      homeScore: 2,
      awayScore: 0,
      pointsEarned: 40,
      isExact: true,
      isCorrectResult: true,
    },
  });

  await prisma.prediction.create({
    data: {
      userId: userTest.id,
      matchId: finishedMatch1.id,
      homeScore: 3,
      awayScore: 1,
      pointsEarned: 60,
      isExact: true,
      isCorrectResult: true,
    },
  });

  await prisma.prediction.create({
    data: {
      userId: userTest.id,
      matchId: finishedMatch2.id,
      homeScore: 1,
      awayScore: 0,
      pointsEarned: 20,
      isExact: false,
      isCorrectResult: true,
    },
  });

  // ─── Bolões ──────────────────────────────────────────────────────────────────
  const bolaoGaleraTI = await prisma.bolao.create({
    data: {
      name: "Bolão da Galera TI",
      description: "Bolão do time de tecnologia",
      inviteCode: "TI2025",
      createdById: userTest.id,
      isPublic: false,
      status: "ACTIVE",
      maxMembers: 20,
    },
  });

  await prisma.bolaoMember.create({
    data: { bolaoId: bolaoGaleraTI.id, userId: userTest.id, totalPoints: 320, rank: 2 },
  });
  for (const user of rankingUsers.slice(0, 5)) {
    await prisma.bolaoMember.create({
      data: {
        bolaoId: bolaoGaleraTI.id,
        userId: user.id,
        totalPoints: Math.floor(Math.random() * 400) + 100,
        rank: Math.floor(Math.random() * 10) + 1,
      },
    });
  }

  const bolaoFamilia = await prisma.bolao.create({
    data: {
      name: "Família Silva 2024",
      description: "Bolão da família",
      inviteCode: "FAM001",
      createdById: userTest.id,
      isPublic: false,
      status: "ACTIVE",
      maxMembers: 10,
    },
  });

  await prisma.bolaoMember.create({
    data: { bolaoId: bolaoFamilia.id, userId: userTest.id, totalPoints: 180, rank: 1 },
  });
  for (const user of rankingUsers.slice(5, 8)) {
    await prisma.bolaoMember.create({
      data: {
        bolaoId: bolaoFamilia.id,
        userId: user.id,
        totalPoints: Math.floor(Math.random() * 200) + 50,
        rank: Math.floor(Math.random() * 5) + 2,
      },
    });
  }

  const bolaoAmigos = await prisma.bolao.create({
    data: {
      name: "Copa dos Amigos",
      description: "Bolão público geral",
      inviteCode: "COPA33",
      createdById: rankingUsers[0].id,
      isPublic: true,
      status: "ACTIVE",
    },
  });

  await prisma.bolaoMember.create({
    data: { bolaoId: bolaoAmigos.id, userId: userTest.id, totalPoints: 280, rank: 3 },
  });
  for (const user of rankingUsers.slice(0, 6)) {
    await prisma.bolaoMember.create({
      data: {
        bolaoId: bolaoAmigos.id,
        userId: user.id,
        totalPoints: Math.floor(Math.random() * 500) + 100,
        rank: Math.floor(Math.random() * 15) + 1,
      },
    });
  }

  // ─── Prêmios ─────────────────────────────────────────────────────────────────
  await prisma.prize.createMany({
    data: [
      {
        name: "Bola Oficial",
        description: "A mesma bola usada nas finais europeias.",
        pointsCost: 1500,
        stock: 10,
        isActive: true,
      },
      {
        name: "Camisa Oficial",
        description: "Manto sagrado do seu time do coração.",
        pointsCost: 2500,
        stock: 20,
        isActive: true,
      },
      {
        name: "Chuteira Pro",
        description: "Alta performance para seus jogos.",
        pointsCost: 5000,
        stock: 5,
        isActive: true,
      },
      {
        name: "Ingresso VIP",
        description: "Experiência única direto do camarote.",
        pointsCost: 8000,
        stock: 3,
        isActive: true,
      },
    ],
  });

  console.log("✅ Seed concluído com sucesso!");
  console.log("📧 teste@teste.com | senha: 123456");
  console.log("📧 reseller@test.com | senha: Test123!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
