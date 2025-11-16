const { prisma } = require('../db/config');

async function deleteUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      console.log('User not found');
      return;
    }

    if (user.role === 'PATIENT') {
      await prisma.patient.deleteMany({ where: { userId: user.id } });
    }
    
    if (user.role === 'DOCTOR') {
      await prisma.doctor.deleteMany({ where: { userId: user.id } });
    }

    await prisma.user.delete({ where: { email } });
    
    console.log(`User with email ${email} deleted successfully`);
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const emailToDelete = process.argv[2];

if (!emailToDelete) {
  console.log('Usage: node deleteUser.js <email>');
  process.exit(1);
}

deleteUserByEmail(emailToDelete);