import {Router} from 'express'

import dummyController from '../controllers/dummy.controller';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';
import mediaMiddleware from '../middleware/media.middleware';
import mediaControler from '../controllers/media.controler';
import aclMiddleware from '../middleware/acl.middleware';
import categoryController from '../controllers/category.controller';
import productController from '../controllers/product.controller';
import ReviewController from '../controllers/review.controller';
import activityController from '../controllers/activity.controller';
import bannerController from '../controllers/banner.controller';
import cartController from '../controllers/cart.controller';
import orderController from '../controllers/order.controller';
import { runInContext } from 'vm';

const router = Router();


router.get('/dummy', dummyController.dummy)


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/auth/register", authController.register
    /**
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegisterRequest"
            }
          }
        }
      } 
    */
);

router.post("/auth/activation", authController.activation
    /**
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Activation"
            }
          }
        }
      } 
    */
);

router.post("/auth/login", authController.login
    /**
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginRequest"
            }
          }
        }
      } 
    */
);

router.get("/auth/me", authMiddleware, authController.me
    /**
      #swagger.tags = ['Auth']
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);

// router.get("/auth/:id/user", authMiddleware, authController.user
    /*
      #swagger.tags = ['Auth']
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
// )


///////////////////////////////////////////////////////////////////////////////////////////////////////////////











///////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.post("/review", [authMiddleware, aclMiddleware(["admin", "member"])], ReviewController.create
    /*
      #swagger.tags = ["Review"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ReviewRequest"
            }
          }
        }
      } 
    */
);


router.get("/review/:productId", ReviewController.findByProduct
    /*
      #swagger.tags = ["Review"]
    */
);


router.delete("/review/:id", [authMiddleware, aclMiddleware(["admin", "member"])], ReviewController.delete
    /*
      #swagger.tags = ["Review"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
















///////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.post("/media/upload-single", [authMiddleware, mediaMiddleware.single("file")], mediaControler.uploadSingle
    /**
      #swagger.tags = ["Media"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
      #swagger.requestBody = {
        required: true,
        content: {
          "multipart/form-data" : {
            schema: {
              type: "object",
              properties: {
                file: {
                  type: "string",
                  format: "binary"
                }
              }
            }
          }
        }
      } 
    */
);

router.post("/media/upload-multiple", [authMiddleware, mediaMiddleware.multiple("files")], mediaControler.uploadMultiple
    /**
      #swagger.tags = ["Media"]
      #swagger.security = [{
        "bearerAuth" : []
      }] 
      #swagger.requestBody = {
        required: true,
        content: {
          "multipart/form-data" : {
            schema: {
              type: "object",
              properties: {
                files: {
                  type: "string",
                  format: "array",
                  items: {
                    type: "string",
                    format: "binary"
                  }
                }
              }
            }
          }
        }
      }
    */
);
router.delete("/media/remove", authMiddleware, mediaControler.remove
    /**
      #swagger.tags = ["Media"]
      #swagger.security = [{
        "bearerAuth" : []
      }] 
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json" : {
            schema: {
              $ref: "#/components/schemas/RemoveImage"
            }
          }
        }
      }  
    */
);



///////////////////////////////////////////////////////////////////////////////////////////////////////////////












///////////////////////////////////////////////////////////////////////////////////////////////////////////////



router.post("/category", [authMiddleware, aclMiddleware(["admin"])], categoryController.create
    /**
      #swagger.tags = ["Category"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json" : {
            schema: {
              $ref: "#/components/schemas/CategoryRequest"
            }
          }
        }
      } 
    */
);

router.get("/category", categoryController.findAll
    /*
      #swagger.tags = ["Category"]
    */
);

router.get("/category/:id", categoryController.findOne
    /**
      #swagger.tags = ["Category"]
    */
);

router.put("/category/:id", [authMiddleware, aclMiddleware(["admin"])], categoryController.update
    /**
      #swagger.tags = ["Category"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json" : {
            schema: {
              $ref: "#/components/schemas/CategoryRequest"
            }
          }
        }
      }
    */
);

router.delete("/category/:id/delete", [authMiddleware, aclMiddleware(["admin"])], categoryController.remove
    /**
      #swagger.tags = ["Category"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);





///////////////////////////////////////////////////////////////////////////////////////////////////////////////











///////////////////////////////////////////////////////////////////////////////////////////////////////////////



router.post("/product", [authMiddleware, aclMiddleware(["admin"])], productController.create
    /**
      #swagger.tags = ["Product"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
      #swagger.requestBody = {
        required: true,
        content : {
          "application/json" : {
            schema: {
              $ref: "#/components/schemas/ProductCreateRequest"
            }
          }
        }
      }
    */
);

router.get("/product", productController.findAll
    /**
      #swagger.tags = ["Product"] 
    */
);

router.get("/product/:id", productController.findOneByID
    /*
      #swagger.tags = ["Product"]
    */
);

router.get("/product/:slug/slug", productController.findOneBySlug
    /**
      #swagger.tags = ["Product"] 
    */
);

router.put("/product/:id", [authMiddleware, aclMiddleware(["admin"])], productController.update
    /*
      #swagger.tags = ["Product"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
      #swagger.requestBody = {
        required: true,
        content : {
          "application/json" : {
            schema: {
              $ref: "#/components/schemas/ProductUpdateRequest"
            }
          }
        }
      }
    */
);

router.put("/product/:id/delete", [authMiddleware, aclMiddleware(["admin"])], productController.delete
    /*
      #swagger.tags = ["Product"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);

router.put("/product/:id/restore", [authMiddleware, aclMiddleware(["admin"])], productController.restore
    /*
      #swagger.tags = ["Product"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);

router.delete("/product/:id/delete-permanent", [authMiddleware, aclMiddleware(["admin"])], productController.deletePermanent
    /*
      #swagger.tags = ["Product"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);


router.get("/product-deleted", [authMiddleware, aclMiddleware(["admin"])], productController.findDelete
    /*
      #swagger.tags = ["Product"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
)





///////////////////////////////////////////////////////////////////////////////////////////////////////////////








///////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.post("/activity", [authMiddleware, aclMiddleware(["admin"])], activityController.create
    /*
      #swagger.tags = ["Activity"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
      #swagger.requestBody = {
        requied: true,
        content: {
          "application/json" : {
            schema : {
              $ref: "#/components/schemas/ActivityRequest"
            }
          }
        }
      }
    */
);


router.get("/activity", activityController.findAll
    /*
      #swagger.tags = ["Activity"]
    */
);

router.get("/activity/:id", activityController.findById
    /*
      #swagger.tags = ["Activity"]
    */
);

router.put("/activity/:id", [authMiddleware, aclMiddleware(["admin"])], activityController.update
    /*
      #swagger.tags = ["Activity"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
      #swagger.requestBody = {
        requied: true,
        content: {
          "application/json" : {
            schema : {
              $ref: "#/components/schemas/ActivityRequest"
            }
          }
        }
      }
    */
);

router.delete("/activity/:id", [authMiddleware, aclMiddleware(["admin"])], activityController.delete
    /*
      #swagger.tags = ["Activity"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);




///////////////////////////////////////////////////////////////////////////////////////////////////////////////








//////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.post("/banner", [authMiddleware, aclMiddleware(["admin"])], bannerController.create
    /*
      #swagger.tags = ["Banner"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
      #swagger.requestBody = {
        requied: true,
        content: {
          "application/json" : {
            schema : {
              $ref: "#/components/schemas/BannerRequest"
            }
          }
        }
      }
    */
);


router.get("/banner", bannerController.findAll
    /*
      #swagger.tags = ["Banner"]
    */
);

router.get("/banner/:id", bannerController.findOne
    /*
      #swagger.tags = ["Banner"]
    */
);

router.put("/banner/:id", [authMiddleware, aclMiddleware(["admin"])], bannerController.update
    /*
      #swagger.tags = ["Banner"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
      #swagger.requestBody = {
        requied: true,
        content: {
          "application/json" : {
            schema : {
              $ref: "#/components/schemas/BannerRequest"
            }
          }
        }
      }
    */
);

router.delete("/banner/:id", [authMiddleware, aclMiddleware(["admin"])], bannerController.remove
    /*
      #swagger.tags = ["Banner"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////







//////////////////////////////////////////////////////////////////////////////////////////////////////////////





router.post("/cart", [authMiddleware], cartController.create
    /*
      #swagger.tags = ["Cart"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
      #swagger.requestBody = {
        requied: true,
        content: {
          "application/json" : {
            schema : {
              $ref: "#/components/schemas/CartRequest"
            }
          }
        }
      }
    */
);

router.get("/cart", [authMiddleware], cartController.findAll
    /*
      #swagger.tags = ["Cart"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);

router.get("/cart/:id", [authMiddleware], cartController.findById
    /*
      #swagger.tags = ["Cart"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);

router.put("/cart/:id/plus", [authMiddleware], cartController.plus
    /*
      #swagger.tags = ["Cart"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);

router.put("/cart/:id/min", [authMiddleware], cartController.min
    /*
      #swagger.tags = ["Cart"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);

router.delete("/cart/:id", [authMiddleware], cartController.delete
    /*
      #swagger.tags = ["Cart"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);


router.delete("/delete-all-carts", [authMiddleware], cartController.deleteAll
    /*
      #swagger.tags = ["Cart"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);




//////////////////////////////////////////////////////////////////////////////////////////////////////////////








//////////////////////////////////////////////////////////////////////////////////////////////////////////////



router.post("/orders",[authMiddleware], orderController.create
    /**
      #swagger.tags = ["Orders"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
      #swagger.requestBody = {
        requied: true,
        content: {
          "application/json" : {
            schema : {
              $ref: "#/components/schemas/OrderRequest"
            }
          }
        }
      }
    */
);

router.post("/payment/webhook", orderController.webhook
    /*
      #swagger.tags = ["Orders"]
    */
);

router.get("/orders", [authMiddleware, aclMiddleware(["admin"])], orderController.findAll
    /*
      #swagger.tags = ["Orders"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);

router.get("/orders/:id", [authMiddleware], orderController.findById
    /*
      #swagger.tags = ["Orders"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);

router.get("/my-orders", [authMiddleware], orderController.findByUser
    /*
      #swagger.tags = ["Orders"]
      #swagger.security = [{
        "bearerAuth" : []
      }]
    */
);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////





export default router;