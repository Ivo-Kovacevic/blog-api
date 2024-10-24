const { PrismaClient, Role, Status } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin", 10);
  const admin = await prisma.user.create({
    data: {
      username: "ivo",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create 4 regular users
  const users = [];
  for (let i = 0; i < 4; i++) {
    const password = await bcrypt.hash(faker.internet.password(), 10);
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        password: password,
        role: Role.USER,
      },
    });
    users.push(user);
  }

  // Create 10 posts by admin
  const posts = [];
  for (let i = 0; i < 10; i++) {
    const post = await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        authorId: admin.id,
        status: Status.PUBLISHED,
      },
    });
    posts.push(post);
  }

  // Create comments for each post
  for (const post of posts) {
    const numComments = faker.number.int({ min: 1, max: 5 });
    for (let i = 0; i < numComments; i++) {
      await prisma.comment.create({
        data: {
          text: faker.lorem.sentence(),
          authorId: faker.helpers.arrayElement([...users, admin]).id,
          postId: post.id,
        },
      });
    }
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
