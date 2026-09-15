import { Role, UserStatus, FruitStatus, BookingStatus } from "@prisma/client";

export interface UserSession {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
}

export interface FruitItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  minOrder: number;
  maxOrder: number;
  harvestSeason: string;
  origin: string;
  imageUrl: string;
  status: FruitStatus;
  featured: boolean;
}
