var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient, Role, Status } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create admin user
        const adminPassword = yield bcrypt.hash("admin", 10);
        const admin = yield prisma.user.create({
            data: {
                username: "ivo",
                password: adminPassword,
                role: Role.ADMIN,
            },
        });
        // Create 4 regular users
        const users = yield Promise.all(Array.from({ length: 4 }, () => __awaiter(void 0, void 0, void 0, function* () {
            const password = yield bcrypt.hash(faker.internet.password(), 10);
            return yield prisma.user.create({
                data: {
                    username: faker.internet.userName(),
                    password,
                    role: Role.USER,
                },
            });
        })));
        // Create 10 posts by admin
        const posts = yield Promise.all(Array.from({ length: 10 }, () => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.post.create({
                data: {
                    title: faker.lorem.sentence(),
                    text: faker.lorem.paragraphs(),
                    authorId: admin.id,
                    status: Status.PUBLISHED,
                },
            });
        })));
        // Create comments for each post
        for (const post of posts) {
            const numComments = faker.number.int({ min: 1, max: 5 });
            yield Promise.all(Array.from({ length: numComments }, () => __awaiter(void 0, void 0, void 0, function* () {
                return yield prisma.comment.create({
                    data: {
                        text: faker.lorem.sentence(),
                        authorId: faker.helpers.arrayElement([...users, admin]).id,
                        postId: post.id,
                    },
                });
            })));
        }
        console.log("Seed data created successfully");
    }
    catch (error) {
        console.error(error);
    }
    finally {
        yield prisma.$disconnect();
    }
});
main();
//# sourceMappingURL=seed.js.map