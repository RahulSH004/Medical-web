module.exports = {
  schema: "./schema.zmodel",
  output: "./src/generated",
  plugins: [
    {
      name: "@zenstackhq/prisma",
      options: {
        output: "./prisma/schema.prisma"
      }
    }
  ]
};