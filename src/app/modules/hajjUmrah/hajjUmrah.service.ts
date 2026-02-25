import { IHajjUmrah, IHajjUmrahFilters } from './hajjUmrah.interface';
import { HajjUmrah } from './hajjUmrah.model';
import AppError from '../../utils/AppError';

const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

const createPackage = async (payload: IHajjUmrah): Promise<IHajjUmrah> => {
    let slug = generateSlug(payload.name);
    const existing = await HajjUmrah.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;
    payload.slug = slug;
    return await HajjUmrah.create(payload);
};

const getAllPackages = async (filters: IHajjUmrahFilters, page = 1, limit = 200) => {
    const query: any = {};
    if (filters.searchTerm) {
        query.$or = [
            { name: { $regex: filters.searchTerm, $options: 'i' } },
            { nameBn: { $regex: filters.searchTerm, $options: 'i' } },
            { hotel: { $regex: filters.searchTerm, $options: 'i' } },
        ];
    }
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        HajjUmrah.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
        HajjUmrah.countDocuments(query),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const getPackageById = async (id: string): Promise<IHajjUmrah> => {
    const pkg = await HajjUmrah.findById(id).lean();
    if (!pkg) throw new AppError(404, 'Package not found');
    return pkg;
};

const getPackageBySlug = async (slug: string): Promise<IHajjUmrah> => {
    const pkg = await HajjUmrah.findOne({ slug }).lean();
    if (!pkg) throw new AppError(404, 'Package not found');
    return pkg;
};

const updatePackage = async (id: string, payload: Partial<IHajjUmrah>): Promise<IHajjUmrah> => {
    if (payload.name) payload.slug = generateSlug(payload.name);
    const pkg = await HajjUmrah.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
    if (!pkg) throw new AppError(404, 'Package not found');
    return pkg;
};

const deletePackage = async (id: string): Promise<IHajjUmrah> => {
    const pkg = await HajjUmrah.findByIdAndDelete(id).lean();
    if (!pkg) throw new AppError(404, 'Package not found');
    return pkg;
};

const getActivePackages = async () => {
    return await HajjUmrah.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
};

const getFeaturedPackages = async () => {
    return await HajjUmrah.find({ isActive: true, isFeatured: true }).sort({ order: 1 }).lean();
};

const getByType = async (type: string) => {
    return await HajjUmrah.find({ isActive: true, type }).sort({ order: 1, createdAt: -1 }).lean();
};

export const HajjUmrahService = {
    createPackage,
    getAllPackages,
    getPackageById,
    getPackageBySlug,
    updatePackage,
    deletePackage,
    getActivePackages,
    getFeaturedPackages,
    getByType,
};
