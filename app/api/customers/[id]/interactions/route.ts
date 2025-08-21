import { NextRequest } from 'next/server';
import { getUser, createCustomerInteraction } from '@/lib/db/queries';
import { NewCustomerInteraction } from '@/lib/db/schema';

type RouteContext = { params: { id: string } };

export async function POST(request: NextRequest, { params }: RouteContext) {
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const customerId = parseInt(params.id, 10);
  if (isNaN(customerId)) {
    return new Response('Invalid customer ID', { status: 400 });
  }

  const data = await request.json();

  const newInteraction: NewCustomerInteraction = {
    ...data,
    customerId,
    userId: user.id
  };

  const interaction = await createCustomerInteraction(newInteraction);
  return Response.json(interaction);
}
