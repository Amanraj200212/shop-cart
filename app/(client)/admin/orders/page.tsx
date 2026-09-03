import Container from "@/components/Container";
import NoAccess from "@/components/NoAccess";
import AdminOrdersDashboard from "@/components/admin/AdminOrdersDashboard";
import { getAdminAccess } from "@/lib/admin";
import { getAllOrders } from "@/sanity/queries";

const AdminOrdersPage = async () => {
  const access = await getAdminAccess();

  if (!access.isAdmin) {
    return (
      <NoAccess details={access.reason} />
    );
  }

  const orders = await getAllOrders();

  return (
    <Container className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-shop_dark_green">Admin Orders</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage local delivery and store pickup orders from one place.
        </p>
      </div>
      <AdminOrdersDashboard orders={orders} />
    </Container>
  );
};

export default AdminOrdersPage;
