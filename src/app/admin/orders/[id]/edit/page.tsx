import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { OrderForm } from "@/components/OrderForm";
import { updateOrder } from "@/app/actions/orders";

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id } });

  if (!order) notFound();

  const boundUpdateOrder = async (formData: FormData) => {
    "use server";
    await updateOrder(id, formData);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Order</h1>
      <OrderForm order={order} action={boundUpdateOrder} />
    </div>
  );
}
