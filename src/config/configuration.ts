
export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  jwtSecret: process.env.JWT_SECRET || 'secret123',
  database: {
    host: process.env.DATABASE_HOST,
  }
});
