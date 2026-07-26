import { OrderForm } from "@/components/OrderForm";
import { createOrder } from "@/app/actions/orders";

export default function NewOrderPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Create Order</h1>
      <p className="text-sm text-slate-500 mb-4">
        A tracking code is generated automatically — share it with the customer along with their
        phone number so they can look it up on the Track Your Order page.
      </p>
      <OrderForm action={createOrder} />
    </div>
  );
}
