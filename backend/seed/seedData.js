import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { connectDB } from '../config/db.js';

dotenv.config();

export const seedDB = async () => {
  try {
    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    console.log('[Seed] Creating demo users...');
    // Create Users (Admin, Landlords, Renters)
    const admin = await User.create({
      name: 'Sarah Jenkins (Admin)',
      email: 'admin@househunt.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bio: 'HouseHunt Platform Administrator & Lead Moderator',
    });

    const landlord1 = await User.create({
      name: 'Vikram Malhotra',
      email: 'landlord@househunt.com',
      password: 'Landlord@123',
      role: 'owner',
      phone: '+91 98111 22334',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Superhost & Prime Property Investor in Bangalore and Mumbai.',
    });

    const landlord2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@househunt.com',
      password: 'Landlord@123',
      role: 'owner',
      phone: '+91 98222 33445',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Architect & Landlord specializing in luxury villas and designer apartments.',
    });

    const renter = await User.create({
      name: 'Rahul Verma',
      email: 'renter@househunt.com',
      password: 'Renter@123',
      role: 'tenant',
      phone: '+91 98333 44556',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Software Engineer relocating to tech hub. Looking for tranquil modern living.',
    });

    console.log('[Seed] Creating curated rental properties...');
    const propertiesData = [
      {
        title: 'Skyline Azure 3BHK Penthouse with Private Terrace',
        description: 'Exquisite 3BHK penthouse offering breathtaking panoramic views of the city skyline. Features Italian marble flooring, expansive floor-to-ceiling soundproof glass windows, modular German kitchen with built-in Bosch appliances, and a lavish landscaped private terrace garden. Located in a high-security gated community with Olympic-sized pool and club house.',
        propertyType: 'Penthouse',
        price: 75000,
        securityDeposit: 150000,
        address: 'Tower 4, 18th Floor, Indiranagar 100ft Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560038',
        bedrooms: 3,
        bathrooms: 3,
        areaSqFt: 2450,
        furnishing: 'Furnished',
        amenities: ['WiFi', 'Air Conditioning', 'Swimming Pool', 'Gym', 'Parking', 'Power Backup', 'Security', 'Pet Friendly'],
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        ],
        videoTourUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        owner: landlord1._id,
        status: 'approved',
        isAvailable: true,
        featured: true,
        ratingsAverage: 4.9,
        ratingsCount: 14,
      },
      {
        title: 'Minimalist Garden Villa with Private Pool & Lawn',
        description: 'Designed by international architects, this signature 4-bedroom villa seamlessly combines Scandinavian minimalism with lush tropical gardens. Boasts an infinity plunge pool, smart home automation (lighting, climate, surveillance), solar water heating, and a double-height lounge with wooden deck patio.',
        propertyType: 'Villa',
        price: 120000,
        securityDeposit: 300000,
        address: 'Bungalow 12, Palm Meadows, Whitefield',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560066',
        bedrooms: 4,
        bathrooms: 4,
        areaSqFt: 3800,
        furnishing: 'Furnished',
        amenities: ['WiFi', 'Air Conditioning', 'Swimming Pool', 'Gym', 'Parking', 'Power Backup', 'Security', 'Pet Friendly'],
        images: [
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        ],
        videoTourUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        owner: landlord2._id,
        status: 'approved',
        isAvailable: true,
        featured: true,
        ratingsAverage: 5.0,
        ratingsCount: 9,
      },
      {
        title: 'Sea-Breeze Modern 2BHK Waterfront Apartment',
        description: 'Wake up to the gentle Arabian Sea waves in this beautifully maintained 2BHK sea-facing residence. Highlights include wide balcony overlooking the promenade, central AC, teakwood furnishings, high-speed fiber internet, and 2 designated covered basement parking spaces.',
        propertyType: 'Apartment',
        price: 68000,
        securityDeposit: 140000,
        address: 'Sea View Heights, Carter Road, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        bedrooms: 2,
        bathrooms: 2,
        areaSqFt: 1150,
        furnishing: 'Furnished',
        amenities: ['WiFi', 'Air Conditioning', 'Gym', 'Parking', 'Power Backup', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
        ],
        videoTourUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        owner: landlord1._id,
        status: 'approved',
        isAvailable: true,
        featured: true,
        ratingsAverage: 4.8,
        ratingsCount: 19,
      },
      {
        title: 'Urban Chic Studio Apartment near Cyber City',
        description: 'Perfect for working professionals and digital nomads. This fully furnished studio features ergonomic work desk, high-speed 300 Mbps WiFi, smart TV, kitchenette with microwave and induction, and premium memory foam mattress. Walkable distance to metro and major IT offices.',
        propertyType: 'Studio',
        price: 26000,
        securityDeposit: 50000,
        address: 'DLF Phase 2, Sector 25, Near Cyber Hub',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        bedrooms: 1,
        bathrooms: 1,
        areaSqFt: 520,
        furnishing: 'Furnished',
        amenities: ['WiFi', 'Air Conditioning', 'Power Backup', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80',
        ],
        videoTourUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        owner: landlord2._id,
        status: 'approved',
        isAvailable: true,
        featured: false,
        ratingsAverage: 4.7,
        ratingsCount: 8,
      },
      {
        title: 'Spacious 3BHK Independent House with Terrace & Garden',
        description: 'Peaceful independent duplex home in quiet residential sector. Features large living hall, dedicated prayer room, covered car porch for 2 SUVs, private open terrace, and solar backup. Close to international schools, organic markets, and recreation parks.',
        propertyType: 'Independent House',
        price: 45000,
        securityDeposit: 90000,
        address: 'Road No. 10, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        bedrooms: 3,
        bathrooms: 3,
        areaSqFt: 2100,
        furnishing: 'Semi-Furnished',
        amenities: ['Parking', 'Power Backup', 'Security', 'Pet Friendly'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        ],
        videoTourUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        owner: landlord1._id,
        status: 'approved',
        isAvailable: true,
        featured: false,
        ratingsAverage: 4.6,
        ratingsCount: 6,
      },
      {
        title: 'Green View 2BHK Gated Community Apartment',
        description: 'Sunlit and naturally ventilated 2BHK apartment in prestigious gated society. Amenities include 24/7 clubhouse, tennis court, running track, children play park, intercom security, and grocery mart on premises. Semi-furnished with wardrobes and kitchen cabinets.',
        propertyType: 'Apartment',
        price: 32000,
        securityDeposit: 65000,
        address: 'Pride World City, Charholi Budruk',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '412105',
        bedrooms: 2,
        bathrooms: 2,
        areaSqFt: 1080,
        furnishing: 'Semi-Furnished',
        amenities: ['Gym', 'Swimming Pool', 'Parking', 'Power Backup', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
        ],
        videoTourUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        owner: landlord2._id,
        status: 'approved',
        isAvailable: true,
        featured: false,
        ratingsAverage: 4.8,
        ratingsCount: 11,
      },
      // PENDING PROPERTIES - Specifically seeded for Admin Approval Workflow
      {
        title: 'Heritage Colonial Bungalow with Courtyard (Needs Review)',
        description: 'Charming vintage bungalow restored with heritage teakwood pillars, central courtyard, brass fittings, and private garden patio. Landlord submitted listing for review.',
        propertyType: 'Independent House',
        price: 52000,
        securityDeposit: 110000,
        address: 'Besant Nagar 4th Avenue, Near Beach',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600090',
        bedrooms: 3,
        bathrooms: 3,
        areaSqFt: 1950,
        furnishing: 'Semi-Furnished',
        amenities: ['Parking', 'Power Backup', 'Security', 'Pet Friendly'],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
        ],
        owner: landlord1._id,
        status: 'pending',
        isAvailable: true,
        featured: false,
        ratingsAverage: 4.5,
        ratingsCount: 0,
      },
      {
        title: 'Modern High-Rise 1BHK Smart Loft (Needs Review)',
        description: 'Brand new high-tech studio loft with home automation, motorized shades, walk-in closet, and balcony view. Awaiting admin approval.',
        propertyType: 'Studio',
        price: 34000,
        securityDeposit: 70000,
        address: 'Tower C, Financial District, Nanakramguda',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500032',
        bedrooms: 1,
        bathrooms: 1,
        areaSqFt: 680,
        furnishing: 'Furnished',
        amenities: ['WiFi', 'Air Conditioning', 'Gym', 'Swimming Pool', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502005229762-ee152da915d6?auto=format&fit=crop&w=1200&q=80',
        ],
        owner: landlord2._id,
        status: 'pending',
        isAvailable: true,
        featured: false,
        ratingsAverage: 4.7,
        ratingsCount: 0,
      },
    ];

    const createdProperties = await Property.insertMany(propertiesData);
    console.log(`[Seed] Seeded ${createdProperties.length} properties.`);

    // Create sample reviews
    await Review.create({
      property: createdProperties[0]._id,
      user: renter._id,
      rating: 5,
      comment: 'Absolutely stunning penthouse! The sunset views from the terrace are breathtaking and Vikram was an outstanding and responsive host.',
    });

    await Review.create({
      property: createdProperties[2]._id,
      user: renter._id,
      rating: 5,
      comment: 'Prime Carter road location! Morning jogs along the promenade and clean, breezy apartment made this an unforgettable stay.',
    });

    // Create sample bookings
    // 1. Confirmed booking
    await Booking.create({
      property: createdProperties[0]._id,
      tenant: renter._id,
      owner: landlord1._id,
      moveInDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      durationMonths: 12,
      monthlyRent: createdProperties[0].price,
      totalDeposit: createdProperties[0].securityDeposit,
      status: 'confirmed',
      paymentStatus: 'paid',
      tenantMessage: 'Hello Vikram, we are moving from Pune and looking forward to making this penthouse our home!',
      ownerNotes: 'Confirmed! Lease agreement drafted and key handover scheduled.',
    });

    // 2. Pending booking request for landlord to review
    await Booking.create({
      property: createdProperties[1]._id,
      tenant: renter._id,
      owner: landlord2._id,
      moveInDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      durationMonths: 11,
      monthlyRent: createdProperties[1].price,
      totalDeposit: createdProperties[1].securityDeposit,
      status: 'pending',
      paymentStatus: 'unpaid',
      tenantMessage: 'Hi Priya, I loved your villa design! Is it possible to move in by next month with my golden retriever dog?',
    });

    console.log('[Seed] Database successfully seeded with demo accounts, properties, bookings, and reviews!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
};

// Run standalone if invoked directly
if (process.argv[1] && process.argv[1].includes('seedData.js')) {
  (async () => {
    await connectDB();
    await seedDB();
    console.log('[Seed] Done. Exiting process.');
    process.exit(0);
  })();
}
