// Database configuration placeholder
// This will be implemented by Person 4 (Core Setup)

// For now, we'll create a simple mock for development
const mockPrisma = {
  user: {
    findUnique: async () => null,
    findFirst: async () => null,
    create: async (data) => ({ id: 1, ...data.data }),
    update: async (params) => ({ id: 1, ...params.data }),
    deleteMany: async () => ({ count: 0 })
  },
  patient: {
    findUnique: async () => null,
    create: async (data) => ({ id: 1, ...data.data }),
    update: async (params) => ({ id: 1, ...params.data }),
    deleteMany: async () => ({ count: 0 })
  },
  $disconnect: async () => {}
};

// Export mock prisma for development
// Person 4 will replace this with actual Prisma client
const prisma = mockPrisma;

module.exports = { prisma };