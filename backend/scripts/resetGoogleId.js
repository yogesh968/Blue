const { prisma } = require('../db/config');

async function resetGoogleId(email) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { googleId: null }
    });
    
    console.log(`Reset googleId for user: ${user.email}`);
  } catch (error) {
    console.error('Error resetting googleId:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Usage: node resetGoogleId.js <email>');
  process.exit(1);
}

resetGoogleId(email);