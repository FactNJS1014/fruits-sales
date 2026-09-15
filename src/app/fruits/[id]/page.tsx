import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import ReservationForm from "@/components/fruits/ReservationForm";
import { MapPin, Calendar, PackageCheck } from "lucide-react";

export default async function FruitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fruit = await prisma.fruit.findUnique({ where: { id } });

  if (!fruit) notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
        {/* Image Container */}
        <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
          <Image
            src={fruit.imageUrl}
            alt={fruit.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Details */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
              {fruit.category}
            </span>
            <h1 className="text-3xl font-bold text-slate-900">{fruit.name}</h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              {fruit.description}
            </p>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 text-sm">
              <div className="flex items-center space-x-2 text-slate-600">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>
                  แหล่งกำเนิด: <strong>{fruit.origin}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>
                  ฤดูกาล: <strong>{fruit.harvestSeason}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <PackageCheck className="w-4 h-4 text-blue-600" />
                <span>
                  คงเหลือ:{" "}
                  <strong className="text-slate-900">
                    {fruit.stock} {fruit.unit}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-blue-600">
                {formatPrice(Number(fruit.price))}
              </span>
              <span className="text-slate-500 font-medium">/ {fruit.unit}</span>
            </div>
          </div>

          {/* Interactive Reservation Form */}
          <ReservationForm
            fruit={{
              id: fruit.id,
              price: Number(fruit.price),
              stock: fruit.stock,
              unit: fruit.unit,
              minOrder: fruit.minOrder,
              maxOrder: fruit.maxOrder,
            }}
          />
        </div>
      </div>
    </div>
  );
}
