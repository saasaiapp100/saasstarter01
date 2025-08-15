'use client';

import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Customer } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CustomerDashboard() {
  const { data: customers, error } = useSWR<Customer[]>('/api/customers', fetcher);

  if (error) return <div>Failed to load dashboard data.</div>;
  if (!customers) return <div>Loading...</div>;

  const totalCustomers = customers.length;
  const recentCustomers = customers
    .filter(
      (c) =>
        new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )
    .slice(0, 5);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalCustomers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Customers (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{recentCustomers.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recently Added Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {recentCustomers.map((customer) => (
                <li key={customer.id} className="border-b py-2">
                  <p className="font-semibold">{customer.name}</p>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
