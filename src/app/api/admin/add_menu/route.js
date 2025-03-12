import Menu from "@/models/Functions/Menu";
import connectDb from "@/lib/db";
import Admin from "@/models/UserModels/Admin";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Improved middleware to validate admin with better error handling and type checking
const validateAdmin = async (req) => {
    try {
        // Connect to database - moved inside try/catch
        await connectDb();
        
        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return { error: 'No cookie found', status: 401 };
        }

        const token = cookieHeader
            .split('; ')
            .find(row => row.startsWith('token='))?.split('=')[1];

        if (!token) {
            return { error: 'No token found. Authentication required.', status: 401 };
        }

        if (!process.env.JWT_SECRET) {
            return { error: 'Server configuration error', status: 500 };
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.id) {
            return { error: 'Invalid token', status: 401 };
        }

        // Admin validation
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return { error: 'Admin not found', status: 404 };
        }

        // Return the validated admin for potential further use
        return { admin, decoded };
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return { error: 'Invalid token', status: 401 };
        } if (error.name === 'TokenExpiredError') {
            return { error: 'Token expired', status: 401 };
        }
        
        console.error('Auth error:', error);
        return { error: 'Authentication error', status: 500 };
    }
};

// Helper function for consistent response formatting
const createResponse = (data, status = 200) => {
    return NextResponse.json(data, { status });
};

// Create new menu
export const POST = async (req) => {
    try {
        const body = await req.json();
        const { day, breakfast, lunch, snacks, dinner } = body;
        
        // Improved validation with specific error messages
        const requiredFields = { day, breakfast, lunch, dinner };
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value || !value.trim())
            .map(([field]) => field);
            
        if (missingFields.length > 0) {
            return createResponse({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, 400);
        }

        // Validate admin
        const authResult = await validateAdmin(req);
        if (authResult.error) {
            return createResponse({
                success: false,
                message: authResult.error
            }, authResult.status);
        }

        // Database is already connected from validateAdmin

        // Check if menu already exists with case-insensitive query
        const existingMenu = await Menu.findOne({ 
            day: { $regex: new RegExp(`^${day}$`, 'i') } 
        });
        
        if (existingMenu) {
            return createResponse({
                success: false,
                message: `Menu for ${day} already exists`
            }, 400);
        }

        // Create new menu with sanitized data
        const sanitizedData = {
            day: day.trim(),
            breakfast: breakfast.trim(),
            lunch: lunch.trim(),
            snacks: snacks ? snacks.trim() : '',
            dinner: dinner.trim(),
            createdBy: authResult.decoded.id
        };
        
        const newMenu = await Menu.create(sanitizedData);
        
        return createResponse({
            success: true,
            message: 'Menu added successfully',
            data: newMenu
        }, 201);
    } catch (error) {
        console.error('POST menu error:', error);
        return createResponse({
            success: false,
            message: 'Failed to add menu'
        }, 500);
    }
};

// Get all menus with optional filtering
export const GET = async (req) => {
    try {
        // Validate admin
        const authResult = await validateAdmin(req);
        if (authResult.error) {
            return createResponse({
                success: false,
                message: authResult.error
            }, authResult.status);
        }

        // Get filter parameters from URL
        const url = new URL(req.url);
        const day = url.searchParams.get('day');
        
        // Build query based on filters
        const query = {};
        if (day) {
            query.day = { $regex: new RegExp(day, 'i') };
        }

        // Get menus with pagination
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const menus = await Menu.find(query)
            .sort({ day: 1 })
            .skip(skip)
            .limit(limit);
            
        // Get total count for pagination metadata
        const total = await Menu.countDocuments(query);

        return createResponse({
            success: true,
            message: 'Menus retrieved successfully',
            data: menus,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('GET menus error:', error);
        return createResponse({
            success: false,
            message: 'Failed to retrieve menus'
        }, 500);
    }
};

// Delete menu by ID
export const DELETE = async (req) => {
    try {
        const body = await req.json();
        const { day } = body;
        
        if (!day) {
            return createResponse({
                success: false,
                message: 'Menu ID is required'
            }, 400);
        }

        // Validate admin
        const authResult = await validateAdmin(req);
        if (authResult.error) {
            return createResponse({
                success: false,
                message: authResult.error
            }, authResult.status);
        }

        // Check if menu exists
        const existingMenu = await Menu.findOne({ day: day });
        if (!existingMenu) {
            return createResponse({
                success: false,
                message: 'Menu not found'
            }, 404);
        }

        // Delete menu
        await Menu.findOneAndDelete(day);

        return createResponse({
            success: true,
            message: 'Menu deleted successfully',
            data: { day }
        });
    } catch (error) {
        console.error('DELETE menu error:', error);
        
        // Handle invalid ObjectId format error
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return createResponse({
                success: false,
                message: 'Invalid menu ID format'
            }, 400);
        }
        
        return createResponse({
            success: false,
            message: 'Failed to delete menu'
        }, 500);
    }
};

// New route for updating existing menu
export const PUT = async (req) => {
    try {
        const body = await req.json();
        const { day, breakfast, lunch, snacks, dinner } = body;
        
        if (!day) {
            return createResponse({
                success: false,
                message: 'Day is required'
            }, 400);
        }

        // Validate required fields
        const requiredFields = { day, breakfast, lunch, dinner };
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value || !value.trim())
            .map(([field]) => field);
            
        if (missingFields.length > 0) {
            return createResponse({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, 400);
        }

        // Validate admin
        const authResult = await validateAdmin(req);
        if (authResult.error) {
            return createResponse({
                success: false,
                message: authResult.error
            }, authResult.status);
        }

        // Check if menu exists
        const existingMenu = await Menu.findOne({ day: day });
        if (!existingMenu) {
            return createResponse({
                success: false,
                message: 'Menu not found'
            }, 404);
        }

        // Check if another menu with the same day exists (excluding current menu)
        if (existingMenu.day.toLowerCase() !== day.toLowerCase()) {
            const duplicateMenu = await Menu.findOne({
                _id: { $ne: id },
                day: { $regex: new RegExp(`^${day}$`, 'i') }
            });
            
            if (duplicateMenu) {
                return createResponse({
                    success: false,
                    message: `Menu for ${day} already exists`
                }, 400);
            }
        }

        // Update menu
        const updatedMenu = await Menu.findOneAndUpdate(
            { day: day },
            { 
                day: day.trim(),
                breakfast: breakfast.trim(),
                lunch: lunch.trim(),
                snacks: snacks ? snacks.trim() : '',
                dinner: dinner.trim(),
                updatedBy: authResult.decoded.id,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        return createResponse({
            success: true,
            message: 'Menu updated successfully',
            data: updatedMenu
        });
    } catch (error) {
        console.error('PUT menu error:', error);
        
        // Handle invalid ObjectId format error
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return createResponse({
                success: false,
                message: 'Invalid menu ID format'
            }, 400);
        }
        
        return createResponse({
            success: false,
            message: 'Failed to update menu'
        }, 500);
    }
};