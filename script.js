import { prisma } from './lib/prisma.js';

async function main() {
	const user = await prisma.user.create({
		data: {
			username: 'Alice',
			password: '123123',
			folders: {
				create: {
					name: 'Folder1',
				},
			},
			files: {
				create: {
					name: 'File1',
					size: 10,
					url: 'https://www.google.com/',
					mimeType: 'mime1',
				},
			},
		},
    });

    console.log("Created user:", user);
    
    const allUsers = await prisma.user.findMany({
        include: {
            folders: true,
            files: true
        }
    })
    console.log("All users:", JSON.stringify(allUsers, null ,2));    
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1)
})
