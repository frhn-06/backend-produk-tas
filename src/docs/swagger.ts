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
            },
            ProductCreateRequest: {
                name: "Product 1",
                description: "ini adalah product 1",
                categoryId: ":id",
                price: 50000,
                quantity: 100,
                image: "foto.jpg"
            },
            ProductUpdateRequest: {
                name: "Product 1",
                description: "ini adalah product 1",
                categoryId: ":id",
                price: 50000,
                quantity: 100,
                discount: 0,
                isPublish: true,
                isFeatured: false,
                isDeleted: false,
                image: "foto.jpg",
                images: ["foto1.jpg", "foto2.jpg", "foto3.jpg"],
                
            },
            ReviewRequest: {
                productId: ":id",
                comment: 0,
                stars: 0
            },
            ActivityRequest : {
                name: "name",
                image: ".jpg"
            }
        }
    }
}


const outputFile = "./swagger-output.json";
const routes = ['../routes/api.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc);