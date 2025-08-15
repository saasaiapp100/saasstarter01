import { getUser, getCustomerDetails } from '@/lib/db/queries';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const customerId = parseInt(params.id, 10);
  if (isNaN(customerId)) {
    return new Response('Invalid customer ID', { status: 400 });
  }

  const customerDetails = await getCustomerDetails(customerId);
  if (!customerDetails) {
    return new Response('Customer not found', { status: 404 });
  }

  return Response.json(customerDetails);
}
