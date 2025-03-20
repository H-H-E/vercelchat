import { UserList } from '@/components/user-list';
import { UserForm } from '@/components/user-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </div>

      {isFormOpen && (
        <div className="rounded-lg border p-6">
          <UserForm
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}

      <UserList />
    </div>
  );
} 