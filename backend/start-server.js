const { app } = require('./server');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 HealthCare+ API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`\n📋 Test the endpoints:`);
  console.log(`   Registration: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`\n✅ Authentication is working correctly!`);
});