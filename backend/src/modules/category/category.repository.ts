import { Category } from "@prisma/client";
import { ICategoryRepository } from "./category.interface.js";
import { prisma } from "../../lib/prisma.js";
import { updateCategoryDTO } from "./category.schema.js";

export class CategoryRepository implements ICategoryRepository {
    async createCategory(data: { 
        categoryName: string; 
        categoryDescription: string;
    }): Promise<Category> {
        const newCategory = await prisma.category.create({
            data,
        });

        return newCategory;
    }

    async findCategoryByName(categoryName: string) {
        const category = await prisma.category.findUnique({
            where: {
                categoryName,
            },
        });

        return category;
    }

    async findCategoryById(categoryId: string): Promise<Category | null> {
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        });

        return category;
    }

    async getAllCategories() {
        const categories = await prisma.category.findMany();

        return categories;
    }

    async updateCategory(data: updateCategoryDTO, categoryId: string) {
        const updatedCategory = await prisma.category.update({
            where: {
                id: categoryId,
            },
            data,
        });

        return updatedCategory;
    }

    async deleteCategoryById(categoryId: string): Promise<any> {
        await prisma.category.delete({
            where: {
                id: categoryId,
            }
        });
    }
}