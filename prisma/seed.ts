import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  await db.car.createMany({
    data: [
      {
        make: "Toyota",
        model: "Camry SE",
        year: 2019,
        price: 9800,
        mileage: 62000,
        options: "Backup camera, Bluetooth, Cruise control, Alloy wheels",
        optionsAr: "كاميرا خلفية، بلوتوث، مثبت سرعة، جنوط ألمنيوم",
        condition: "Clean title, minor rear bumper scratch",
        conditionAr: "سند ملكية نظيف، خدش بسيط في الصادم الخلفي",
        description:
          "Well-maintained Camry with clean title. Runs and drives, no mechanical issues reported at auction.",
        descriptionAr:
          "كامري بحالة جيدة وسند ملكية نظيف. تعمل وتُقاد بشكل جيد، ولم يتم الإبلاغ عن أي مشاكل ميكانيكية في المزاد.",
        images:
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800,https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
        status: "available",
      },
      {
        make: "Honda",
        model: "Civic EX",
        year: 2020,
        price: 10500,
        mileage: 48000,
        options: "Backup sensors, Sunroof, Heated seats, Apple CarPlay",
        optionsAr: "حساسات خلفية، فتحة سقف، مقاعد مدفأة، آبل كار بلاي",
        condition: "Clean title",
        conditionAr: "سند ملكية نظيف",
        description: "Low mileage Civic, great fuel economy, ideal daily driver.",
        descriptionAr: "سيفيك بممشى منخفض، اقتصادية في استهلاك الوقود، مثالية للاستخدام اليومي.",
        images: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800",
        status: "available",
      },
      {
        make: "Ford",
        model: "F-150 XLT",
        year: 2018,
        price: 15200,
        mileage: 81000,
        options: "Tow package, Backup camera, Running boards",
        optionsAr: "مجموعة سحب، كاميرا خلفية، درجات جانبية",
        condition: "Salvage title, front-end damage repaired",
        conditionAr: "سند ملكية تالف (تم الإصلاح)، تم إصلاح ضرر في المقدمة",
        description: "Powerful and reliable pickup, repaired front-end damage, drives smoothly.",
        descriptionAr: "بيك أب قوي وموثوق، تم إصلاح ضرر في المقدمة، تُقاد بسلاسة.",
        images: "https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?w=800",
        status: "available",
      },
      {
        make: "BMW",
        model: "3 Series 330i",
        year: 2021,
        price: 18900,
        mileage: 32000,
        options: "Leather seats, Sunroof, Parking sensors, Navigation",
        optionsAr: "مقاعد جلدية، فتحة سقف، حساسات ركن، نظام ملاحة",
        condition: "Clean title",
        conditionAr: "سند ملكية نظيف",
        description: "Sporty, low-mileage sedan arriving next shipment.",
        descriptionAr: "سيارة سيدان رياضية بممشى منخفض، قادمة في الشحنة القادمة.",
        images: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
        status: "incoming",
        expectedArrival: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
      },
    ],
  });

  await db.review.createMany({
    data: [
      {
        customerName: "Charbel K.",
        carPurchased: "2019 Toyota Camry",
        rating: 5,
        comment:
          "Smooth process from bidding to delivery. The car arrived exactly as described. Highly recommend BidShipDrive.",
      },
      {
        customerName: "Rana H.",
        carPurchased: "2020 Honda Civic",
        rating: 5,
        comment: "Saved a lot compared to buying locally. Great communication throughout.",
      },
    ],
  });

  await db.order.create({
    data: {
      trackingCode: "BSD-DEMO1",
      customerName: "Demo Customer",
      customerPhone: "+96170123456",
      customerEmail: "demo-customer@example.com",
      carDescription: "2020 Honda Civic EX",
      status: "shipped",
      estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      notes:
        "This is sample data — try tracking code BSD-DEMO1 with phone +96170123456 or email demo-customer@example.com.",
    },
  });
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
