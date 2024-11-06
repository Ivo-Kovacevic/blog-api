import { PrismaClient, Role, Status } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const main = async () => {
    try {
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
        const users = await Promise.all(
            Array.from({ length: 20 }, async () => {
                const password = await bcrypt.hash(faker.internet.password(), 10);
                return await prisma.user.create({
                    data: {
                        username: faker.internet.userName(),
                        password,
                        role: Role.USER,
                    },
                });
            })
        );

        // Create 10 posts by admin
        const posts = await Promise.all(
            Array.from({ length: 50 }, async () => {
                return await prisma.post.create({
                    data: {
                        title: faker.lorem.sentence(),
                        text: faker.lorem.paragraphs({ min: 5, max: 15 }),
                        authorId: admin.id,
                        status: Status.PUBLISHED,
                    },
                });
            })
        );

        // Create comments for each post
        for (const post of posts) {
            const numComments = faker.number.int({ min: 5, max: 20 });
            await Promise.all(
                Array.from({ length: numComments }, async () => {
                    return await prisma.comment.create({
                        data: {
                            text: faker.lorem.sentence(),
                            authorId: faker.helpers.arrayElement([...users, admin]).id,
                            postId: post.id,
                        },
                    });
                })
            );
        }

        console.log("Seed data created successfully");
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
};

main();
