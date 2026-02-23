
export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET,
  database: {
    host: process.env.DATABASE_HOST,
  }
});
