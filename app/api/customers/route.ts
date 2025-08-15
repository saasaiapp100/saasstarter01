import { getUser, getTeamForUser, createCustomer, getCustomersForTeam } from '@/lib/db/queries';
import { NewCustomer } from '@/lib/db/schema';

export async function GET() {
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const team = await getTeamForUser();
  if (!team) {
    return new Response('Team not found', { status: 404 });
  }

  const customers = await getCustomersForTeam(team.id);
  return Response.json(customers);
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const team = await getTeamForUser();
  if (!team) {
    return new Response('Team not found', { status: 404 });
  }

  const data = await request.json();

  const newCustomer: NewCustomer = {
    ...data,
    teamId: team.id,
  };

  const customer = await createCustomer(newCustomer);
  return Response.json(customer);
}
