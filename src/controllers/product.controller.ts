import { Request, Response } from "express"
import response from "../utils/response"
import { IReqUser } from "../utils/interface"
import ProductModel, {  IProductForm, productDTO } from "../models/product.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try{
            const id = req.user?.id;
            const payload = {...req.body, createdBy: id};
            await productDTO.validate(payload);

            const result = await ProductModel.create(payload);
            
            if(!result) {
                return response.error(res, null, "failed to create product");
            }

            response.success(res, result, "success to create product");
        }catch(error) {
            response.error(res, error, "failed to create product");
        }
    },

    async findAll(req: Request, res: Response) {
        try {
            const {page = 1, limit = 8, search, publish, featured, discount, category} = req.query as {page: string | number; limit: string | number; search: string; publish: string; featured: string; discount: string; category: string};

            const handleQuery = (search?: string, featured?: string, publish?: string, discount?:string, category?:string) => {
                let query:FilterQuery<IProductForm> = {};
                if(search) {
                    query.$text = {$search: search}
                }

                if(publish) {
                    query.isPublish = publish === "true"
                }

                if(featured) {
                    query.isFeatured = featured === "true"
                }

                if(discount) {
                    query.discount = {$gt: 0}
                }

                if(category) {
                    query.categoryId = category
                }
                return query;
            }

            const query = handleQuery(search, featured, publish, discount, category);

            const result = await ProductModel.find({...query, isDeleted: false}).populate("categoryId", "name").limit(+limit).skip((+page - 1) * +limit).sort({createdAt: -1}).exec();

            const count = await ProductModel.countDocuments({...query, isDeleted: false});

            response.pagination(res, result, {total: +count, totalPage: Math.ceil(+count / +limit), current: +page}, "success to find all products");
        }catch(error) {
            response.error(res, error, "failed to find products");
        }
    },

    async findOneByID(req: Request, res: Response) {
        try {
            const {id} = req.params;

            if(!isValidObjectId(id)) {
                return response.notFound(res, "product is not found");
            }

            const filter: FilterQuery<IProductForm> = {isDeleted: false}

            const result = await ProductModel.findOne({
                _id: id,
                ...filter
            });

            if(!result) {
                return response.notFound(res, "product is not found");
            }

            response.success(res, result, "success to find product by id");
            
        }catch(error) {
            response.error(res, error, "failed to find product by id");
        }
    },

    async findOneBySlug(req: Request, res: Response) {
        try {
            const {slug} = req.params;

            const filter: FilterQuery<IProductForm> = {isDeleted: false, isPublish: true}

            const result = await ProductModel.findOne({...filter, slug: slug});

            if(!result) {
                return response.notFound(res, "product is not found");
            }

            response.success(res, result, "success to find product by slug");
            
        }catch(error) {
            response.error(res, error, "failed to find product by slug");
        }
    },

    async update(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;

            if(!isValidObjectId(id)) {
                return response.notFound(res, "product is not found");
            }

            const result = await ProductModel.findByIdAndUpdate(id, {
                ...req.body
            }, {
                new: true
            });

            if(!result) {
                return response.error(res, null, "failed to update product")
            }
            
            response.success(res, result, "success to update product");
        }catch(error) {
            response.error(res, error, "failed to update product");
        }
    },

    async delete(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;

            if(!isValidObjectId(id)) {
                return response.notFound(res, "product is not found");
            }

            const result = await ProductModel.findByIdAndUpdate(id, {
                isDeleted: true
            }, {
                new: true
            });

            if(!result) {
                return response.error(res, null, "failed to delete product")
            }

            response.success(res, result, "success to delete product");

        }catch(error) {
            response.error(res, error, "failed delete product")
        }
    },

    async findDelete(req: IReqUser, res: Response) {
        try {
            const {page = 1, limit = 8, search} = req.query as {page: string | number; limit: string | number; search: string;};

            const setQuery = (search?: string) => {
                let query: FilterQuery<IProductForm> = {};
                
                if(search) {
                    query.$text = {$search: search}
                }

                return query;
            }

            const query = setQuery(search);

            const result = await ProductModel.find({...query, isDeleted: true}).limit(+limit).skip((+page - 1) * +limit).sort({createdAt: -1}).exec();

            const total = await ProductModel.countDocuments({...query, isDeleted: true});

            response.pagination(res, result, {total: +total, totalPage: Math.ceil(+total / +limit), current: +page}, "success find delete product");

        }catch(error) {
            response.error(res, error, "failed delete product")
        }
    }
}