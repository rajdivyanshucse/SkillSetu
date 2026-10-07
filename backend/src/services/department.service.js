import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';

export const getDepartments = async (organizationId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(100, Number(query.limit) || 50);
  const skip = (page - 1) * limit;

  const where = { organizationId };
  if (query.search) {
    where.name = { contains: query.search, mode: 'insensitive' };
  }

  const [total, departments] = await Promise.all([
    prisma.department.count({ where }),
    prisma.department.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    }),
  ]);

  const totalHeadcount = departments.reduce((sum, d) => sum + (d.headcount || 0), 0);

  const items = departments.map((d) => ({
    id: d.id,
    name: d.name,
    headcount: d.headcount || 0,
    headCount: d.headcount || 0,
    description: d.description || null,
    percentageOfWorkforce: totalHeadcount > 0 ? Number(((d.headcount / totalHeadcount) * 100).toFixed(1)) : 0,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }));

  return {
    items,
    departments: items,
    summary: {
      totalDepartments: total,
      totalHeadcount,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getDepartmentById = async (organizationId, departmentId) => {
  const dept = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  if (!dept || dept.organizationId !== organizationId) {
    throw ApiError.notFound('Department not found', 'DEPARTMENT_NOT_FOUND');
  }

  const allDepts = await prisma.department.findMany({ where: { organizationId } });
  const totalHeadcount = allDepts.reduce((sum, d) => sum + (d.headcount || 0), 0);

  return {
    id: dept.id,
    organizationId: dept.organizationId,
    name: dept.name,
    headcount: dept.headcount || 0,
    headCount: dept.headcount || 0,
    description: dept.description || null,
    percentageOfWorkforce: totalHeadcount > 0 ? Number(((dept.headcount / totalHeadcount) * 100).toFixed(1)) : 0,
    createdAt: dept.createdAt,
    updatedAt: dept.updatedAt,
  };
};

export const createDepartment = async (organizationId, data) => {
  const existing = await prisma.department.findFirst({
    where: {
      organizationId,
      name: data.name,
    },
  });

  if (existing) {
    throw ApiError.conflict('A department with this name already exists in this organization', 'DEPARTMENT_EXISTS');
  }

  const hc = data.headcount !== undefined ? Number(data.headcount) : (data.headCount !== undefined ? Number(data.headCount) : 0);

  const dept = await prisma.department.create({
    data: {
      organizationId,
      name: data.name,
      headcount: hc,
      description: data.description || null,
    },
  });

  return getDepartmentById(organizationId, dept.id);
};

export const updateDepartment = async (organizationId, departmentId, data) => {
  const existing = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Department not found for update', 'DEPARTMENT_NOT_FOUND');
  }

  if (data.name && data.name.toLowerCase() !== existing.name.toLowerCase()) {
    const duplicate = await prisma.department.findFirst({
      where: {
        organizationId,
        name: data.name,
      },
    });
    if (duplicate && duplicate.id !== departmentId) {
      throw ApiError.conflict('Another department with this name already exists', 'DEPARTMENT_NAME_EXISTS');
    }
  }

  const hc = data.headcount !== undefined ? Number(data.headcount) : (data.headCount !== undefined ? Number(data.headCount) : undefined);

  const updated = await prisma.department.update({
    where: { id: departmentId },
    data: {
      ...(data.name && { name: data.name }),
      ...(hc !== undefined && { headcount: hc }),
      ...(data.description !== undefined && { description: data.description }),
    },
  });

  return getDepartmentById(organizationId, updated.id);
};

export const deleteDepartment = async (organizationId, departmentId) => {
  const existing = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Department not found for deletion', 'DEPARTMENT_NOT_FOUND');
  }

  const deleted = await prisma.department.delete({
    where: { id: departmentId },
  });

  return {
    id: deleted.id,
    message: 'Department successfully deleted',
  };
};

export const getWorkforceDistribution = async (organizationId) => {
  const departments = await prisma.department.findMany({
    where: { organizationId },
    orderBy: { headcount: 'desc' },
  });

  const totalHeadcount = departments.reduce((sum, d) => sum + (d.headcount || 0), 0);

  const distribution = departments.map((d) => ({
    departmentId: d.id,
    name: d.name,
    headcount: d.headcount || 0,
    percentage: totalHeadcount > 0 ? Number(((d.headcount / totalHeadcount) * 100).toFixed(1)) : 0,
  }));

  return {
    totalHeadcount,
    departmentCount: departments.length,
    distribution,
  };
};

export default {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getWorkforceDistribution,
};
