import { getUser, createCustomerInteraction } from '@/lib/db/queries';
import { NewCustomerInteraction } from '@/lib/db/schema';

export async function POST(
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

  const { customerId: _, ...interactionData } = await request.json();

  const newInteraction: NewCustomerInteraction = {
    ...interactionData,
    customerId,
    userId: user.id,
  };

  const interaction = await createCustomerInteraction(newInteraction);
  return Response.json(interaction);
}
