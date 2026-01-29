import swaggerAutogen from "swagger-autogen";


const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API Produk Tas Velaro",
        description: "ini adalah dokumenati rest API untuk backend dari aplikasi produk tas Velaro By Farhan"
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server"
        },
        {
            url: "https://backend-produk-tas.vercel.app/api",
            description: "Deploy Server"
        }
    ],
    components: {
        securitySchemes:{
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            }
        },
        schemas: {
            RegisterRequest: {
                fullName: "farhan",
                userName: "aan",
                email: "farhan@gmail.com",
                password: "psswrd",
                confirmPassword: "psswrd"
            },
            LoginRequest: {
                identifier: "aan",
                password: "psswrd"
            },
            Activation: {
                code: "1234"
            },
            RemoveImage: {
                fileUrl: "https://cloudinary......./foto.jpg"
            },
            CategoryRequest: {
                name: "category 1",
                icon: "category.jpg",
                description: "this is description of category 1"
            }
        }
    }
}


const outputFile = "./swagger-output.json";
const routes = ['../routes/api.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc);