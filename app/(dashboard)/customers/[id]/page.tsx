'use client';

import useSWR, { useSWRConfig } from 'swr';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Customer, CustomerInteraction, User } from '@/lib/db/schema';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type CustomerDetails = Customer & {
  interactions: (CustomerInteraction & { user: Pick<User, 'id' | 'name'> })[];
};

export default function CustomerDetailPage() {
  const params = useParams();
  const { id } = params;
  const { data: customer, error } = useSWR<CustomerDetails>(
    id ? `/api/customers/${id}` : null,
    fetcher
  );
  const { mutate } = useSWRConfig();

  const [interactionType, setInteractionType] = useState('');
  const [interactionNotes, setInteractionNotes] = useState('');
  const [formError, setFormError] = useState('');

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const res = await fetch(`/api/customers/${id}/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: interactionType,
        notes: interactionNotes,
        interactionDate: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      setInteractionType('');
      setInteractionNotes('');
      mutate(`/api/customers/${id}`);
    } else {
      const errorData = await res.json();
      setFormError(errorData.message || 'Failed to add interaction');
    }
  };

  if (error) return <div>Failed to load customer details.</div>;
  if (!customer) return <div>Loading...</div>;

  return (
    <main className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{customer.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
          <p><strong>Address:</strong> {customer.address}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Interaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {customer.interactions.map((interaction) => (
                <li key={interaction.id} className="border-b pb-4">
                  <p className="font-semibold">{interaction.type}</p>
                  <p>{interaction.notes}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(interaction.interactionDate).toLocaleString()} by {interaction.user.name}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Interaction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddInteraction} className="space-y-4">
              <div>
                <Label htmlFor="type">Interaction Type</Label>
                <Input id="type" value={interactionType} onChange={(e) => setInteractionType(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" value={interactionNotes} onChange={(e) => setInteractionNotes(e.target.value)} required />
              </div>
              {formError && <p className="text-red-500">{formError}</p>}
              <Button type="submit">Add Interaction</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
