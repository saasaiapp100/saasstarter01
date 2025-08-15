'use client';

import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Customer } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CustomersPage() {
  const { data: customers, error } = useSWR<Customer[]>('/api/customers', fetcher);

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link href="/customers/new">
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Customer
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div>Failed to load customers.</div>}
          {!customers && !error && <div>Loading...</div>}
          {customers && (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-t">
                    <td className="py-4">{customer.name}</td>
                    <td className="py-4">{customer.email}</td>
                    <td className="py-4">{customer.phone}</td>
                    <td className="py-4 text-right">
                      <Link href={`/customers/${customer.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
