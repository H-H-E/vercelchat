import { SettingsForm } from '@/components/settings-form';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <SettingsForm />
      </div>
    </div>
  );
} 